require('dotenv').config();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

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

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const baseName = path.basename(file.originalname, ext);
      cb(null, `${baseName}-${Date.now()}${ext}`);
    }
  });
  
const upload = multer({ storage: storage });


const sendMail = async (to, subject, content, isTemplateEmail = false) => {
    const data = {
      subject: subject,
      to_email: to,
      context: {
        message: content
      },
      api_key: process.env.EMAIL_API_KEY,
      is_template_email: isTemplateEmail
    };
  
    try {
      const res = await axios.post(process.env.EMAIL_URL, data);
      console.log(`Email Sending Response: ${res.data}`);
    } catch (error) {
      console.log(`Error Sending Email: ${error.message}`);
    }
  };




module.exports = {validateToken,upload,sendMail}