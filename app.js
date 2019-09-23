const createError = require('http-errors'),
	express = require('express'),
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

	passport = require("passport")

	homeController = require("./controllers/homeController"),
	errorController = require("./controllers/errorController"),
	usersController = require("./controllers/usersController");
	//workoutProgramsController = require("./controllers/workoutProgramsController"),
	//exercisesController = require("./controllers/exercisesController"),
	//workoutActivitiesController = require("./controllers/workoutActivitiesController");


// App set / use
app.set("port", process.env.PORT || 3000);
app.set('view engine', 'ejs');

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
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

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

// Home
router.get('/', homeController.index);
// Users
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate,
	usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);
// WorkoutPrograms
// Exercises
// WorkoutActivities
//router.use("/workoutPrograms", workoutProgramsRouter);
//router.use("/exercises", exerciseRouter);
//router.use("/workoutActivities", workoutActivitiesRouter);

// Error handling
router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
	console.log(`Server running at http://localhost:${app.get("port")}`);
});