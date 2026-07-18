const validator = require('validator');


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Please enter a name");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName",
        "lastName",
        "gender",
        "about",
        "age",
        "skills",
        "photoUrl"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    if (req.body.photoUrl && !validator.isURL(req.body.photoUrl)) {
        throw new Error("Invalid Photo URL");
    }

    if (
        req.body.gender &&
        !["male", "female", "other"].includes(req.body.gender)
    ) {
        throw new Error("Invalid Gender");
    }

    return isEditAllowed;
};


module.exports = {
    validateSignUpData,
    validateEditProfileData,
};

