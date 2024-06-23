import { Request, Response } from "express";
import firstTimerModel from "../model/FirstTimerModel";


//register first timer
export const registerFirstTimer = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    const checkExist = await firstTimerModel.findOne({ email });

    if (checkExist) {
      return res.status(500).json({
        message: "This email has been used",
      });
    } else {

      const firstTimer = await firstTimerModel.create({
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
  } catch (error: any) {
    return res.status(400).json({
      message: "failed to register first timer",
      data: error?.message,
    });
  }
};


// get all first timer
export const getAllFirstTimers = async (req: Request, res: Response) => {
    try {
        const allFirstTimers = await firstTimerModel.find();

        return res.status(200).json({
            message: "gotten all first timers",
            data: allFirstTimers,
        });

    } catch (error : any) {
        return res.status(400).json({
            message: "failed to get all first timers",
            data: error.message
        })
    }
}