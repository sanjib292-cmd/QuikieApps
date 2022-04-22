const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    friends: { type:[mongoose.Schema.Types.ObjectId],ref:'Order'},

    imgurl: {
        type: String,
    },
    password: {
        type: String,
        required: true
       
    },
    phone: {
        type: Number,
        required: true
    },
    loc:Object({
            type : {type:String ,default:"Point"},
            coordinates:{type:[Number],default:[0.0,0.0],},
        }),

    fcmToken:{
        type:String
    },


});

userSchema.methods.genratewebToken = function () {
    const webtoken = jwt.sign(
        {
           // exp: Math.floor(Date.now() / 1000) + (60 * 60),
            id: this._id, name: this.name, imgurl: this.imgurl, 
        }, config.get('JwtPrivatekey'));
    return webtoken;
}
//module.exports.validate = validateUser;
module.exports.User = mongoose.model('user',userSchema );