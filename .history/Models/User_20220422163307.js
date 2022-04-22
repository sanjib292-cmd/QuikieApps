const mongoose = require('mongoose');
const Joi= require('joi');
const jwt = require('jsonwebtoken');
const config = require('config')


const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    friends: { type: [mongoose.Schema.Types.ObjectId], ref: 'Friends' },

    imgurl: {
        type: String,
    },
    password: {
        type: String,
        required: true

    },
    phone: {
        type: Number,
        required: true,
        unique:true
    },
    loc: Object({
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], default: [0.0, 0.0], },
    }),

    fcmToken: {
        type: String
    },

    addedFriend:[]


});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(50)
            .required(),
        password: Joi.string(),
        phone: Joi.number().integer().min(1000000000).max(9999999999).required(),
        //min(10).max(10).required(),
        isActive: Joi.bool().default(false),
        imgurl: Joi.string(),

    });
    return schema.validate(user);
}

userSchema.methods.genratewebToken = function () {
    const webtoken = jwt.sign(
        {
            // exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id: this._id, name: this.name, imgurl: this.imgurl,
        }, config.get('JwtPrivatekey'));
    return webtoken;
}

module.exports.validate = validateUser;
module.exports.User = mongoose.model('Users', userSchema);