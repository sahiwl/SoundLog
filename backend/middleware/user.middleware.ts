import { NextFunction, Request, Response } from "express";
import User from "../models/user.model.js";

export const verifyUser = async (req: Request ,res: Response, next:NextFunction) : Promise<void> => {
    try {
        const {username} = req.params;
        if(typeof username !== "string"){
            res.status(400).json({message: "Invalid username"});
            return;
        }
        const user = await User.findOne({username}).select("-password");

        if(!user){
             res.status(404).json({message: "User Not Found"});
             return;
        }
        
        req.userId = user._id;
        req.profilePic = user.profilePic;
        req.username = username;
        next();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error in verifyUser middleware:", message);
        res.status(500).json({message: "Internal Server Error"});
    }
}