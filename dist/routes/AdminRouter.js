"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controller/AdminController");
const adminAuthMiddleware_1 = require("../middleware/adminAuthMiddleware");
const adminRouter = express_1.default.Router();
// Public routes
adminRouter.post('/setup', adminAuthMiddleware_1.checkAdminExists, AdminController_1.setupAdmin);
adminRouter.post('/login', AdminController_1.loginAdmin);
adminRouter.post('/forgot-password', AdminController_1.forgotPassword);
adminRouter.post('/reset-password', AdminController_1.resetPassword);
// Check if admin exists (for frontend to know if setup is needed)
adminRouter.get('/check-setup', async (req, res) => {
    try {
        const adminCount = await require('../model/AdminModel').AdminModel.countDocuments();
        res.json({
            success: true,
            isSetup: adminCount > 0
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
// Protected routes (require authentication)
adminRouter.get('/profile', adminAuthMiddleware_1.authenticateAdmin, AdminController_1.getAdminProfile);
adminRouter.put('/change-password', adminAuthMiddleware_1.authenticateAdmin, AdminController_1.changePassword);
adminRouter.put('/update-email', adminAuthMiddleware_1.authenticateAdmin, AdminController_1.updateEmail);
adminRouter.post('/logout', adminAuthMiddleware_1.authenticateAdmin, AdminController_1.logoutAdmin);
adminRouter.get('/check-auth', adminAuthMiddleware_1.authenticateAdmin, AdminController_1.checkAuth);
// Super Admin only routes
adminRouter.post('/create', adminAuthMiddleware_1.authenticateAdmin, adminAuthMiddleware_1.requireSuperAdmin, AdminController_1.createAdmin);
adminRouter.get('/all', adminAuthMiddleware_1.authenticateAdmin, adminAuthMiddleware_1.requireSuperAdmin, AdminController_1.getAllAdmins);
exports.default = adminRouter;
