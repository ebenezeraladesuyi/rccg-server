
import mongoose from "mongoose";
import env from "dotenv";
// import {uri} from "../../link";

env.config();

const uri =process.env.MONGOOSE_DB

if (!uri) {
  console.error("MONGOOSE_DB environment variable is not defined.");
  process.exit(1); // Exit the process or handle the error appropriately
}


const dbConfig = async (): Promise<void> => {
    try {
      const con = await mongoose.connect(uri);
      console.log(`connected to database on port ${con.connection.host}`);
    } catch (error) {
      console.log(`failed to connect to database` , error);
    }
  };
  
  export default dbConfig;

