const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, validate } = require('./../../Models/User')


router.post('/', asyncmiddleware(async (req, res) => {
    try {
        let user = await User.findOne({ phone: req.body.phone });
        if (!user) {
            return res.status(404).send('user not registred')
        }
        else if (user && await bcrypt.compare(req.body.password, user.password)) {
            //deliveryBoy.loc.index='2dsphere';
            user.loc.type = "Point";
            const token = user.genratewebToken();
            await user.save();
            return res.status(200).header({ 'x-auth-token': token }).send(token);

        }
        return res.status(400).send('invalid pass or email');
    } catch (e) {
        console.log(e);
    }

}));