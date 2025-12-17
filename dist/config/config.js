"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// config/config.ts
exports.config = {
    mongo: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rccg-bookings'
    },
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || 'building@rccgopenheavens.com',
        pass: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM || 'building@rccgopenheavens.com',
        admin: process.env.ADMIN_EMAIL || 'building@rccgopenheavens.com'
    },
    port: process.env.PORT || 3000,
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:2021'
    },
    adminUrl: process.env.ADMIN_URL || 'http://localhost:2021'
};
