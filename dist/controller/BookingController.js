"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingStatistics = exports.deleteBooking = exports.updateBookingStatus = exports.getBookingById = exports.getAllBookings = exports.createBooking = void 0;
const BookingModel_1 = require("../model/BookingModel");
// Create new booking
const createBooking = async (req, res) => {
    try {
        const { name, email, contactNumber, proposedDate, eventType, expectedGuests, eventStartTime, eventEndTime, additionalNotes } = req.body;
        // Validate required fields
        if (!name || !email || !contactNumber || !proposedDate || !eventType || !expectedGuests || !eventStartTime || !eventEndTime) {
            res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
            return;
        }
        // Parse and validate date
        const parsedDate = new Date(proposedDate);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
            return;
        }
        // Check for existing bookings on the same date
        const existingBooking = await BookingModel_1.BookingModel.findOne({
            proposedDate: {
                $gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                $lt: new Date(parsedDate.setHours(23, 59, 59, 999))
            },
            status: { $in: ['pending', 'approved'] }
        });
        if (existingBooking) {
            res.status(409).json({
                success: false,
                message: 'There is already a booking for this date. Please choose another date.',
                conflictingBooking: {
                    id: existingBooking._id,
                    eventType: existingBooking.eventType,
                    time: `${existingBooking.eventStartTime} - ${existingBooking.eventEndTime}`
                }
            });
            return;
        }
        // Create new booking
        const newBooking = new BookingModel_1.BookingModel({
            name,
            email,
            contactNumber,
            proposedDate: parsedDate,
            eventType,
            expectedGuests: parseInt(expectedGuests),
            eventStartTime,
            eventEndTime,
            additionalNotes: additionalNotes || '',
            status: 'pending'
        });
        await newBooking.save();
        // Send confirmation email
        // try {
        //     await sendBookingConfirmationEmail(newBooking);
        // } catch (emailError) {
        //     console.error('Failed to send confirmation email:', emailError);
        //     // Don't fail the request if email fails
        // }
        // Send notification to admin
        // try {
        //     await sendAdminNotificationEmail(newBooking);
        // } catch (adminEmailError) {
        //     console.error('Failed to send admin notification:', adminEmailError);
        // }
        res.status(201).json({
            success: true,
            message: 'Booking request submitted successfully',
            data: {
                booking: newBooking,
                referenceId: newBooking._id,
                nextSteps: 'Our team will review your request and contact you within 24-48 hours.'
            }
        });
    }
    catch (error) {
        console.error('Error creating booking:', error);
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
            return;
        }
        // Handle duplicate key errors
        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: 'Duplicate booking detected'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.createBooking = createBooking;
