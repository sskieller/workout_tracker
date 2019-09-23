const mongoose = require("mongoose"),
    {Schema} = mongoose,
    passportLocalMongoose = require("passport-local-mongoose"),

    userSchema = new Schema(
        {
            name: {
                first: {
                    type: String,
                    trim: true
                },
                last: {
                    type: String,
                    trim: true
                }
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                unique: true
            },
            workoutPrograms: [
                {
                    type: Schema.Types.ObjectId, ref: "workoutProgram"
                }
            ],
            workoutActivities: [
                {
                    type: Schema.Types.ObjectId, ref: "workoutActivity"
                }
            ]
        },
        {
            timestamps: true
        }
    );

userSchema.virtual("fullName")
    .get(function () {
        return `${this.name.first} ${this.name.last}`;
    });

// hashing
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);