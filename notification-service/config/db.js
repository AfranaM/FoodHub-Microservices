const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/notificationDB', {
      // These options are no longer needed in Mongoose 6+
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('DB Connected');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB not running. Please start MongoDB service.');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
