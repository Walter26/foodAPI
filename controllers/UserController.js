var User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail")

var UserController = {
    getRedirect: (req, res, next) => {
        if (req.query.username && req.query.password)
            login(req, res, next)
        else if (req.query.email && req.query.password == undefined)
            recoverPassword(req, res, next);
        else
            return res.status(400).json({ status: "invalid method" })
    },

    register: (req, res, next) => {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            User.findOne({
                username: req.body.username,
            })
                .then((foundUser) => {
                    if (foundUser)
                        return null
                    else {
                        var imageURL = ""
                        if (req.file == undefined && req.body.userImage) {
                            console.log('---------------------------------------');
                            console.log('req file is undefined and userImage not')
                            console.log(req.body.userImage)
                            console.log('---------------------------------------');

                            imageURL = req.body.userImage
                        }
                        else if (req.file == undefined && !req.body.userImage) {
                            console.log('---------------------------------------');
                            console.log('both are undefined')
                            console.log('---------------------------------------');
                            imageURL = "INF"
                        }
                        else {
                            console.log('---------------------------------------');
                            console.log('req file isnt undefined and userImage is')
                            console.log(req.body.userImage)
                            console.log('---------------------------------------');
                            imageURL = req.file.location
                        }

                        let newUser = new User({
                            username: req.body.username,
                            fullname: req.body.fullname,
                            password: hash,
                            email: req.body.email,
                            userImage: imageURL,
                            lists: req.body.lists
                        });
                        return newUser.save();
                    }
                })
                .then((newUser) => {
                    return newUser ? res.status(200).json({
                        error: false, username: newUser.username,
                        fullname: newUser.fullname, userImage: newUser.userImage
                    }) :
                        res.status(200).json({
                            error: true, username: null,
                            fullname: null, userImage: null
                        })
                })
                .catch((err) => {
                    next(err)
                });
        })
    },

    updateUser: (req, res, next) => {
        User.findOneAndUpdate(
            { username: req.body.username },
            {
                username: req.body.username,
                ...req.body
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

var login = (req, res, next) => {
    User.findOne(
        {
            $or: [
                { email: req.query.email },
                { username: req.query.username }
            ]
        }
    )
        .then((foundUser) => {
            if (foundUser)
                if (bcrypt.compare(req.query.password, foundUser.password)) {
                    return res.status(200).json(
                        {
                            error: false, username: foundUser.username,
                            fullname: foundUser.fullname, userImage: foundUser.userImage
                        })
                }
                else return res.status(400).json({ error: true, username: null, fullname: null });
            else return res.status(404).json({ error: true, username: null, fullname: null });
        })
        .catch((err) => {
            next(err);
        });
};

var generateRandomPassword = () => {
    let alf = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let provisionalPass = "";

    for (let i = 0; i < 5; i++)
        provisionalPass += alf[Math.floor(Math.random() * 62)];

    return provisionalPass;
};

var recoverPassword = (req, res, next) => {
    let newPass = generateRandomPassword()
    bcrypt.hash(newPass, 10, function (error, hash) {
        User.findOneAndUpdate(
            { email: req.query.email },
            { password: hash },
            { new: true }
        )
            .then((updatedUser) => {
                if (updatedUser) {
                    sendEmail(
                        updatedUser.email,
                        "Recuperación de contraseña",
                        "Tu nueva contraseña es <strong>" + newPass + "</strong>.\nRecuerda que si " +
                        "inicias sesión desde Google, entonces tu usuario es igual a tu correo con el que accedes."
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
    })
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

var checkExistingUser = (req, res, next) => {
    User.findOne(
        { username: req.query.username }
    )
}

module.exports = UserController;
