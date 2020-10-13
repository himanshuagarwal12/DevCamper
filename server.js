const express = require('express');
const dotenv=require('dotenv');
const path=require('path');
const morgan = require('morgan');
const colors=require('colors');
const fileUpload=require('express-fileupload');

const connectDB = require('./config/db');
const errorHandler=require('./middleware/error');
//connect to the database
connectDB();
dotenv.config({ path:'./config/config.env'});

//Route files
const bootcamps=require('./routes/bootcamps');
const courses=require('./routes/courses')
//Load env vars


const app = express();

//Body Parser
app.use(express.json());
//dev loggin middleware

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(fileUpload());
app.use(express.static(path.join(__dirname,'public')));

//Mount routers
app.use('/api/v1/bootcamps',bootcamps);
app.use('/api/v1/courses',courses);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT ,console.log(`Server is running on port ${PORT}`.yellow.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
  });