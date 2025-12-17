"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ContactUsRouter_1 = __importDefault(require("./routes/ContactUsRouter"));
const GalleryRouter_1 = __importDefault(require("./routes/GalleryRouter"));
const FirstTimerRouter_1 = __importDefault(require("./routes/FirstTimerRouter"));
const BlogRouter_1 = __importDefault(require("./routes/BlogRouter"));
const PaymentRoutes_1 = __importDefault(require("./routes/PaymentRoutes"));
const BookingRoutes_1 = __importDefault(require("./routes/BookingRoutes"));
const appConfig = (app) => {
    app.use(express_1.default.json()).use((0, cors_1.default)()).use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    //routes
    app.use("/contact", ContactUsRouter_1.default);
    app.use("/gallery", GalleryRouter_1.default);
    app.use("/firsttimer", FirstTimerRouter_1.default);
    app.use("/blog", BlogRouter_1.default);
    app.use("/payment", PaymentRoutes_1.default);
    app.use("/book", BookingRoutes_1.default);
    app.get("/", (req, res) => {
        return res.status(200).json({
            message: "default get"
        });
    });
};
exports.default = appConfig;
