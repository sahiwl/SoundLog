import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: '/',
  });

  return token;
};

// export const refreshToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   res.cookie("jwt", token, {
//     maxAge: 60 * 60 * 1000, // 1 hour
//     httpOnly: true,
//     secure: true,
//     sameSite: 'none',
//     path: '/',
//     domain: 'soundlog-be.onrender.com'
//   });
// };
