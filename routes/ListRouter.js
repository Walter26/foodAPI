var express = require('express')
var router = express.Router()
var ListController = require('../controllers/ListController')

// GET methods

// PUT methods
router.put('/', ListController.createList)

module.exports = router