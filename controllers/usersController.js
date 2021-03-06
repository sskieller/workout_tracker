const User = require("../models/user"),
	passport = require("passport"),


	getUserParams = (body) => {
		return {
			name: {
				first: body.first,
				last: body.last
			},
			email: body.email,
			workoutPrograms: body.workoutPrograms,
			workoutActivities: body.workoutActivities
		};
	};

module.exports = {
	index: (req,res,next) => {
		User.find()
			.then(users => {
				res.locals.users = users;
            
				next();
			})
			.catch(error => {
				console.log(`Failed fetching users: ${error.message}`);
			});
	},

	indexView: (req,res) => {
		res.render("users/index", {
			flashMessages: {
				success: "Loaded all users"
			}
		});
	},

	new: (req,res) => {
		res.render("users/new");
	},

	create: (req,res,next) => {
		// If validation fails
		if (req.skip) next();

		let newUser = new User(getUserParams(req.body));

		// User.register IS ONLY FOR THE USER LOGIN and module PASSPORT
		User.register(newUser, req.body.password, (error, user) => {
			if (user) {
				req.flash("success", `${user.fullName}'s account created successfully`);
				res.locals.redirect = "/users";
				next();
			} else {
				req.flash("error", `Failed to create user because: ${error.message}`);
				res.locals.redirect = "/users/new";
				next();
			}
		});
	},

	redirectView: (req,res,next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath) res.redirect(redirectPath);
		else next();
	},

	show: (req,res,next) => {
		let userId = req.params.id;
		User.findById(userId)
			.then(user => {
				res.locals.user = user;
				next();
			});
	},

	showView: (req,res) => {
		res.render("users/show");
	},

	edit: (req, res, next) => {
		let userId = req.params.id;
		User.findById(userId)
			.then(user => {
				res.render("users/edit", {
					user: user
				});
			})
			.catch(error => {
				console.log(`Error fetching user by ID: ${error.message}`);
				next(error);
			});
	},

	update: (req, res, next) => {
		let userId = req.params.id;
		userParams = getUserParams(req.body);

		User.findByIdAndUpdate(userId, {
			$set: userParams
		})
			.then(user => {
				res.locals.redirect = `/users/${userId}`;
				res.locals.user = user;
				next();
			})
			.catch(error => {
				console.log(`Error updating user by ID: ${error.message}`);
				next(error);
			});
	},
	delete: (req, res, next) => {
		let userId = req.params.id;
		User.findByIdAndDelete(userId)
			.then(() => {
				res.locals.redirect = "/users";
				next();
			})
			.catch((error) => {
				console.log(`Error deleting user by ID: ${error.message}`);
				next(error);
			});
	},

	login: (req, res) => {
		res.render("users/login");
	},

	authenticate: passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureFlash: "Failed to login",
		successRedirect: "/",
		successFlash: "Logged in!",
	}),

	validate: (req, res, next) => {
		req.sanitizeBody("email").normalizeEmail({
			all_lowercase: true
		}).trim();

		req.check("email", "Email is invalid").isEmail();

		req.check("password", "Password cannot be empty").notEmpty();
		
		req.getValidationResult().then((error) => {
			if (!error.isEmpty()) {
				let messages = error.array().map(e => e.msg);
				req.skip = true;

				req.flash("error", messages.join(" and "));

				res.locals.redirect = "/users/new";

				next();
			} else {
				next();
			}
		});
	},

	logout: (req,res,next) => {
		req.logout();
		req.flash("success", "You have been logged out");
		res.locals.redirect = "/";
		next();
	}
};