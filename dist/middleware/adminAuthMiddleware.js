"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminExists = exports.requireSuperAdmin = exports.authenticateAdmin = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const AdminModel_1 = require("../model/AdminModel");
// Authentication middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = (0, jwtUtils_1.extractTokenFromHeader)(req);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        // Verify admin still exists
        const admin = await AdminModel_1.AdminModel.findById(decoded.adminId);
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Admin account no longer exists'
            });
            return;
        }
        req.admin = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: 'Session expired. Please login again.'
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Invalid authentication token'
        });
        return;
    }
};
exports.authenticateAdmin = authenticateAdmin;
// Check if admin is superAdmin
const requireSuperAdmin = async (req, res, next) => {
    if (!req.admin || req.admin.role !== 'superAdmin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. Super Admin privileges required.'
        });
        return;
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
// Check if admin exists (for setup)
const checkAdminExists = async (req, res, next) => {
    try {
        const adminCount = await AdminModel_1.AdminModel.countDocuments();
        if (adminCount > 0) {
            res.status(400).json({
                success: false,
                message: 'Admin already setup. Use login instead.'
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
        return;
    }
};
exports.checkAdminExists = checkAdminExists;
