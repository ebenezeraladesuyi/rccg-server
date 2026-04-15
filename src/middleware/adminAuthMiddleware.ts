import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwtUtils';
import { AdminModel } from '../model/AdminModel';

export interface AdminAuthRequest extends Request {
    admin?: {
        adminId: string;
        email: string;
        role: string;
    };
}

// Authentication middleware
export const authenticateAdmin = async (req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = extractTokenFromHeader(req);
        
        if (!token) {
            res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
            return;
        }

        const decoded = verifyToken(token);
        
        // Verify admin still exists
        const admin = await AdminModel.findById(decoded.adminId);
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

// Check if admin is superAdmin
export const requireSuperAdmin = async (req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.admin || req.admin.role !== 'superAdmin') {
        res.status(403).json({ 
            success: false,
            message: 'Access denied. Super Admin privileges required.' 
        });
        return;
    }
    next();
};

// Check if admin exists (for setup)
export const checkAdminExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminCount = await AdminModel.countDocuments();
        if (adminCount > 0) {
            res.status(400).json({ 
                success: false,
                message: 'Admin already setup. Use login instead.' 
            });
            return;
        }
        next();
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
        return;
    }
};