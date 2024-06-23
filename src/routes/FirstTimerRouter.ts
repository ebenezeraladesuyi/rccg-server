import express from "express"
import { getAllFirstTimers, registerFirstTimer } from "../controller/FirstTimercontroller";

const firstTimerRouter = express.Router()

firstTimerRouter.post("/registerfirst", registerFirstTimer)
firstTimerRouter.get("/allfirsttimers", getAllFirstTimers)


export default firstTimerRouter