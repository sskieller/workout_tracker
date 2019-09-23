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
            }
        },
        {
            timestamps: true
        }
    )

module.exports = mongoose.model("exercise", exerciseSchema);