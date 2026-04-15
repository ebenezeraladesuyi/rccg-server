"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BookingController_1 = require("../controller/BookingController");
const validation_1 = require("../middleware/validation");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const bookingRouter = express_1.default.Router();
// Public routes
bookingRouter.post('/book', validation_1.validateBooking, BookingController_1.createBooking);
bookingRouter.get('/public/:id', BookingController_1.getBookingById); // Public viewing of specific booking
// Admin routes (protected)
// bookingRouter.get('/admin', 
//     // authenticate, authorize(['admin', 'superadmin']), 
//     getAllBookings);
// bookingRouter.get('/admin/:id', 
//     // authenticate, authorize(['admin', 'superadmin']), 
//     getBookingById);
// bookingRouter.put('/admin/:id/status', 
//     // authenticate, authorize(['admin', 'superadmin']), 
//     updateBookingStatus);
// bookingRouter.delete('/admin/:id', 
//     // authenticate, authorize(['admin', 'superadmin']), 
//     deleteBooking);
// bookingRouter.get('/admin/stats', 
//     // authenticate, authorize(['admin', 'superadmin']), 
//     getBookingStatistics);
// User routes (authenticated users can view their own bookings)
// router.get('/my-bookings', 
// authenticate, 
// getAllBookings); 
bookingRouter.get('/admin', adminAuthMiddleware_1.requireSuperAdmin, BookingController_1.getAllBookings); // Add requireSuperAdmin here
// bookingRouter.get('/admin/stats', requireSuperAdmin, getBookingStats); // Add requireSuperAdmin here
bookingRouter.get('/admin/:id', adminAuthMiddleware_1.requireSuperAdmin, BookingController_1.getBookingById); // Add requireSuperAdmin here
bookingRouter.put('/admin/:id/status', adminAuthMiddleware_1.requireSuperAdmin, BookingController_1.updateBookingStatus); // Add requireSuperAdmin here
bookingRouter.delete('/admin/:id', adminAuthMiddleware_1.requireSuperAdmin, BookingController_1.deleteBooking); // Add requireSuperAdmin here
exports.default = bookingRouter;
