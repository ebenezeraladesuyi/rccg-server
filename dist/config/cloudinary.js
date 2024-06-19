"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'dlcnvhyr5',
    api_key: '965623293217163',
    api_secret: 'x08W29MWkiwfKlqdb4UNaGilkzw',
    secure: true
});
exports.default = cloudinary_1.v2;
