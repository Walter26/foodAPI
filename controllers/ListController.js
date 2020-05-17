var User = require('../models/UserModel')

var ListController = {
    createList: (req, res, next) => {
        let newList = new List({
            name: req.body.listData.name || "Sin nombre",
            desc: req.body.listData.desc || "Sin descripción",
            elements: req.body.listData.elements
        })

        User.findOneAndUpdate({
            username: req.body.username
        },{
            $push: { lists: { newList } }
        })
        .then((list) => {
            return res.status(200).json(newList)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ListController