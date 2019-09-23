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
            repsOrTime: {
                type: String,
                trim: true
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