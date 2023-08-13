const express = require('express');
const {check} = require('express-validator');
const usersController = require('../controllers/users-controllers');

const router = express.Router();
{/*This gives us a special object on which we can also register middleware which is filtered by HTTP method in path but the interesting thing is that we then can export our configured router by the end of this file and import it in app.js and register this entire configured router as one single middleware in server.js. */}

router.get('/', usersController.getUsers);

router.post('/signup',
[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6})
]
, usersController.signup);

router.post('/login', usersController.login);
// we dont need a validator for login, as it already matches email and pass before loggin someone in.
{/*The reason is that if you enter something in the browser URL, it by default always is a GET request,which means it can't work because we have no get route that handles slash nothing, we just have a post route.  */}

module.exports = router;
