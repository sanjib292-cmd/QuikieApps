const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { FriendModel } = require('./../../Models/friendslist');
const asyncmiddleware=require('./../../middleware/async');
const auth =require('./../../middleware/auth')



router.get('/:id',auth,asyncmiddleware(async(req,res)=>{
    //const token = req.header('x-auth-token');
    const friends =FriendModel.aggregate([
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
              { user_to: mongoose.Types.ObjectId(req.params.id) }, // req.user.id referrers to logged in user object id  
              { user_from: mongoose.Types.ObjectId(req.params.id) },         
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
      return res.status(200).send(friends);

}));

//User Register route
router.post('/', admin, asyncmiddleware(async (req, res) => {
    let user = await User.findOne({
        phone: req.body.phone
    });

    if (user) {
        return res.status(400).send("User Already Registred");
    } try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        user = new DeliveryBoy({

            name: req.body.name,
            isActive: req.body.isActive,
            imgurl: req.body.imgurl,
            phone: req.body.phone,
            password: req.body.password,


        });
        if (req.body.password == null) {
            return res.status(400).send('Password required..')
        }
        const bcryptpass = await bcrypt.hash(req.body.password, 10);
        user.password = bcryptpass;
        var token = user.genratewebToken();
        //deliveryBoy.index({loc:"2dsphere"});
        await user.save();
        return res.status(200).header({ 'x-auth-token': token }).send(user);
    } catch (e) {

        console.log(e);
        return res.status(400).send(e.message);
    }

}));

module.exports = router;
