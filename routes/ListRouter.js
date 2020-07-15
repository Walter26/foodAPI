var express = require('express')
var router = express.Router()
var ListController = require('../controllers/ListController')

// GET methods
router.get('/', ListController.getUserLists)

// POST methods
router.post('/', ListController.createList)

// POST methods
router.put('/', ListController.updateList)

// DELETE methods
router.delete('/:username/:id', ListController.deleteList)

module.exports = router