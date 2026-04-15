"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminExists = exports.authenticateAdmin = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const AdminModel_1 = require("../model/AdminModel");
// Authentication middleware - FIXED: Proper void return
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = (0, jwtUtils_1.extractTokenFromHeader)(req);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return; // Just return, don't return the response
        }
        const decoded = (0, jwtUtils_1.verifyToken)(token);
        // Verify admin still exists
        const admin = await AdminModel_1.AdminModel.findById(decoded.adminId);
        if (!admin) {
            res.status(401).json({
                success: false,
                message: 'Admin account no longer exists'
            });
            return; // Just return, don't return the response
        }
        req.admin = {
            adminId: admin._id.toString(),
            email: admin.email
        };
        next(); // Call next, don't return anything
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
// Check if admin exists (for setup) - FIXED: Proper void return
const checkAdminExists = async (req, res, next) => {
    try {
        const adminCount = await AdminModel_1.AdminModel.countDocuments();
        if (adminCount > 0) {
            res.status(400).json({
                success: false,
                message: 'Admin already setup. Use login instead.'
            });
            return; // Just return, don't return the response
        }
        next(); // Call next, don't return anything
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
