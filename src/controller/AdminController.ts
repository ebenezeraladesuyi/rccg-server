import { Request, Response } from 'express';
import crypto from 'crypto';
import { generateToken } from '../utils/jwtUtils';
import { AdminModel } from '../model/AdminModel';
import { AdminAuthRequest } from '../middleware/adminAuthMiddleware';

/// Setup first superAdmin (first-time only)
export const setupAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate input
        if (!email || !password || !confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Email, password and confirm password are required' 
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Passwords do not match' 
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ 
                success: false,
                message: 'Password must be at least 8 characters long' 
            });
            return;
        }

        // Create superAdmin (first admin is always superAdmin)
        const admin = new AdminModel({
            email,
            password,
            role: 'superAdmin'
        });

        await admin.save();

        // Generate token
        const token = generateToken({
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        });

        res.status(201).json({
            success: true,
            message: 'Super Admin setup successfully',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false,
                message: 'Email already exists' 
            });
            return;
        }
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Create admin (only superAdmin can do this)
export const createAdmin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        // Check if requester is superAdmin
        if (req.admin?.role !== 'superAdmin') {
            res.status(403).json({ 
                success: false,
                message: 'Access denied. Only Super Admin can create new admins.' 
            });
            return;
        }

        // Validate input
        if (!email || !password || !confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Email, password and confirm password are required' 
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Passwords do not match' 
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ 
                success: false,
                message: 'Password must be at least 8 characters long' 
            });
            return;
        }

        // Check if email already exists
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({ 
                success: false,
                message: 'Email already exists' 
            });
            return;
        }

        // Create new admin (default role is 'admin' if not specified)
        const newAdmin = new AdminModel({
            email,
            password,
            role: role === 'superAdmin' ? 'superAdmin' : 'admin' // Only allow setting superAdmin if explicitly requested
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role,
                createdAt: newAdmin.createdAt
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Login admin
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
            return;
        }

        const admin = await AdminModel.findOne({ email }).select('+password');

        if (!admin) {
            res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
            return;
        }

        const isPasswordValid = await admin.comparePassword(password);
        
        if (!isPasswordValid) {
            res.status(401).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
            return;
        }

        admin.lastLogin = new Date();
        await admin.save();

        const token = generateToken({
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get admin profile
export const getAdminProfile = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    try {
        const admin = await AdminModel.findById(req.admin?.adminId).select('-password');
        
        if (!admin) {
            res.status(404).json({ 
                success: false,
                message: 'Admin not found' 
            });
            return;
        }

        res.status(200).json({
            success: true,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Get all admins (only superAdmin)
export const getAllAdmins = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    try {
        if (req.admin?.role !== 'superAdmin') {
            res.status(403).json({ 
                success: false,
                message: 'Access denied. Only Super Admin can view all admins.' 
            });
            return;
        }

        const admins = await AdminModel.find().select('-password');
        
        res.status(200).json({
            success: true,
            count: admins.length,
            admins
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Change password
export const changePassword = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'All password fields are required' 
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'New passwords do not match' 
            });
            return;
        }

        if (newPassword.length < 8) {
            res.status(400).json({ 
                success: false,
                message: 'New password must be at least 8 characters' 
            });
            return;
        }

        const admin = await AdminModel.findById(req.admin?.adminId).select('+password');

        if (!admin) {
            res.status(404).json({ 
                success: false,
                message: 'Admin not found' 
            });
            return;
        }

        // Verify current password
        const isPasswordValid = await admin.comparePassword(currentPassword);
        
        if (!isPasswordValid) {
            res.status(401).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
            return;
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Update email
export const updateEmail = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
            return;
        }

        const admin = await AdminModel.findById(req.admin?.adminId).select('+password');

        if (!admin) {
            res.status(404).json({ 
                success: false,
                message: 'Admin not found' 
            });
            return;
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        
        if (!isPasswordValid) {
            res.status(401).json({ 
                success: false,
                message: 'Password is incorrect' 
            });
            return;
        }

        // Check if email already exists
        const emailExists = await AdminModel.findOne({ 
            email, 
            _id: { $ne: req.admin?.adminId } 
        });
        
        if (emailExists) {
            res.status(400).json({ 
                success: false,
                message: 'Email already in use' 
            });
            return;
        }

        // Update email
        admin.email = email;
        await admin.save();

        // Generate new token with updated email
        const token = generateToken({
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role,
        });

        res.status(200).json({
            success: true,
            message: 'Email updated successfully',
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Forgot password (send reset email)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
            return;
        }

        const admin = await AdminModel.findOne({ email });

        if (!admin) {
            // Don't reveal that email doesn't exist
            res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a reset link has been sent'
            });
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set reset token and expiry (1 hour)
        admin.resetPasswordToken = resetTokenHash;
        admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        
        await admin.save();

        // In production, you would send an email here
        // For now, return the reset token (in production, remove this)
        res.status(200).json({
            success: true,
            message: 'Password reset token generated',
            // Remove this in production - just for testing
            resetToken: resetToken
            // resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Token, password and confirm password are required' 
            });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ 
                success: false,
                message: 'Passwords do not match' 
            });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ 
                success: false,
                message: 'Password must be at least 8 characters' 
            });
            return;
        }

        // Hash the token
        const resetTokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find admin with valid reset token
        const admin = await AdminModel.findOne({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { $gt: new Date() }
        }).select('+password +resetPasswordToken +resetPasswordExpires');

        if (!admin) {
            res.status(400).json({ 
                success: false,
                message: 'Invalid or expired reset token' 
            });
            return;
        }

        // Update password
        admin.password = password;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpires = undefined;
        
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Logout
export const logoutAdmin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Check if admin is authenticated
export const checkAuth = async (req: AdminAuthRequest, res: Response): Promise<void> => {
    res.status(200).json({
        success: true,
        authenticated: true,
        admin: req.admin
    });
};