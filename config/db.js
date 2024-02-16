// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log(`MongoDB Connected: ${mongoose.connection.host}`);
//   } catch (error) {
//     console.error(error);
//     throw error; // Re-throw the error to be handled in server.js
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled in server.js
  }
};

// Export the named function
export default connectDB;
