const mongoose = require("mongoose"),
	{Schema} = mongoose,
	workoutProgramSchema = new Schema(
		{
			title: {
				type: String,
				required: true,
				unique: true,
			},
			description: {
				type: String,
				required: true
			},
			exercises: [{
				name: {
					type: String,
					required: true
				},
				description: {
					type: String,
					required: true
				},
				numberOfSets: {
					type: Number,
					min: [0, "Sets cannot be below 0"],
					max: 9999
				},
				repsOrTime: {
					type: String,
					trim: true
				}
			}]
		},
		{
			timestamps: true
		}
	);

module.exports = mongoose.model("WorkoutProgram", workoutProgramSchema);