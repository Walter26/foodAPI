var Recipe = require('../models/RecipeModel')
var fs = require('fs')

var RecipeController = {
    getRedirect: (req, res, next) => {
        if(req.body.username)
            getAllUserRecipes(req, res, next)
        else
            getAllPublicRecipes(req, res, next)
    },

    createRecipe: (req, res, next) => {
        Recipe.findOne({
            autor: req.body.autor,
            title: req.body.title
        })
            .then(foundList => {
                if (foundList)
                    return res.status(400).json({ status: "recipe already exists" })
                else {
                    let newRecipe = new Recipe({
                        autor: req.body.autor,
                        title: req.body.title,
                        desc: req.body.desc || "no desc",
                        recipeType: req.body.recipeType || null,
                        steps: req.body.steps,
                        ingredients: req.body.ingredients,
                        privacy: req.body.privacy || false,
                        videoURL: req.body.videoURL || "N/A",
                        imageURL: req.body.imageURL || "N/A"
                    })
                    return newRecipe.save();
                }
            })
            .then((newRecipe) => res.status(200).json(newRecipe))
            .catch(err => {
                next(err);
            })
    },

    deleteRecipe: (req, res, next) => {
        Recipe.deleteOne({
            _id: req.body._id
        })
        .then(deletedCount => {
            return count > 0 ? res.status(200).json({status: "deleted"}) : 
                res.status(400).json({status: "something went wrong"})
        })
        .catch(err => {
            next(err)
        })
    }
}

var getAllUserRecipes = (req, res, next) => {
    Recipe.find({
        autor: req.body.username
    })
    .then(recipesArray => {
        fs.writeFile('temp/allUserRecipes.json', JSON.stringify(recipesArray, null, 2), (err) => {
            if(err) throw new Error();
        })

        return res.status(200).download('temp/allUserRecipes.json')
    })
    .catch(err => {
        next(err)
    })
}

var getAllPublicRecipes = (req, res, next) => {
    Recipe.find({ privacy: false })
        .then(recipesArray => {
            fs.writeFile('temp/allRecipes.json', JSON.stringify(recipesArray, null, 2), (err) => {
                if(err) throw err;
            })
    
            res.download('temp/allRecipes.json')
        })
        .catch(err => {
            next(err)
        })
}

module.exports = RecipeController