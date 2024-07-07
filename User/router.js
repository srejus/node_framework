const express = require('express');

const router = express.Router();

const {getUserData,createUser,loginUser} = require('../User/controller');
const {validateToken} = require('../middlewares');

// Routes
router.get("/",validateToken ,getUserData);
router.post("/register",createUser);
router.post("/login",loginUser);

module.exports = router;