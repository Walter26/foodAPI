var User = require('../models/UserModel')

var ListController = {
    getUserLists: (req, res, next) => {
        User.findOne({
            username: req.body.username
        })
        .then(foundUser => {
            return foundUser.lists ? res.status(200).json({error: false, message: foundUser.lists}) :
                res.status(400).json({error: true, message: "cannot get lists"})
        })
        .catch(err => {
            console.log(err)
            next(err)
        })
    },

    createList: (req, res, next) => {
        User.findOneAndUpdate({
            username: req.body.username
        },{
            $push: {
                lists: {
                    name: req.body.listData.name,
                    desc: req.body.listData.desc,
                    elements: req.body.listData.elements,
                    listType: req.body.listData.listType
                }
            }
        })
        .then((foundUser) => {
            return foundUser ? res.status(200).json({error: false, message: "created list succesfully"}) :
                res.status(400).json({error: true, message: "cannot create list"})
        })
        .catch(err => {
            next(err)
        })
    },

    deleteList: (req, res, next) => {
        User.findOneAndUpdate({
            username: req.body.username
        }, {
            $pull: {
                lists: {
                    _id: req.body._id
                }
            }
        })
        .then(foundUser => {
            return foundUser ? res.status(200).json({error: false, message: "deleted list succesfully"}) :
                res.status(400).json({error: true, message: "cannot delete list"})
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ListController