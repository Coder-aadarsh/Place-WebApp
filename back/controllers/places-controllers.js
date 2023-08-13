const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordinates = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');


const getPlaceById =async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  let place;

  try{
    place = await Place.findById(placeId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong , could not find a place', 500
    );
    return next(error);
  }

  {/*DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });*/}

  if (!place) {
    return next(new HttpError('Could not find a place for the provided id.', 404));
  }

  res.json({ place: place.toObject({getters: true}) }); // => { place } => { place: place }
};
{/*there is one important difference - if you would be in some asynchronous code here which I'm not here at the moment but which we later will be when we work with the database, then you have to use the next and pass the error object approach. If you're in a synchronous middleware, as I'm currently here because we have only synchronous actions, then you can also just throw an error. */}

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try{
    places = await Place.find({creator: userId});
  }catch (err) {
    const error = new HttpError(
      'Fetching places failed ,please try again later', 500
    );
    return next(error);
  }


  {/* DUMMY_PLACES.filter(p => { return p.creator === userId; });*/}

  if (!places || places.length === 0) {
    const error = new HttpError(
      'Could not find places for the provided user id.', 
      404
    );
    return next(error);
  }

  res.json({ places: places.map(place => place.toObject({getters: true}))});
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next (new HttpError('Invalid inputs passed, please check your data', 422));
  }
  const { title, description, address, creator } = req.body;
  let coordinates; 
  try{
    coordinates = await getCoordinates(address);
  }catch(error){
    return next(error);
  }
  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZ0eBexDT7cpUHKGQyqtqnRtLOImVvHow1h6xPMlDFDpVdUhqMeW-Nm4I0xFVNJ77nFcg&usqp=CAU',
    creator
  });

  let user;
  try{
    user = await User.findById(creator)
  }catch(err){
    const error = new HttpError(
      'Creating place failed, please try again!',
      500
    );
    return next(error);
  }

  if(!user){
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  console.log(user);
  
  try{
    // sessions and transactions
    const sess = await mongoose.startSession(); //await createdPlace.save();   // DUMMY_PLACES.push(createdPlace);   //unshift(createdPlace)
    sess.startTransaction();
    await createdPlace.save({session: sess});
    user.places.push(createdPlace);
    await user.save({session: sess});
    await sess.commitTransaction();
    sess.endSession();
  } catch(err) {
    const error = new HttpError(
      'Creating place failed, please try again!',
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return next(new HttpError('Invalid inputs passed, please check your data', 422));
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong could not update the places', 500
    );
    return next(error);
  }

  {/*const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);*/}
  place.title = title;
  place.description = description;

  //DUMMY_PLACES[placeIndex] = updatedPlace;
  try{
    await place.save();
  }catch (err){
    const error = new HttpError(
      'Something went wrong', 500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({getters: true})});
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  
  let place;
  try{
    place = await Place.findById(placeId).populate('creator'); //populate method can only be defined if ref is established and then acess the property of other model
  }catch (err){
    const error = new HttpError(
      'Something went wrg, unable to delete the place', 500
    );
    return next(error);
  }

  if(!place){
    const error = new HttpError(
      'Could not find the place for this Id.', 404
    );
    return next(error);
  }

  {/*if(!DUMMY_PLACES.find(p=> p.id === placeId)){
    throw new HttpError('Could not find a place for that id', 404);
  } DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);*/}

  try{
    // place = await Place.findById(placeId);
    // await place.deleteOne();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  }catch(err){
    const error = new HttpError(
      'Something went wront while deleting the file',
      500
    );
    return next(error);
  };
  
  res.status(200).json({ message: 'Deleted place' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;


// Relation between two models can be established by refs, and can be exploited for data access and modify by using populate method.
