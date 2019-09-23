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
                type: Schema.Types.ObjectId, ref: "exercise"
            }]
        },
        {
            timestamps: true
        }
    )

module.exports = mongoose.model("workoutProgram", workoutProgramSchema);