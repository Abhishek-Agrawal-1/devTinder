const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        // minlength : 2,
        // maxLength : 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a Strong Password : " + value);
            }
        }
    },
    gender: {
        type: String,
        enum : {
            values : ["Male", "Female" , "others"],
            message : `{VALUE} is not a valid gender type`
        },
        // validate(value) {
        //     if (!["Male", "Female", "other"].includes(value)) {
        //         throw new Error("Gender data is not valid");
        //     }
        // },
    },
    age: {
        type: Number,
        min: 15,
        max: 100,
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpy8fSabmG_TcZLtTTiedr81bYgG0DdIkT2lpRKLgl5Q&s=10",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL : " + value);
            }
        }
    },
    about: {
        type: String,
        default: "this is the default about of the user",
        maxLength: 150,
    },
    skills: {
        type: [String],
    },
}, { timestamps: true });



userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({ _id: user._id }, "Abhishek@123$3", {
        expiresIn: "1d",
    });

    return token;
};


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isValidPassword = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isValidPassword;
}


module.exports = mongoose.model('User', userSchema);