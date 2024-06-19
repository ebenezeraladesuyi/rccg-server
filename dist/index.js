"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const app_1 = __importDefault(require("./app"));
const app = (0, express_1.default)();
// const app = express();
(0, app_1.default)(app);
(0, db_1.default)();
const PORT = 2021;
app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
});
