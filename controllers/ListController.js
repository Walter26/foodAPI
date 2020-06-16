var User = require('../models/UserModel')
var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

var ListController = {
    getUserLists: (req, res, next) => {
        User.findOne({
            username: req.query.username
        })
        .then(foundUser => {
            return foundUser.lists ? res.status(200).json(foundUser.lists) :
                res.status(400).json({status: "user has not created any list"})
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
            return foundUser ? res.status(200).json(foundUser.lists) :
                res.status(400).json({status: "user not found"})
        })
        .catch(err => {
            next(err)
        })
    },

    deleteList: (req, res, next) => {
        User.findOneAndUpdate({
            username: req.body.username
        }), {
            $pull: {
                lists: {
                    _id: req.body._id
                }
            }
        }
        .then(foundUser => {
            return foundUser ? res.status(200).json({status: "list removed"}) :
                res.staus(400).json({status: "something went wrong"})
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ListController