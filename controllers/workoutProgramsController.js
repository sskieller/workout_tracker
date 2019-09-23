const WorkoutProgram = require("../models/workoutProgram"),

    getWorkoutProgramParams = (body) => {
        return {
            title: body.title,
            description: body.description,
            exercises: {
                name: body.exercises.name,
                description: body.exercises.description,
                numberOfSets: body.exercises.numberOfSets,
                repsOrTime: body.exercises.repsOrTime
            }
        };
    };

module.exports = {
    index: (req,res,next) => {
        WorkoutProgram.find()
            .then(programs => {
                res.locals.workoutPrograms = programs;
                next();
            })
            .catch(error => {
                console.log(`Failed fetching workout programs: ${error.message}`);
            });
    },

    indexView: (req,res) => {
        res.render("workoutPrograms/index", {
            flashMessages: {
                success: "Loaded all workout programs",
            }
        });
    },

    new: (req,res) => {
        res.render("workoutPrograms/new");
    },

    create: (req,res,next) => {
        // If validation fails
        if (req.skip) next();

        let newWorkoutProgram = new WorkoutProgram(getWorkoutProgramParams(req.body));

        // This method MUST be used for creation other than USER LOGIN
        WorkoutProgram.create(newWorkoutProgram)
            .then(program => {
                req.flash("success", `Workout program: ${program.title} created successfully`);
                res.locals.redirect = "/workoutPrograms";
                res.locals.workoutProgram = program;
                next();
            })
            .catch(error => {
                req.flash("error", `Failed to create workout program because: ${error.message}`);
                res.locals.redirect = "/workoutPrograms/new";
                next();
            })
    },

    redirectView: (req,res,next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    show: (req,res,next) => {
        let programId = req.params.id;
        WorkoutProgram.findById(programId)
            .then(program => {
                res.locals.workoutProgram = program;
                next();
            })
    },

    showView: (req,res) => {
        res.render("workoutPrograms/show");
    },

    edit: (req,res,next) => {
        let workoutProgramId = req.params.id;
        WorkoutProgram.findById(workoutProgramId)
            .then(workoutProgram => {
                res.render("workoutPrograms/edit", {
                    workoutProgram: workoutProgram
                });
            })
            .catch(error => {
                console.log(`Error fetching workout program by ID: ${error.message}`);
                next(error);
            });
    },

    update: (req, res, next) => {
        let workoutProgramId = req.params.id;
        workoutProgramParams = getWorkoutProgramParams(req.body);

        WorkoutProgram.findByIdAndUpdate(workoutProgramId, {
            $set: workoutProgramParams
        })
            .then(workoutProgram => {
                res.locals.redirect = `/workoutPrograms/${workoutProgramId}`;
                res.locals.workoutProgram = workoutProgram;
                next();
            })
            .catch(error => {
                console.log(`Error updating workout program by ID: ${error.message}`);
                next(error);
            });
    },

    delete: (req, res, next) => {
        let workoutProgramId = req.params.id;
        WorkoutProgram.findByIdAndDelete(workoutProgramId)
            .then(() => {
                res.locals.redirect = "/workoutPrograms";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting workout program by ID: ${error.message}`);
                next(error);
            });
    },

    validate: (req,res,next) => {
        req.check("title", "Title cannot be empty").notEmpty();
        req.check("description", "Description cannot be empty").notEmpty();

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map(e => e.msg);
                req.skip = true;

                req.flash("error", messages.join(" and "));

                res.locals.redirect = "/workoutPrograms/new";

                next();
            } else {
                next();
            }
        });
    },
}