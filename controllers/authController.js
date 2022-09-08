import mongoose from "mongoose"
import { createError } from "../error.js";
import User from '../models/User.js';
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
// import createError from '../error.js' 
export const signup = async (req, res, next) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();

        res.status(200).send("user created")
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(createError(404, "User not found"));

        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isCorrect) return next(createError(404, "either email or password incorrect"));

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        const { password, ...others } = user._doc
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(others)
    } catch (err) {
        console.log(err);
    }
}
export const forgotPassword = async (req, res, next) => {

    try {
        // Get a user based on Posted email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('there is no user with this email', 404));
        }

        // 2) Generate the random reset token
        const resetToken = user.createResetPasswordToken()
        await user.save({ validateBeforeSave: false })

        // send it to user's email

        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`

        const message = `forgot password? submit a patch request using ${resetURL}`

        try {
            await sendEmail({
                email: user.email,
                subject: ' your password reset token  valid for just 10 mins ',
                message
            })

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            })
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            console.log(err)
            return next(new AppError("there is a problem", 401))
        }
    } catch (error) {
        console.log(error)
    }

}
export const resetPassword = async (req, res, next) => {

    try {
        // 1) Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // 3) Log the user in, send JWT
        const token = '';
        res.status(200).json({
            status: 'success',
            token,
        })
    }
    catch (err) {
        console.log(err)
    }
}