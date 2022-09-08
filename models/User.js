import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        img: {
            type: String,
        },
        subscribers: {
            type: Number,
            default: 0,
        },
        subscribedUsers: {
            type: [String],
        },
    },
    { timestamps: true }
);
UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
});
export default mongoose.model("User", UserSchema);