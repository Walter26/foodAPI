var express = require('express')
var router = express.Router()
var UserController = require('../controllers/UserController')

// GET methods
router.get('/', UserController.login)

// POST methods
router.post('/', UserController.register)

module.exports = router