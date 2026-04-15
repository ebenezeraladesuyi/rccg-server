import jwt from 'jsonwebtoken';
import { Request } from 'express';

export interface JwtPayload {
    adminId: string;
    email: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const secret = process.env.JWT_SECRET || 'admin-secret-key-change-in-production';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    
    return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): JwtPayload => {
    const secret = process.env.JWT_SECRET || 'admin-secret-key-change-in-production';
    return jwt.verify(token, secret) as JwtPayload;
};

export const extractTokenFromHeader = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    // Also check cookies if using cookie-parser
    if (req.cookies && req.cookies.adminToken) {
        return req.cookies.adminToken;
    }
    
    return null;
};