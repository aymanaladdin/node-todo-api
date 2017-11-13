const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const _ = require("lodash");
const validator = require("validator");

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value)=>{
                return validator.isEmail(value);
            },
            message: "{VALUE} is not a valid Email"
        }  
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    
    return _.pick(userObj, ["_id", "email"]);
};

UserSchema.methods.generateAuthToken = function(){
    const user = this;
    
    const access = "auth";
    const token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString();
    
    user.tokens.push({access, token});

    return user.save().then(()=>{ return token });
};

UserSchema.methods.removeToken = function(token){
    const user = this;

    return user.update({$pull: {
        tokens: {token}
    }});
};

UserSchema.statics.findByToken = function(token){
    const User = this;
    let decoded = {};
    try{
        decoded = jwt.verify(token, "abc123");
    }
    catch(err){
        return Promise.reject();
    }
    return User.findOne({'_id': decoded._id, 'tokens.access': 'auth', 'tokens.token': token });
};

UserSchema.statics.findByCredentialsCB = function(email, password){
    const User = this;

    return User.findOne({email})
               .then((user)=>{
                   if(! user) return Promise.reject({error: "Invalid Email"});

                   return new Promise((resolve, reject)=>{
                       bcrypt.compare(password, user.password, (e, r)=>{
                           if (r) resolve(user);
                           reject({error: "Password not Match!"});
                       });
                   });
               });
};


UserSchema.statics.findByCredentials = function(email, password){
    const User = this;
    let userData = {};

    return User.findOne({email})
               .then((user)=>{
                   if(! user) return Promise.reject({error: "Invalid Email"});

                   userData = user;
                   return bcrypt.compare(password, user.password);
               })
               .then((match)=>{
                   if(match) return userData;

                   return Promise.reject({error: "Password not Match!"});
               });
};
//hashing passwoed middleware
UserSchema.pre('save', function(next){
    const user = this;

    //first check if password modified
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            //if (err) next(err);
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        });
    }
    else{
        next();
    }
});


let User = mongoose.model("User", UserSchema);

module.exports = {User};