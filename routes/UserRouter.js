var express = require('express')
var router = express.Router()
var UserController = require('../controllers/UserController')


// GET methods
router.get('/', UserController.getRedirect)

// POST methods
router.post('/', UserController.register)

// PUT methods
router.put('/', UserController.updateUser)

module.exports = router