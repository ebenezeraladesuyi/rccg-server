import mongoose from "mongoose";

interface firstTimer {
  name: string;
  address: string;
  county: string;
  occupation: string;
  telHome : string;
  telWork : string;
  mobile : string;
  email : string;
  visitOrStay : string;
  prayerRequest : string;
  haveJesus : string;
  pastorVisit : string;
}

interface iFirstTimer extends firstTimer, mongoose.Document {}

const firstTimerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  address: {
    type: String,
    required: [true, "please enter your address"],
  },
  county: {
    type: String,
    required: [true, "please enter your county"],
  },
  occupation: {
    type: String,
    required: [true, "please enter your occupation"],
  },
  telHome: {
    type: String,
    required: [false, "please enter your home telephone"],
  },
  telWork: {
    type: String,
    required: [false, "please enter your work telephone"],
  },
  mobile: {
    type: String,
    required: [false, "please enter your mobile"],
  },
  visitOrStay: {
    type: String,
    required: [true, "please enter if you're visiting or staying"],
  },
  prayerRequest: {
    type: String,
    required: [false, "please enter your prayer request"],
  },
  haveJesus: {
    type: String,
    required: [true, "do you have Jesus as your savior?"],
  },
  pastorVisit: {
    type: String,
    required: [true, "do you eant a pastor/counsellor to visit you?"],
  },
 
});


const firstTimerModel = mongoose.model<iFirstTimer>("rccgFirstTimer" , firstTimerSchema)

export default firstTimerModel;