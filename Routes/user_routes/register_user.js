const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('./../../Models/User');
const asyncmiddleware=require('./../../middleware/async');
const config = require('config')




//User Register route
router.post('/', asyncmiddleware(async (req, res) => {
    let user = await User.findOne({
        phone: req.body.phone
    });

    if (user) {
        return res.status(400).send("User Already Registred");
    } try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        user = new User({

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
