const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
// Load User model
const User = require('../models/User');
const multer = require('multer');
// const upload = multer();
const { v4: uuidv4 } = require('uuid');
uuidv4();

router.post('/signup', (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.log(err));
                });
            });
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then((user) => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: 'Email not found' });
        }
        // Check password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name,
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926, // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token,
                            email: user.email,
                        });
                    }
                );
            } else {
                return res.status(400).json({ passwordincorrect: 'Password incorrect' });
            }
        });
    });
});

router.post('/getnamefordashboard', async (req, res) => {
    try {
        console.log('Inside Get username Post Request');

        useremail = req.body.useremail;
        console.log(useremail);
        const dashboardname = await User.find({ email: useremail }, { name: 1 });

        res.status(200).json({ username: dashboardname });
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
});

router.post('/allusersexceptself', async (req, res) => {
    try {
        console.log('Inside All users except self Request');
        useremail = req.body.useremail;
        console.log(useremail);
        const allemails = await User.find({}, { email: 1 });
        console.log(allemails[0].email);
        allemailsexceptself = [];
        for (let i = 0; i < allemails.length; i++) {
            var currentemail = allemails[i].email;
            console.log(currentemail);
            if (currentemail != useremail) {
                allemailsexceptself.push(currentemail);
            }
        }
        console.log(allemailsexceptself);
        res.status(200).json({ allemails: allemailsexceptself });
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
    }
});

module.exports = router;
