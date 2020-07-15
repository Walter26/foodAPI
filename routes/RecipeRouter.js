const upload = require('../models/ImageParserModel')

var express = require('express')
var router = express.Router()
var RecipeController = require('../controllers/RecipeController')

// GET methods
router.get('/', RecipeController.getRedirect)

// POST methods
router.post('/', upload.single('recipeImage'), RecipeController.createRecipe)

// DELETE methods
router.delete('/:_id', RecipeController.deleteRecipe)

module.exports = router