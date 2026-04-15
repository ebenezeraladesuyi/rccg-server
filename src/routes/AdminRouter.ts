import express from 'express';
import {
    setupAdmin,
    loginAdmin,
    getAdminProfile,
    changePassword,
    updateEmail,
    forgotPassword,
    resetPassword,
    logoutAdmin,
    checkAuth,
    createAdmin,
    getAllAdmins
} from '../controller/AdminController';
import { authenticateAdmin, checkAdminExists, requireSuperAdmin } from '../middleware/adminAuthMiddleware';

const adminRouter = express.Router();

// Public routes
adminRouter.post('/setup', checkAdminExists, setupAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/forgot-password', forgotPassword);
adminRouter.post('/reset-password', resetPassword);

// Check if admin exists (for frontend to know if setup is needed)
adminRouter.get('/check-setup', async (req, res) => {
    try {
        const adminCount = await require('../model/AdminModel').AdminModel.countDocuments();
        res.json({ 
            success: true, 
            isSetup: adminCount > 0 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Protected routes (require authentication)
adminRouter.get('/profile', authenticateAdmin, getAdminProfile);
adminRouter.put('/change-password', authenticateAdmin, changePassword);
adminRouter.put('/update-email', authenticateAdmin, updateEmail);
adminRouter.post('/logout', authenticateAdmin, logoutAdmin);
adminRouter.get('/check-auth', authenticateAdmin, checkAuth);

// Super Admin only routes
adminRouter.post('/create', authenticateAdmin, requireSuperAdmin, createAdmin);
adminRouter.get('/all', authenticateAdmin, requireSuperAdmin, getAllAdmins);

export default adminRouter;