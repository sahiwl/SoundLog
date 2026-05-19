import rateLimit from "express-rate-limit"


export const rateLimiter = rateLimit({
    windowMs: 10*60*1000, //10mins
    limit: 300, //100 req per window
    message: 'Too many requests from this IP, please try again after 10 minutes.'
})

export const authRateLimiter = rateLimit({
    windowMs: 5*60*1000, //15mins
    limit: 20, //100 req per window
    message: 'Too many requests from this IP, please try again after 5 minutes.'
})

