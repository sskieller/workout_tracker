const mongoose = require("mongoose"),
    {Schema} = mongoose,
    exerciseSchema = new Schema(
        {
            name: {
                type: String,
                required: true,
                unique: true,
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
            numberOfRepetitions: {
                type: Number,
                min: [0, "Repetitions cannot be below 0"],
                max: 9999
            },
            timeToLast: {
                hours: {
                    type: Number,
                    min: [0, "Hours cannot be below 0"],
                    max: 99
                },
                minutes: {
                    type: Number,
                    min: [0, "Minutes cannot be below 0"],
                    max: 99
                },
                seconds: {
                    type: Number,
                    min: [0, "Seconds cannot be below 0"],
                    max: 99
                }
            }
        },
        {
            timestamps: true
        }
    )

exerciseSchema.virtual("timeToLastConcatenated")
    .get(function () {
        return `${this.timeToLast.hours}:${this.timeToLast.minutes}:${this.timeToLast.seconds}`;
    });

module.exports = mongoose.model("exercise", exerciseSchema);