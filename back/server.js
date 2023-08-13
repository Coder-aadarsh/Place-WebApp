//we will setup routing
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

//  MIDDLEWARE TO HANDLE THE CORS CONFLICT
//  This will set the code to header which we want to attach with every incomming response from backend to the client
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 
  'Origin, X-Requested-With, Content-Type, Accept, Autherization'
  );
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);
//unsupported error
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
// If no route is caught above, then this is used

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }//checks if a response is already sent
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
.connect('mongodb+srv://aadarsh:aadarshnagrath123@placeapp.nsw8ky6.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
  app.listen(5000);
})
.catch(err=>{
  console.log(err);
});
