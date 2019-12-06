"use strict";

module.exports = {
	index: (req,res ) => {
		res.render("index", {
			title: "Nikita og Søren's Bryllup 2019"
		});
	},

	logRequestPaths: (req,res,next) => {
		console.log(`Request made to: ${req.url}`);
		next();
	},
};