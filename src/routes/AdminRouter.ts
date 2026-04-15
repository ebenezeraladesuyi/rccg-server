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
    checkAuth
} from '../controller/AdminController';
import { authenticateAdmin, checkAdminExists } from '../middleware/adminAuthMiddleware';


const adminRouter = express.Router();

// Public routes
adminRouter.post('/setup', checkAdminExists, setupAdmin);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/forgot-password', forgotPassword);
adminRouter.post('/reset-password', resetPassword);

// Check if admin exists (for frontend to know if setup is needed)
adminRouter.get('/check-setup', async (req, res) => {
    try {
        const adminCount = await require('../models/AdminModel').AdminModel.countDocuments();
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

// Protected routes
adminRouter.get('/profile', authenticateAdmin, getAdminProfile);
adminRouter.put('/change-password', authenticateAdmin, changePassword);
adminRouter.put('/update-email', authenticateAdmin, updateEmail);
adminRouter.post('/logout', authenticateAdmin, logoutAdmin);
adminRouter.get('/check-auth', authenticateAdmin, checkAuth);

export default adminRouter;