// Get all bookings (with filtering and pagination)
const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, eventType, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const query = {};
        // Apply filters
        if (status)
            query.status = status;
        if (eventType)
            query.eventType = eventType;
        if (startDate || endDate) {
            query.proposedDate = {};
            if (startDate)
                query.proposedDate.$gte = new Date(startDate);
            if (endDate)
                query.proposedDate.$lte = new Date(endDate);
        }
        // Parse pagination parameters
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Determine sort order
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        // Execute query with pagination
        const [bookings, total] = await Promise.all([
            BookingModel_1.BookingModel.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            BookingModel_1.BookingModel.countDocuments(query)
        ]);
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;
        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages,
                hasNextPage,
                hasPrevPage
            }
        });
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getAllBookings = getAllBookings;
// Get booking by ID
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel_1.BookingModel.findById(id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: booking
        });
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        if (error.name === 'CastError') {
            res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getBookingById = getBookingById;
// Update booking status (approve/reject/cancel)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        // Validate status
        const validStatuses = ['approved', 'rejected', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: approved, rejected, cancelled'
            });
            return;
        }
        const booking = await BookingModel_1.BookingModel.findById(id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }
        // Update booking status
        booking.status = status;
        if (adminNotes) {
            booking.additionalNotes = `${booking.additionalNotes}\n\n[Admin Note: ${adminNotes}]`;
        }
        booking.updatedAt = new Date();
        await booking.save();
        // Send status update email to user
        // try {
        //     await sendStatusUpdateEmail(booking, status, adminNotes);
        // } catch (emailError) {
        //     console.error('Failed to send status update email:', emailError);
        // }
        res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            data: booking
        });
    }
    catch (error) {
        console.error('Error updating booking status:', error);
        if (error.name === 'CastError') {
            res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.updateBookingStatus = updateBookingStatus;
// Delete booking (admin only)
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingModel_1.BookingModel.findByIdAndDelete(id);
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
            data: { id }
        });
    }
    catch (error) {
        console.error('Error deleting booking:', error);
        if (error.name === 'CastError') {
            res.status(400).json({
                success: false,
                message: 'Invalid booking ID'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.deleteBooking = deleteBooking;
// Get booking statistics
const getBookingStatistics = async (req, res) => {
    try {
        const stats = await BookingModel_1.BookingModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    pendingBookings: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    approvedBookings: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    totalGuests: { $sum: '$expectedGuests' },
                    averageGuests: { $avg: '$expectedGuests' }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalBookings: 1,
                    pendingBookings: 1,
                    approvedBookings: 1,
                    rejectedBookings: { $subtract: ['$totalBookings', { $add: ['$pendingBookings', '$approvedBookings'] }] },
                    totalGuests: 1,
                    averageGuests: { $round: ['$averageGuests', 0] }
                }
            }
        ]);
        // Get bookings by event type
        const eventTypeStats = await BookingModel_1.BookingModel.aggregate([
            {
                $group: {
                    _id: '$eventType',
                    count: { $sum: 1 },
                    totalGuests: { $sum: '$expectedGuests' }
                }
            },
            { $sort: { count: -1 } }
        ]);
        // Get monthly bookings for the current year
        const currentYear = new Date().getFullYear();
        const monthlyStats = await BookingModel_1.BookingModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({
            success: true,
            data: {
                overview: stats[0] || {},
                eventTypes: eventTypeStats,
                monthly: monthlyStats,
                currentYear
            }
        });
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.getBookingStatistics = getBookingStatistics;
// send booking confirmation email
// const sendBookingConfirmationEmail = async (booking: IBooking): Promise<void> => {
//     const transporter = nodemailer.createTransport({
//         host: config.email.host,
//         port: config.email.port,
//         secure: config.email.secure,
//         auth: {
//             user: config.email.user,
//             pass: config.email.pass
//         }
//     });
//     const mailOptions = {
//         from: `"RCCG Open Heavens" <${config.email.from}>`,
//         to: booking.email,
//         subject: 'Booking Request Confirmation - RCCG Open Heavens',
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                 <h2 style="color: #28166f;">Booking Request Received</h2>
//                 <p>Dear ${booking.name},</p>
//                 <p>Thank you for submitting your booking request with RCCG Open Heavens.</p>
//                 <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                     <h3 style="color: #28166f; margin-top: 0;">Booking Details:</h3>
//                     <p><strong>Reference ID:</strong> ${booking._id}</p>
//                     <p><strong>Event Type:</strong> ${booking.eventType}</p>
//                     <p><strong>Proposed Date:</strong> ${booking.proposedDate}</p>
//                     <p><strong>Time:</strong> ${booking.eventStartTime} - ${booking.eventEndTime}</p>
//                     <p><strong>Expected Guests:</strong> ${booking.expectedGuests}</p>
//                     <p><strong>Contact:</strong> ${booking.contactNumber}</p>
//                 </div>
//                 <p><strong>Current Status:</strong> <span style="color: #ff9800; font-weight: bold;">Pending Review</span></p>
//                 <p>Our team will review your request and contact you within 24-48 hours.</p>
//                 <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                     <p><strong>Next Steps:</strong></p>
//                     <ul>
//                         <li>You will receive an email once your booking is approved or if we need more information</li>
//                         <li>Please keep this reference ID for future communication: ${booking._id}</li>
//                         <li>Contact us at info@rccgopenheavens.com if you need to make changes</li>
//                     </ul>
//                 </div>
//                 <p>Best regards,<br>
//                 <strong>RCCG Open Heavens Team</strong></p>
//                 <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
//                 <p style="font-size: 12px; color: #666;">
//                     RCCG Open Heavens Dublin<br>
//                     20/21 Lee Rd, Dublin Industrial Estate, Glasnevin Dublin 11, Ireland<br>
//                     Phone: +353 (0) 87-416-0229<br>
//                     Email: info@rccgopenheavens.com
//                 </p>
//             </div>
//         `
//     };
//     await transporter.sendMail(mailOptions);
// };
// send admin notification email
// const sendAdminNotificationEmail = async (booking: IBooking): Promise<void> => {
//     const transporter = nodemailer.createTransport({
//         host: config.email.host,
//         port: config.email.port,
//         secure: config.email.secure,
//         auth: {
//             user: config.email.user,
//             pass: config.email.pass
//         }
//     });
//     const mailOptions = {
//         from: `"Booking System" <${config.email.from}>`,
//         to: config.email.admin,
//         subject: `New Booking Request: ${booking.eventType} on ${booking.proposedDate}`,
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                 <h2 style="color: #28166f;">New Booking Request</h2>
//                 <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                     <h3 style="color: #28166f; margin-top: 0;">Booking Details:</h3>
//                     <p><strong>Booking ID:</strong> ${booking._id}</p>
//                     <p><strong>Name:</strong> ${booking.name}</p>
//                     <p><strong>Email:</strong> ${booking.email}</p>
//                     <p><strong>Phone:</strong> ${booking.contactNumber}</p>
//                     <p><strong>Event Type:</strong> ${booking.eventType}</p>
//                     <p><strong>Date:</strong> ${booking.proposedDate}</p>
//                     <p><strong>Time:</strong> ${booking.eventStartTime} - ${booking.eventEndTime}</p>
//                     <p><strong>Guests:</strong> ${booking.expectedGuests}</p>
//                     <p><strong>Submitted:</strong> ${booking.createdAt.toLocaleString()}</p>
//                     ${booking.additionalNotes ? `<p><strong>Notes:</strong> ${booking.additionalNotes}</p>` : ''}
//                 </div>
//                 <p><a href="${config.adminUrl}/bookings/${booking._id}" 
//                      style="background: #28166f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
//                     View & Manage Booking
//                 </a></p>
//             </div>
//         `
//     };
//     await transporter.sendMail(mailOptions);
// };
// // Helper function to send status update email
// const sendStatusUpdateEmail = async (booking: IBooking, status: string, adminNotes?: string): Promise<void> => {
//     const statusColors: Record<string, string> = {
//         approved: '#4CAF50',
//         rejected: '#F44336',
//         cancelled: '#FF9800'
//     };
//     const statusMessages: Record<string, string> = {
//         approved: 'Your booking has been approved!',
//         rejected: 'Your booking request has been declined',
//         cancelled: 'Your booking has been cancelled'
//     };
//     const transporter = nodemailer.createTransport({
//         host: config.email.host,
//         port: config.email.port,
//         secure: config.email.secure,
//         auth: {
//             user: config.email.user,
//             pass: config.email.pass
//         }
//     });
//     const mailOptions = {
//         from: `"RCCG Open Heavens" <${config.email.from}>`,
//         to: booking.email,
//         subject: `Booking Update: ${statusMessages[status]}`,
//         html: `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//                 <h2 style="color: ${statusColors[status]};">${statusMessages[status]}</h2>
//                 <p>Dear ${booking.name},</p>
//                 <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                     <h3 style="color: #28166f; margin-top: 0;">Booking Details:</h3>
//                     <p><strong>Reference ID:</strong> ${booking._id}</p>
//                     <p><strong>Event Type:</strong> ${booking.eventType}</p>
//                     <p><strong>Date:</strong> ${booking.proposedDate}</p>
//                     <p><strong>Time:</strong> ${booking.eventStartTime} - ${booking.eventEndTime}</p>
//                     <p><strong>Expected Guests:</strong> ${booking.expectedGuests}</p>
//                     <p><strong>Status:</strong> <span style="color: ${statusColors[status]}; font-weight: bold;">${status.toUpperCase()}</span></p>
//                 </div>
//                 ${status === 'approved' ? `
//                     <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                         <p><strong>Next Steps:</strong></p>
//                         <ul>
//                             <li>Your booking is now confirmed</li>
//                             <li>Please arrive 30 minutes before the event start time</li>
//                             <li>Contact our event coordinator for any special arrangements</li>
//                         </ul>
//                     </div>
//                 ` : ''}
//                 ${adminNotes ? `
//                     <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                         <p><strong>Admin Note:</strong></p>
//                         <p>${adminNotes}</p>
//                     </div>
//                 ` : ''}
//                 ${status === 'rejected' || status === 'cancelled' ? `
//                     <p>If you have any questions or would like to discuss alternative arrangements, please contact us.</p>
//                 ` : ''}
//                 <p>Best regards,<br>
//                 <strong>RCCG Open Heavens Team</strong></p>
//                 <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
//                 <p style="font-size: 12px; color: #666;">
//                     RCCG Open Heavens Dublin<br>
//                     20/21 Lee Rd, Dublin Industrial Estate, Glasnevin Dublin 11, Ireland<br>
//                     Phone: +353 (0) 87-416-0229<br>
//                     Email: info@rccgopenheavens.com
//                 </p>
//             </div>
//         `
//     };
//     await transporter.sendMail(mailOptions);
// };
