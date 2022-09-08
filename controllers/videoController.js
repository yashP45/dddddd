import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js"
export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body })

    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo)
    } catch (err) {
        next(err)
    }
}

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, "video not found"))
        if (req.user.id === video.userId) {
            const updateVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                $new: true
            });
            res.status(200).json(updateVideo)
        } else {
            return next(createError(403, "you can update onli your videos"))
        }
    } catch (err) {
        next(err)
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        if (!video) return next(createError(404, "video not found"))
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("video deleted successfully")
        } else {
            return next(createError(403, "you can delete onli your videos"))
        }
    } catch (err) {
        next(err)
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (err) {
        next(err)
    }
}

