"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MemberController_1 = require("../controller/MemberController");
const memberRouter = express_1.default.Router();
// userRouter.get("/registered" , getAllWorkers)
memberRouter.post("/memberregister", MemberController_1.registerMember);
memberRouter.get("/allmembersregistered", MemberController_1.getAllMembers);
exports.default = memberRouter;
