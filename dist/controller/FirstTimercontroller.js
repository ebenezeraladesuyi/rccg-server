"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFirstTimers = exports.registerFirstTimer = void 0;
const FirstTimerModel_1 = __importDefault(require("../model/FirstTimerModel"));
//register first timer
const registerFirstTimer = async (req, res) => {
    try {
        const { name, address, county, occupation, telHome, telWork, mobile, email, visitOrStay, prayerRequest, haveJesus, pastorVisit, } = req.body;
        const checkExist = await FirstTimerModel_1.default.findOne({ email });
        if (checkExist) {
            return res.status(500).json({
                message: "This email has been used",
            });
        }
        else {
            const firstTimer = await FirstTimerModel_1.default.create({
                name,
                address,
                county,
                occupation,
                telHome,
                telWork,
                mobile,
                email,
                visitOrStay,
                prayerRequest,
                haveJesus,
                pastorVisit,
            });
            return res.status(200).json({
                message: "first timer registered",
                data: firstTimer,
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to register first timer",
            data: error === null || error === void 0 ? void 0 : error.message,
        });
    }
};
exports.registerFirstTimer = registerFirstTimer;
// get all first timer
const getAllFirstTimers = async (req, res) => {
    try {
        const allFirstTimers = await FirstTimerModel_1.default.find();
        return res.status(200).json({
            message: "gotten all first timers",
            data: allFirstTimers,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to get all first timers",
            data: error.message
        });
    }
};
exports.getAllFirstTimers = getAllFirstTimers;
