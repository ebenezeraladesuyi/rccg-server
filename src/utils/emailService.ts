
import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// console.log('smtp', process.env.EMAIL_USER)
// console.log('smt-pass', process.env.EMAIL_PASS)

// Email templates
export const sendBookingConfirmation = async (booking: any) => {
    const { name, email, proposedDate, eventType, expectedGuests, eventStartTime, eventEndTime, additionalNotes, _id } = booking;
    
    const formattedDate = new Date(proposedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: `"Building@RCCG, Dublin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Booking Request Received - RCCG Open Heavens',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28166f, #3a2a8a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #23a1db; }
                    .detail-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #28166f; }
                    .status { display: inline-block; padding: 5px 15px; background: #fef3c7; color: #92400e; border-radius: 20px; font-size: 14px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                    .button { display: inline-block; padding: 10px 20px; background: #23a1db; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Booking Request Received</h2>
                        <p>Thank you for choosing RCCG Open Heavens</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${name}</strong>,</p>
                        <p>We have received your facility booking request. Our team will review your application and get back to you within 24-48 hours.</p>
                        
                        <div class="booking-details">
                            <h3 style="color: #28166f; margin-top: 0;">Booking Details</h3>
                            <div class="detail-row"><span class="label">Booking Reference:</span> ${_id}</div>
                            <div class="detail-row"><span class="label">Event Type:</span> ${eventType}</div>
                            <div class="detail-row"><span class="label">Proposed Date:</span> ${formattedDate}</div>
                            <div class="detail-row"><span class="label">Time:</span> ${eventStartTime} - ${eventEndTime}</div>
                            <div class="detail-row"><span class="label">Expected Guests:</span> ${expectedGuests}</div>
                            ${additionalNotes ? `<div class="detail-row"><span class="label">Additional Notes:</span> ${additionalNotes}</div>` : ''}
                            <div class="detail-row"><span class="label">Status:</span> <span class="status">Pending Review</span></div>
                        </div>
                        
                        <p><strong>What happens next?</strong></p>
                        <ol>
                            <li>Our team will review your request</li>
                            <li>We will check availability for your preferred date</li>
                            <li>You will receive a confirmation email once approved</li>
                            <li>A staff member may contact you for additional details</li>
                        </ol>
                        
                        <p>If you have any questions, please contact us at building@rccgopenheavens.com</p>
                        
                        <div style="text-align: center;">
                            <a href="https://rccgopenheavens.com" class="button">Visit Our Website</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} RCCG Open Heavens Dublin. All rights reserved.</p>
                        <p>This is an automated message, please do not reply directly to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        return false;
    }
};

export const sendStatusUpdateEmail = async (booking: any, status: string, adminNotes?: string) => {
    const { name, email, proposedDate, eventType, _id } = booking;
    
    const formattedDate = new Date(proposedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let statusColor = '';
    let statusTitle = '';
    let statusMessage = '';
    let additionalInfo = '';

    switch (status) {
        case 'approved':
            statusColor = '#10b981';
            statusTitle = 'Booking Approved! 🎉';
            statusMessage = 'Congratulations! Your facility booking request has been approved.';
            additionalInfo = 'A member of our team will contact you shortly to discuss further arrangements and any specific requirements you may have.';
            break;
        case 'rejected':
            statusColor = '#ef4444';
            statusTitle = 'Booking Update';
            statusMessage = 'We regret to inform you that your facility booking request could not be approved at this time.';
            additionalInfo = adminNotes || 'The requested date may not be available or there may be scheduling conflicts. Please contact us to discuss alternative dates.';
            break;
        case 'cancelled':
            statusColor = '#f59e0b';
            statusTitle = 'Booking Cancelled';
            statusMessage = 'Your facility booking has been cancelled as requested.';
            additionalInfo = adminNotes || 'If this was done in error or you wish to reschedule, please contact us as soon as possible.';
            break;
        default:
            statusColor = '#6b7280';
            statusTitle = 'Booking Update';
            statusMessage = 'There has been an update to your booking status.';
    }

    const mailOptions = {
        from: `"Building@RCCG, Dublin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Booking ${status.toUpperCase()} - RCCG Open Heavens`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28166f, #3a2a8a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .status-badge { display: inline-block; padding: 8px 20px; background: ${statusColor}; color: white; border-radius: 30px; font-weight: bold; margin: 15px 0; text-transform: uppercase; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor}; }
                    .detail-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #28166f; }
                    .admin-notes { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                    .button { display: inline-block; padding: 10px 20px; background: #23a1db; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Booking Status Update</h2>
                        <p>RCCG Open Heavens, Dublin</p>
                    </div>
                    <div class="content">
                        <p>Dear <strong>${name}</strong>,</p>
                        
                        <div style="text-align: center;">
                            <div class="status-badge">${status.toUpperCase()}</div>
                        </div>
                        
                        <p>${statusMessage}</p>
                        
                        <div class="booking-details">
                            <h3 style="color: #28166f; margin-top: 0;">Booking Reference: ${_id}</h3>
                            <div class="detail-row"><span class="label">Event Type:</span> ${eventType}</div>
                            <div class="detail-row"><span class="label">Proposed Date:</span> ${formattedDate}</div>
                        </div>
                        
                        ${adminNotes ? `
                            <div class="admin-notes">
                                <strong>📝 Message from Admin:</strong>
                                <p style="margin: 10px 0 0 0;">${adminNotes}</p>
                            </div>
                        ` : ''}
                        
                        <p>${additionalInfo}</p>
                        
                        <p>If you have any questions or need further assistance, please don't hesitate to contact us.</p>
                        
                        <div style="text-align: center;">
                            <a href="mailto:building@rccgopenheavens.com" class="button">Contact Us</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} RCCG Open Heavens Dublin. All rights reserved.</p>
                        <p>RCCG Open Heavens | 220/21 Lee Rd, Dublin Industrial Estate, Glasnevin Dublin 11, Ireland</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to ${email} for booking ${_id}`);
        return true;
    } catch (error) {
        console.error('Error sending status update email:', error);
        return false;
    }
};

// Send email to admin when a new booking is created
export const sendAdminNotification = async (booking: any) => {
    const { name, email, contactNumber, proposedDate, eventType, expectedGuests, eventStartTime, eventEndTime, additionalNotes, _id } = booking;
    
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const formattedDate = new Date(proposedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: `"RCCG Open Heavens Booking System" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: 'New Facility Booking Request - Action Required',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28166f, #3a2a8a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
                    .detail-row { margin: 10px 0; }
                    .label { font-weight: bold; color: #28166f; }
                    .button { display: inline-block; padding: 10px 20px; background: #23a1db; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🔔 New Booking Request</h2>
                        <p>A new facility booking request requires your attention</p>
                    </div>
                    <div class="content">
                        <div class="booking-details">
                            <h3 style="color: #28166f; margin-top: 0;">Booking Reference: ${_id}</h3>
                            
                            <h4 style="color: #28166f; margin-bottom: 10px;">Client Information:</h4>
                            <div class="detail-row"><span class="label">Name:</span> ${name}</div>
                            <div class="detail-row"><span class="label">Email:</span> ${email}</div>
                            <div class="detail-row"><span class="label">Phone:</span> ${contactNumber}</div>
                            
                            <h4 style="color: #28166f; margin-bottom: 10px; margin-top: 20px;">Event Information:</h4>
                            <div class="detail-row"><span class="label">Event Type:</span> ${eventType}</div>
                            <div class="detail-row"><span class="label">Proposed Date:</span> ${formattedDate}</div>
                            <div class="detail-row"><span class="label">Time:</span> ${eventStartTime} - ${eventEndTime}</div>
                            <div class="detail-row"><span class="label">Expected Guests:</span> ${expectedGuests}</div>
                            ${additionalNotes ? `<div class="detail-row"><span class="label">Additional Notes:</span> ${additionalNotes}</div>` : ''}
                        </div>
                        
                        <p><strong>Actions Required:</strong></p>
                        <ol>
                            <li>Review the booking request</li>
                            <li>Check availability for the proposed date</li>
                            <li>Update the booking status (Approve/Reject)</li>
                            <li>Add any admin notes if necessary</li>
                        </ol>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5173'}" class="button">Go to Admin Dashboard</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from your booking system.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Admin notification sent for booking ${_id}`);
        return true;
    } catch (error) {
        console.error('Error sending admin notification:', error);
        return false;
    }
};