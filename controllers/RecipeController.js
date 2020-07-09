var Recipe = require('../models/RecipeModel')

var RecipeController = {
    // GET
    getRedirect: (req, res, next) => {
        if(req.query.author){
            console.log(`entering for ${req.query.author}`)
            getAllUserRecipes(req, res, next)
        }
        else{
            console.log(`entering for every user`)
            getAllPublicRecipes(req, res, next)
        }
    },

    // POST
    createRecipe: (req, res, next) => {
        console.log("*************************************************************************")
        console.log(req.body)
        console.log("*************************************************************************")
        console.log(req.file)
        console.log("*************************************************************************")


        Recipe.findOne({
            author: req.body.author,
            title: req.body.title
        })
            .then(foundList => {
                if (foundList)
                    return res.status(400).json({ status: "recipe already exists" })
                else {
                    let newRecipe = new Recipe({
                        author: req.body.author,
                        title: req.body.title,
                        desc: req.body.desc || "no desc",
                        recipeType: req.body.recipeType || null,
                        steps: req.body.steps,
                        ingredients: req.body.ingredients,
                        privacy: req.body.privacy || false,
                        recipeImage: req.file.location || "INF"
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
        author: req.query.author
    })
    .then(recipesArray => {
        return recipesArray ? res.status(200).json(
            {error: false, message: "success", recipes: recipesArray}
        ) :
            res.status(400).json(
                {error: true, message: "failure", recipes: null}
            )
    })
    .catch(err => {
        next(err)
    })
}

var getAllPublicRecipes = (req, res, next) => {
    Recipe.find({ privacy: false })
        .then(recipesArray => {
            return recipesArray ? res.status(200).json(
                {error: false, message: "success", recipes: recipesArray.map(element => {
                    delete element._id
                    element.steps.forEach(sub => {
                        delete sub._id
                    })
                    element.ingredients.forEach(sub => {
                        delete sub._id
                    })
                    delete element.__v

                    return element
                })}
            ) :
            res.status(400).json(
                {error: true, message: "failure", recipes: null}
            )
        })
        .catch(err => {
            next(err)
        })
}

module.exports = RecipeController