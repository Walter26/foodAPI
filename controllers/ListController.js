var User = require('../models/UserModel')
var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

var ListController = {
    getUserLists: (req, res, next) => {
        User.findOne({
            username: req.query.username
        })
        .then(foundUser => {
            if(foundUser.lists)
                return res.status(200).json(foundUser.lists)
            else
                return res.status(400).json({status: "user has not created any list"})
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
            if(foundUser)
                return res.status(200).json(foundUser.lists)
            else
                return res.status(400).json({status: "user not found"})
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ListController