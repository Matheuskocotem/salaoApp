const mongoose = require('mongoose');

const URI = '';  // mongodb+srv://salaoUser:brIBzx32MiodJOD3@cluster0.lky72.mongodb.net/salaoUser?retryWrites=true&w=majority&appName=Cluster0&connectTimeoutMS=30000&socketTimeoutMS=60000

const env = process.env.NODE_ENV || 'dev';
let options = {
  useUnifiedTopology: true, 
};

mongoose
  .connect(URI, options)
  .then(() => console.log('DB is Up!'))
  .catch((err) => console.log(err));
