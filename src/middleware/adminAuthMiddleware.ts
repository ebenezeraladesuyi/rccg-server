import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils';
import { AdminModel } from '../model/AdminModel';

export interface AdminAuthRequest extends Request {
    admin?: {
        adminId: string;
        email: string;
    };
}

// Authentication middleware - FIXED: Proper void return
export const authenticateAdmin = async (req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req);
        
        if (!token) {
            res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
            return; // Just return, don't return the response
        }

        const decoded = verifyToken(token);
        
        // Verify admin still exists
        const admin = await AdminModel.findById(decoded.adminId);
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
    } catch (error: any) {
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

// Check if admin exists (for setup) - FIXED: Proper void return
export const checkAdminExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminCount = await AdminModel.countDocuments();
        if (adminCount > 0) {
            res.status(400).json({ 
                success: false,
                message: 'Admin already setup. Use login instead.' 
            });
            return; // Just return, don't return the response
        }
        next(); // Call next, don't return anything
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
        return;
    }
};