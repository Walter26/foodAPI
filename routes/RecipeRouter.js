var express = require('express')
var router = express.Router()
var RecipeController = require('../controllers/RecipeController')

// GET methods
router.get('/', RecipeController.getRedirect)

// POST methods
router.post('/', RecipeController.createRecipe)

module.exports = router