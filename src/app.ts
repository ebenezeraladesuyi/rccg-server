import express, { Application , Request , Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import contactUsRouter from "./routes/ContactUsRouter";
import galleryRouter from "./routes/GalleryRouter";
import firstTimerRouter from "./routes/FirstTimerRouter";
import blogRouter from "./routes/BlogRouter";
import paymentRouter from "./routes/PaymentRoutes";


const appConfig = (app: Application) => {
  app.use(express.json()).use(cors()).use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  //routes
  app.use("/contact", contactUsRouter)
  app.use("/gallery", galleryRouter)
  app.use("/firsttimer", firstTimerRouter)
  app.use("/blog", blogRouter)
  app.use("/payment", paymentRouter)


  app.get("/" , (req: Request , res:Response)=>{
    return res.status(200).json({
      message : "default get"
    })
  })
};



export default appConfig;