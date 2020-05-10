var User = require("../models/UserModel");
const bcrypt = require("bcrypt");

var UserController = {
    login: (req, res, next) => {
        User.findOne({
            username: req.query.username,
        })
        .then((foundUser) => {
            if (foundUser)
                if(bcrypt.compareSync(req.query.password, foundUser.password))
                    return res.status(200).json(foundUser)
                else
                return res.status(400).json({status: "wrong password"});    
            else
                return res.status(400).json({status: "not found"});
        })
        .catch((err) => {
            next(err);
        });
    },

    register: (req, res, next) => {
        User.findOne({
            username: req.body.username,
        })
        .then((foundUser) => {
            if (foundUser) {
                throw new Error(`Usuario duplicado ${req.body.username}`);
            } else {
                let newUser = new User({
                    googleID: req.body.googleID || "",
                    username: req.body.username,
                    fullname: req.body.fullname,
                    password: bcrypt.hashSync(req.body.password, 10),
                    email: req.body.email,
                    photoUri: req.body.photoUri || "",
                    lists: req.body.lists || null,
                });
                return newUser.save();
            }
        })
        .then((user) => {
            return res
                .status(200)
                .json(user);
        })
        .catch((err) => {
            next(err);
        });
    },
};

module.exports = UserController;
