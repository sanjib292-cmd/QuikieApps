const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const auth=require('./../../middleware/auth');
const asyncmiddleware=require('./../../middleware/async');


router.post('/post/:post',auth,asyncmiddleware(async(req,res)=>{
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, config.get('JwtPrivatekey'));
    if (!token){
        return res.status(401).send('UnAuth');
    }
     await User.findByIdAndUpdate(decoded.id,{$push:{
        post:req.params.post
    }});

    return res.status(200).send('Posted');
}));

// router.delete('/post/:post',auth,asyncmiddleware(async(req,res)=>{
//     const token = req.header('x-auth-token');
//     const decoded = jwt.verify(token, config.get('JwtPrivatekey'));
//     if (!token){
//         return res.status(401).send('UnAuth');
//     }
//      await User.findByIdAndUpdate(decoded.id,{$push:{
//         post:req.params.post
//     }});

//     return res.status(200).send('Posted');
// }));

