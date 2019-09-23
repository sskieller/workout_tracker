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
        if (req.skip) next();

        let newUser = new User(getUserParams(req.body));

        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", `${user.fullName}'s account created successfully`);
                res.locals.redirect = "/users";
                next();
            }
        })
    }
}