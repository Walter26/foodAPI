var express = require('express')
var router = express.Router()
var ListController = require('../controllers/ListController')

// GET methods
router.get('/', ListController.getListsName)

// POST methods
router.post('/', ListController.createList)

module.exports = router