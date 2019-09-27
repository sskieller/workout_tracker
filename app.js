// LINK: https://quiet-headland-70784.herokuapp.com/

const express = require("express"),
	app = express(),
	router = express.Router(),

	layouts = require("express-ejs-layouts"),
	logger = require("morgan"),
	path = require("path"),
	methodOverride = require("method-override"),
	expressValidator = require("express-validator"),

	expressSession = require("express-session"),
	cookieParser = require("cookie-parser"),
	connectFlash = require("connect-flash"),

	passport = require("passport"),

	homeController = require("./controllers/homeController"),
	usersController = require("./controllers/usersController"),
	workoutProgramsController = require("./controllers/workoutProgramsController"),
	auth = require('connect-ensure-login');


// Required to connect to database
const db = require("./db-init");

app.use(function(err, req, res, next) {
	console.log(err);
});

// App set / use
app.set("view engine", "ejs");

router.use(express.json());
router.use(express.urlencoded({
	extended: false
})
);
router.use(expressValidator());

router.use(cookieParser("secret_passcode_should_use_env_var"));
router.use(expressSession({
	secret: "secret_passcode_should_use_env_var",
	cookie: {
		maxAge: 4000000
	},
	resave: false,
	saveUninitialized: false
}));

// Security
router.use(passport.initialize());
router.use(passport.session());
const User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use(connectFlash());
router.use((req,res,next) => {
	res.locals.flashMessages = req.flash();
	res.locals.loggedIn = req.isAuthenticated();
	res.locals.currentUser = req.user;
	next();
});

// view engine setup
router.use(express.static(path.join(__dirname, "public")));
router.use(layouts);

router.use(logger("dev"));
router.use(homeController.logRequestPaths);
router.use(
	methodOverride("_method", {
		methods: ["POST", "GET"]
	})
);

// HOME
app.use("/", router);
router.get("/", homeController.index);

// LOGIN
router.get("/users/login", 
	usersController.login);
// Redirects automatically in the 'authenticate' method
router.post("/users/login", 
	usersController.authenticate);
router.get("/users/logout", 
	auth.ensureLoggedIn("/users/login"),
	usersController.logout, usersController.redirectView);
// USERS
router.get("/users",
	auth.ensureLoggedIn("/users/login"), 
	usersController.index, usersController.indexView);
router.get("/users/new", 
	usersController.new);
router.post("/users/create", 
	usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/:id", 
	auth.ensureLoggedIn("/users/login"),
	usersController.show, usersController.showView);
router.get("/users/:id/edit", 
	auth.ensureLoggedIn("/users/login"),
	usersController.edit);
router.put("/users/:id/update", 
	auth.ensureLoggedIn("/users/login"),
	usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", 
	auth.ensureLoggedIn("/users/login"),
	usersController.delete, usersController.redirectView);

// WorkoutPrograms
router.get("/workoutPrograms", 
	workoutProgramsController.index, 
	workoutProgramsController.indexView);
router.get("/workoutPrograms/new",
	auth.ensureLoggedIn("/users/login"), 
	workoutProgramsController.new);
router.post("/workoutPrograms/create",
	auth.ensureLoggedIn("/users/login"), 
	workoutProgramsController.validate, 
	workoutProgramsController.create, 
	workoutProgramsController.redirectView);
router.get("/workoutPrograms/:id",
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.show, 
	workoutProgramsController.showView);
router.get("/workoutPrograms/:id/newExercise",
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.show, 
	workoutProgramsController.newExercise);
router.put("/workoutPrograms/:id/newExercise",
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.updateExercises,
	workoutProgramsController.redirectView);
router.get("/workoutPrograms/:id/edit", 
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.edit);
router.put("/workoutPrograms/:id/update", 
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.update, 
	workoutProgramsController.redirectView);
router.delete("/workoutPrograms/:id/delete", 
	auth.ensureLoggedIn("/users/login"),
	workoutProgramsController.delete, 
	workoutProgramsController.redirectView);


// TODO: på en eller anden måde skal WORKOUTPROGRAM opdateres til at kunne modificeres
// med EXERCISES. Se i WORKOUTPROGRAMSCONTROLLER, samt WORKOUTPROGRAM model for mere.
// APP.JS indeholder routes, men kræver nogle stykker mere for at kunne lave exercises.
// Kig i SHOW.EJS for WORKOUTPROGRAMS for at se oversigten over visningen af det 
// enkelte workoutProgram. 


module.exports = app;