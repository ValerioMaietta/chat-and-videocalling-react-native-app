const User = require('../models/user');
const {hashPassword, comparePassword} = require ('../helpers/auth');

//connection string for mongodb: mongodb+srv://francyric10:<password>@cluster0.zppdlwa.mongodb.net/?retryWrites=true&w=majority

//prova
const jwt = require('jsonwebtoken');    // per gestire l'autenticazione e l'autorizzazione degli utenti
let nanoid;   //per generare ID univoci e compatti

import('nanoid').then((module) =>{

    nanoid = module.nanoid;
    // genero il codice
    const resetCode = nanoid(5).toUpperCase();

})

// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports.signup = async (req, res) => {
    console.log("Signup Hit");
try {
const { username, email, password } = req.body;

if (!username) {
    return res.json({
    error: "Username is required",
});
}
if (!email) {
    return res.json({
    error: "Email is required",
});
}
if (!password || password.length < 8) {
    return res.json({
    error: "Password is required and should be 8 characters long",
});
}

const exist = await User.findOne({ email });

if (exist) {
    return res.json({
    error: "Email is taken",
});
}
console.log("hashing password...")
const hashedPassword = await hashPassword(password);
try {
    const user = await new User({
        username,
        email,
        password: hashedPassword,
    }).save();
// create signed token

const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
});
const { password, ...rest } = user._doc;
return res.json({
    token,
    user: rest,
});
} catch (err) {
    console.log(err);
}
} catch (err) {
    console.log(err);
}
};


module.exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        // check if our db has user with that email
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({
                error: "No user found",
            });
        }
        // check password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({
                error: "Wrong password",
            });
        }

        // crea un signed token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        
        const userId = user.userId;
        //rimuovo i campi sensibili prima di inviare la risposta.
        user.password = undefined;
        user.secret = undefined;

        res.json({
            token,
            user,
            userId,
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


module.exports.forgotPassword = async (req, res) => {
const { email } = req.body;
// find user by email
const user = await User.findOne({ email });

console.log("USER ===> ", user);

if (!user) {
    return res.json({ 
         error: "User not found" 
    });
}


// save to db
user.resetCode = resetCode;
user.save();
// prepare email
const emailData = {
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Password reset code",
    html: "<h1>Your password  reset code is: {resetCode}</h1>"
};
// send email
try {
    const data = await sgMail.send(emailData);
    console.log(data);
    res.json({ ok: true });
} catch (err) {
    console.log(err);
    res.json({ ok: false });
}
};

module.exports.resetPassword = async (req, res) => {
try {
    const { email, password, resetCode } = req.body;
    // find user based on email and resetCode
    const user = await User.findOne({ email, resetCode });

    if (!user) {
        return res.json({ error: "Email or reset code is invalid" });
    }

    if (!password || password.length < 8) {
        return res.json({
        error: "Password is required and should be 8 characters long",
        });
    }

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetCode = "";
    user.save();
    return res.json({ ok: true });
} catch (err) {
    console.log(err);
}
};