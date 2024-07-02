require('dotenv').config();

const jwt = require('jsonwebtoken');


const validateToken = async(req,res,next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                console.log(err);
                return res.sendStatus(403)
            }
            req.user = decoded.user;
            return next();
        })
    }else {
        return res.sendStatus(401);
    }
}

module.exports = validateToken