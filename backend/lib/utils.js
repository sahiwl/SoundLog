import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d" // Changed from "7" to "7d" for 7 days
    })

    res.cookie("jwt", token, {
        maxAge:  7 * 24 * 60 * 60 * 1000, //7days in ms
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-sie request forgery attacks
        secure: process.env.NODE_ENV !== "development"
    })

    return token;

    
}   

export const refreshToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }) // Set expiration time to 1 hour
    res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
}