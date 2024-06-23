import express from "express"
import { getAllFirstTimers, registerFirstTimer } from "../controller/FirstTimercontroller";

const firstTimerRouter = express.Router()

firstTimerRouter.post("/registerfirst", registerFirstTimer)
firstTimerRouter.get("/allfirst", getAllFirstTimers)


export default firstTimerRouter