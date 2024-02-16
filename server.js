import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import path from 'path'


//configure env 
dotenv.config();

// //database config
// connectDB();

// rest object -bcz apis create kar paaye
const app = express()
const __dirname = path.dirname(new URL(import.meta.url).pathname);


//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname,'./client/build')))

//Routes
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/category',categoryRoutes);
app.use("/api/v1/product", productRoutes);

// //while deploying
// app.use('*',function(req,res){
//     res.sendFile(path.join(__dirname,'./client/build/index.html'));
// })

 
//PORT
const PORT = process.env.PORT || 8080

//deploying on cyclic work
// Connect to MongoDB and then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Listening for requests");
    });
  })
    .catch(error => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1); // Exit if connection fails
    });

//static files
// app.use(express.static(path.join(__dirname,"./client/build")))
app.use(express.static(path.resolve(__dirname, './client/build')));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

// //Run
// app.listen(PORT,()=>{
//     console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
// })


