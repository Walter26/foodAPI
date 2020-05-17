var List = require('../models/ListModel')

var ListController = {
    getListsName: (req, res, next) => {
        List.findAll({
            autor: req.query.autor
        }, "- elements")
        .then((foundLists) => {
            if(foundLists)
                return res.status(200).json(foundLists)
            else
                return res.status(400).json({status: "Not found"})
        })
        .catch((err) => {
            next(err)
        })
    },

    createList: (req, res, next) => {
        let newList = new List({
            autor: req.body.autor || "",
            name: req.body.name || "Sin nombre",
            desc: req.body.desc || "Sin descripción",
            elements: req.body.elements
        })
        return newList.save()
        .then((list) => {
            return res.status(200).json(list)
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = ListController