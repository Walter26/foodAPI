var User = require('../models/UserModel')

var ListController = {
    getUserLists: (req, res, next) => {
        console.log(req.query)
        User.findOne({
            username: req.query.username
        })
            .then(foundUser => {
                return foundUser.lists ? res.status(200).json({ error: false, message: "success", lists: foundUser.lists }) :
                    res.status(400).json({ error: true, message: "cannot get lists", lists: null })
            })
            .catch(err => {
                console.log(err)
                next(err)
            })
    },

    createList: (req, res, next) => {
        console.log('**************************************************************************************')
        console.log('logging request body')
        console.log(req.body)
        console.log('**************************************************************************************')

        User.findOneAndUpdate({
            username: req.body.username
        }, {
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
                return foundUser ? res.status(200).json({ error: false, message: "created list succesfully" }) :
                    res.status(400).json({ error: true, message: "cannot create list" })
            })
            .catch(err => {
                next(err)
            })
    },

    updateList: (req, res, next) => {
        User.findOneAndUpdate({
            username: req.body.username
        },
            {
                $set: {
                    'lists.$[i]': req.body.listData,
                }
            },
            {
                arrayFilters: ['i._id': req.body.listData._id]
            }
        )
            .then((foundUser) => {
                return foundUser ? res.status(200).json({ error: false, message: "created updated succesfully" }) :
                    res.status(400).json({ error: true, message: "cannot create list" })
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
                return foundUser ? res.status(200).json({ error: false, message: "deleted list succesfully" }) :
                    res.status(400).json({ error: true, message: "cannot delete list" })
            })
            .catch(err => {
                next(err)
            })
    }
}

module.exports = ListController