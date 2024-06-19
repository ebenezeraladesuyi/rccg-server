import express from "express";
import { sendContactMessage } from "../controller/ContactUsController";


const contactUsRouter = express.Router();

contactUsRouter.post('/createcontactmail', sendContactMessage);
// contactUsRouter.get('/allaudios', getAllAudios);

export default contactUsRouter;
