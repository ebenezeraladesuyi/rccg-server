import express from 'express';
import { createBooking, deleteBooking, getAllBookings, getBookingById, getBookingStatistics, updateBookingStatus } from '../controller/BookingController';
import { validateBooking } from '../middleware/validation';

const bookingRouter = express.Router();

// Public routes
bookingRouter.post('/book', validateBooking, createBooking);
bookingRouter.get('/public/:id', getBookingById); // Public viewing of specific booking

// Admin routes (protected)
bookingRouter.get('/admin', 
    // authenticate, authorize(['admin', 'superadmin']), 
    getAllBookings);
bookingRouter.get('/admin/:id', 
    // authenticate, authorize(['admin', 'superadmin']), 
    getBookingById);
bookingRouter.put('/admin/:id/status', 
    // authenticate, authorize(['admin', 'superadmin']), 
    updateBookingStatus);
bookingRouter.delete('/admin/:id', 
    // authenticate, authorize(['admin', 'superadmin']), 
    deleteBooking);
bookingRouter.get('/admin/stats', 
    // authenticate, authorize(['admin', 'superadmin']), 
    getBookingStatistics);

// User routes (authenticated users can view their own bookings)
// router.get('/my-bookings', 
    // authenticate, 
    // getAllBookings); 

export default bookingRouter;