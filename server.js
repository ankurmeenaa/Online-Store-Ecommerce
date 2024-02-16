// import express from 'express'
// import colors from 'colors'
// import dotenv from 'dotenv'
// import morgan from 'morgan'
// import connectDB from './config/db.js';
// import authRoute from './routes/authRoute.js'
// import cors from 'cors'
// import categoryRoutes from './routes/categoryRoutes.js'
// import productRoutes from './routes/productRoutes.js'
// import path from 'path'


// //configure env 
// dotenv.config();

// // //database config
// // connectDB();

// // rest object -bcz apis create kar paaye
// const app = express()

// //middelwares
// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));
// // app.use(express.static(path.join(__dirname,'./client/build')))

// //Routes
// app.use('/api/v1/auth',authRoute)
// app.use('/api/v1/category',categoryRoutes);
// app.use("/api/v1/product", productRoutes);

// // //while deploying
// // app.use('*',function(req,res){
// //     res.sendFile(path.join(__dirname,'./client/build/index.html'));
// // })

 
// //PORT
// const PORT = process.env.PORT || 8080

// //deploying on cyclic work
// // Connect to MongoDB and then start the server
// connectDB().then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//       console.log("Listening for requests");
//     });
//   })
//     .catch(error => {
//       console.error("Error connecting to MongoDB:", error);
//       process.exit(1); // Exit if connection fails
//     });

// //static files
// app.use(express.static(path.join(__dirname,"./client/build")))
// app.get('*',function(req,res){
//     res.sendFile(path.join(__dirname,"./client/build/index.html"))
// })

// // //Run
// // app.listen(PORT,()=>{
// //     console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
// // })


//             GEMINI SERVER.JS
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db.js'); // Import named export

// Routes
const authRoute = require('./routes/authRoute.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes.js');

// Configure environment variables
dotenv.config();

// Database connection
connectDB()
  .then(() => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.cyan.bold);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.red.bold);
    process.exit(1);
  });

const app = express();

// Middlewares
app.use(express.json()); // Parse incoming JSON data
app.use(morgan('dev')); // Log HTTP requests in development mode

// CORS middleware (if needed):
// app.use(cors());

// API routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Static files serving (for client-side routing):
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Serve index.html for all unmatched routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Error handler middleware (optional):
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack.red.bold);
//   res.status(500).send('Something went wrong.');
// });

// PORT
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`.yellow.bold);
});
