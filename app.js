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

	indexRouter = require('./routes/index'),
	usersRouter = require('./routes/users'),
	workoutProgramsRouter = require("./routes/workoutPrograms"),
	workoutActivitiesRouter = require("./routes/workoutActivities");

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

// ROUTES
router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use("/workoutPrograms", workoutProgramsRouter);
router.use("/workoutActivities", workoutActivitiesRouter);

// Error handling
router.use(errorController.logErrors);
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

app.listen(app.get("port"), () => {
	console.log(`Server running at http://localhost:${app.get("port")}`);
});