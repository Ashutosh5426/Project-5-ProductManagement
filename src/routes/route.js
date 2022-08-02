const express = require('express');
const {registerUser, loginUser, getProfile, updateProfile} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser)
// router.post('/login', loginUser)
// router.post('/user/:userId/profile', getProfile)
// router.put('/user/:userId/profile', updateProfile);


module.exports = router;