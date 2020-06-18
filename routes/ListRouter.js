var express = require('express')
var router = express.Router()
var ListController = require('../controllers/ListController')

// GET methods
router.get('/', ListController.getUserLists)

// PUT methods
router.put('/', ListController.createList)

// DELETE methods
router.delete('/', ListController.deleteList)

module.exports = router