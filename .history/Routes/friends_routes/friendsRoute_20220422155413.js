const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { FriendModel } = require('./../../Models/friendslist');
const {User}=require('./../../Models/User');
const asyncmiddleware=require('./../../middleware/async');
const auth =require('./../../middleware/auth');
const jwt=require('jsonwebtoken');
const config=require('config');
const mongoose=require('mongoose');



router.get('/',auth,asyncmiddleware(async(req,res)=>{
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, config.get('JwtPrivatekey'));
    if (!token){
        return res.status(401).send('UnAuth');
    }
    const friends = await FriendModel.aggregate([
        {
          $lookup: {
            from: "Users", // users collection
            localField: "_id", // friends collection id
            foreignField: "friends", // friends field in you users collection document
            as: "myfriends" //any alias name you can use
          }
        },
        {
         $match: { // matching condition for current user's friends from friends collection including current user 
            $or: [
              { user_to: mongoose.Types.ObjectId(decoded.id) }, // req.user.id referrers to logged in user object id  
              { user_from: mongoose.Types.ObjectId(decoded.id) },         
            ]
         },
         $match: { is_accepted: true} // that condition is for is user accepted friend request or not.
        }
         ,
         {  // filtering logged in user from the friend list 
          $project: {
            myfriends: { // myfriends is alias name that you used in $loopup part
              $filter: {
                input: "$myfriends",
                as: "item",
                cond: { $ne: [ "$$item._id", mongoose.Types.ObjectId(req.user.id) ] }
             }
            }       
          }   
        }
      ]);
      if(friends.length===0){
          return res.status(200).send('No friends to show');
      }
      return res.status(200).send(friends);

}));

router.get('/recommended_peoples_to_add',auth,asyncmiddleware(async(res,req)=>{
    const token = req.header('x-auth-token');
    const decoded = jwt.verify(token, config.get('JwtPrivatekey').toString());
    if (!token){
        return res.status(401).send('Unauthorized request');
    }
    
    
    // const options = {
    //     //isActive: true,
    //     _id: { $ne: decoded.id },
    //     // loc: {
    //     //     $near: { $geometry: { type: "Point", coordinates: [restro.cord.lon, restro.cord.lat] } }
    //     // }
    // }
    const recommended= await User.find( { _id: { $nin: [ObjectId(decoded.id)] } } );
    if(recommended){
        return res.status(200).send(recommended);
    }
    return res.status(200).send('recommended list not found ');


}) );




 module.exports = router;
