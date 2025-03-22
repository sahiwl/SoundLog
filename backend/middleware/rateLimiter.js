import rateLimit from "express-rate-limit"


export const rateLimiter = rateLimit({
    windowMs: 10*60*1000, //15mins
    limit: 100, //100 req per window
    message: 'Too many requests from this IP, please try again after 10 minutes.'
})