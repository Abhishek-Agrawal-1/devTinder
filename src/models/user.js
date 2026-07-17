const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 2,
        maxLength : 50,
    },
    lastName : {
        type : String,
        // minlength : 2,
        // maxLength : 50,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address " + value);
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password : " + value);
            }
        }
    },
    gender : {
        type : String,
        validate(value) {
            if(!["Male" , "Female" , "other"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    age : {
        type : Number,
        min : 15,
        max : 100,
    },
    photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpy8fSabmG_TcZLtTTiedr81bYgG0DdIkT2lpRKLgl5Q&s=10",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL : " + value);
            }
        }
    },
    about : {
        type : String,
        default : "this is the default about of the user",
        maxLength : 150,
    },
    skills : {
        type : [String],
    },
}, { timestamps : true});


module.exports = mongoose.model('User', userSchema);