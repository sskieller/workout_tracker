"use strict";

module.exports = {
    index: (req,res ) => {
        res.render("index", {
            title: "Workout Tracker"
        });
    },

    logRequestPaths: (req,res,next) => {
        console.log(`Request made to: ${req.url}`);
        next();
    },
}