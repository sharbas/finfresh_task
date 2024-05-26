import mongoose from "mongoose";
const connectDB = async () => {
    try {
      const conn = await mongoose.connect("mongodb+srv://mohammedsharbas:NKj00tyv1tF4REGd@finfresh.qvruey1.mongodb.net/?retryWrites=true&w=majority&appName=Finfresh");
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };
  
  export default connectDB;
