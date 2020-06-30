var User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail")

var UserController = {
    getRedirect: (req, res, next) => {
        if (req.query.username && req.query.password)
            login(req, res, next);
        else if (req.query.email)
            recoverPassword(req, res, next);
        else
            return res.status(400).json({ status: "invalid method" })
    },

    register: (req, res, next) => {
        User.findOne({
            username: req.body.username,
        })
            .then((foundUser) => {
                if (foundUser)
                    throw new Error(`Usuario duplicado ${req.body.username}`);
                else {
                    let newUser = new User({
                        googleID: req.body.googleID,
                        username: req.body.username,
                        fullname: req.body.fullname,
                        password: bcrypt.hashSync(req.body.password, 10),
                        email: req.body.email,
                        photoUri: req.body.photoUri,
                        lists: req.body.lists
                    });
                    return newUser.save();
                }
            })
            .then((user) => {
                return res.status(200).json({error: false, message: "created user succesfully"});
            })
            .catch((err) => {
                next(err);
            });
    },

    updateUser: (req, res, next) => {
        User.findOneAndUpdate(
            { username: req.body.username },
            {
                googleID: req.body.googleID,
                username: req.body.username,
                fullname: req.body.fullname,
                password: bcrypt.hashSync(req.body.password, 10),
                email: req.body.email,
                photoUri: req.body.photoUri,
                lists: req.body.lists
            },
            { new: true }
        )
            .then(updatedUser => {
                return updatedUser ? res.status(200).json({ status: "updated" }) :
                    res.status(400).json({ status: "something went wrong" })
            })
            .catch(err => {
                next(err)
            })
    },

    getAllUsers: (req, res, next) => {
        User.find({})
        .then(everyUser => {
            return res.status(200).json(everyUser)
        })
    }
};

var generateRandomPassword = () => {
    let alf = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let provisionalPass = "";

    for (let i = 0; i < 10; i++)
        provisionalPass += alf[Math.floor(Math.random() * 62)];

    return provisionalPass;
};

var login = (req, res, next) => {
    User.findOne(
        {
            username: req.query.username,
        }
    )
        .then((foundUser) => {
            if (foundUser)
                if (bcrypt.compareSync(req.query.password, foundUser.password))
                    return res.status(200).json({error: false, username: foundUser.username, fullname: foundUser.fullname});
                else return res.status(400).json({ error: true, username: null, fullname: null });
            else return res.status(500).json({ error: true, username: null, fullname: null });
        })
        .catch((err) => {
            next(err);
        });
};

var recoverPassword = (req, res, next) => {
    let newPass = generateRandomPassword()
    User.findOneAndUpdate(
        { email: req.body.email },
        { password: bcrypt.hashSync(newPass, 10) },
        { new: true }
    )
        .then((updatedUser) => {
            if (updatedUser) {
                sendEmail(
                    updatedUser.email,
                    "Recuperación de contraseña",
                    "Utiliza esta contraseña para iniciar sesion temporalmente: <strong>" + newPass + "</strong> y cambia los ajustes en la App."
                );
                return res.status(200).json(updatedUser);
            } else
                return res
                    .status(400)
                    .json({ status: "Not found for password update" });
        })
        .catch((err) => {
            next(err);
        });
};

var sendEmail = (To, Subject, Html) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: To,
        from: "allmyfood20@gmail.com",
        subject: Subject,
        html: Html,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Message sent");
        })
        .catch((error) => {
            console.log(error.response.body);
        });
};

module.exports = UserController;
