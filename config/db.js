const mongoose = require('mongoose');
const connectDB = async () => {
  const conn = await mongoose.connect('mongodb+srv://user1221:user1221@devcamper.pkpdw.mongodb.net/devcamper?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

module.exports = connectDB;