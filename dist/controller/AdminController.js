"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.logoutAdmin = exports.resetPassword = exports.forgotPassword = exports.updateEmail = exports.changePassword = exports.getAdminProfile = exports.loginAdmin = exports.setupAdmin = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jwtUtils_1 = require("../utils/jwtUtils");
const AdminModel_1 = require("../model/AdminModel");
// Setup admin (first-time only)
const setupAdmin = async (req, res) => {
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
        // Create admin
        const admin = new AdminModel_1.AdminModel({
            email,
            password
        });
        await admin.save();
        // Generate token
        const token = (0, jwtUtils_1.generateToken)({
            adminId: admin._id.toString(),
            email: admin.email
        });
        res.status(201).json({
            success: true,
            message: 'Admin setup successfully',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                lastLogin: admin.lastLogin
            }
        });
    }
    catch (error) {
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
exports.setupAdmin = setupAdmin;
// Login admin
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        // Find admin by email and include password
        const admin = await AdminModel_1.AdminModel.findOne({ email }).select('+password');
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
            return;
        }
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();
        // Generate token
        const token = (0, jwtUtils_1.generateToken)({
            adminId: admin._id.toString(),
            email: admin.email
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                lastLogin: admin.lastLogin
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.loginAdmin = loginAdmin;
// Get admin profile
const getAdminProfile = async (req, res) => {
    var _a;
    try {
        const admin = await AdminModel_1.AdminModel.findById((_a = req.admin) === null || _a === void 0 ? void 0 : _a.adminId).select('-password');
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
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAdminProfile = getAdminProfile;
// Change password
const changePassword = async (req, res) => {
    var _a;
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
        const admin = await AdminModel_1.AdminModel.findById((_a = req.admin) === null || _a === void 0 ? void 0 : _a.adminId).select('+password');
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.changePassword = changePassword;
// Update email
const updateEmail = async (req, res) => {
    var _a, _b;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
            return;
        }
        const admin = await AdminModel_1.AdminModel.findById((_a = req.admin) === null || _a === void 0 ? void 0 : _a.adminId).select('+password');
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
        const emailExists = await AdminModel_1.AdminModel.findOne({
            email,
            _id: { $ne: (_b = req.admin) === null || _b === void 0 ? void 0 : _b.adminId }
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
        const token = (0, jwtUtils_1.generateToken)({
            adminId: admin._id.toString(),
            email: admin.email
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateEmail = updateEmail;
// Forgot password (send reset email)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({
                success: false,
                message: 'Email is required'
            });
            return;
        }
        const admin = await AdminModel_1.AdminModel.findOne({ email });
        if (!admin) {
            // Don't reveal that email doesn't exist
            res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a reset link has been sent'
            });
            return;
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenHash = crypto_1.default
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.forgotPassword = forgotPassword;
// Reset password with token
const resetPassword = async (req, res) => {
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
        const resetTokenHash = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        // Find admin with valid reset token
        const admin = await AdminModel_1.AdminModel.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.resetPassword = resetPassword;
// Logout
const logoutAdmin = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
exports.logoutAdmin = logoutAdmin;
// Check if admin is authenticated
const checkAuth = async (req, res) => {
    res.status(200).json({
        success: true,
        authenticated: true,
        admin: req.admin
    });
};
exports.checkAuth = checkAuth;
