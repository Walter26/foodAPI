var User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail")

var UserController = {
    getRedirect: (req, res, next) => {
        if (req.query.username || req.query.email && req.query.password)
            login(req, res, next)
        else if (req.query.email && !req.query.email)
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
                    console.log("Loggin found user")
                    console.log(foundUser)
                    if (foundUser)
                        throw new Error('F');
                    else {
                        let newUser = new User({
                            username: req.body.username,
                            fullname: req.body.fullname,
                            password: hash,
                            email: req.body.email,
                            userImage: req.file.userImage || "INF",
                            lists: req.body.lists
                        });
                        return newUser.save();
                    }
                })
                .then((newUser) => {
                    return res.status(200).json({
                        error: false, username: newUser.username, 
                        fullname: newUser.fullname, userImage: newUser.userImage
                    });
                })
                .catch((err) => {
                    console.log('found in catch')
                    console.log(err)
                    return res.status(400).json(
                        {
                            error: true, username: "", 
                            fullname: "", userImage: ""
                        }
                    )
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
                {username: req.query.username},
                {email: req.query.email}
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

    for (let i = 0; i < 10; i++)
        provisionalPass += alf[Math.floor(Math.random() * 62)];

    return provisionalPass;
};

var recoverPassword = (req, res, next) => {
    let newPass = generateRandomPassword()
    newPass = bcrypt.hash(newPass, 10)
        .then(err => {

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
        {username: req.query.username}
    )
}

module.exports = UserController;
