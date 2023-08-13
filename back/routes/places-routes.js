//we building middleware for places-routes
const express = require('express');
const {check} = require('express-validator');
{/* check method actually is a method or a function we can execute and it will return a new middleware configured for our validation requirements. */}
const placesControllers = require('../controllers/places-controllers');

const router = express.Router();
{/*This gives us a special object on which we can also register middleware which is filtered by HTTP method in path but the interesting thing is that we then can export our configured router by the end of this file and import it in app.js and register this entire configured router as one single middleware in server.js. */}

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/', 
[
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty()
], 
placesControllers.createPlace);
{/*The reason is that if you enter something in the browser URL, it by default always is a GET request,which means it can't work because we have no get route that handles slash nothing, we just have a post route.  */}

router.patch('/:pid',
[
    check('title').not().isEmpty(),
    check('description').isLength({min: 5})
], placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
