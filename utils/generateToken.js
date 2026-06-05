const jwt = require("jsonwebtoken");

const generateToken = (res, user) => {
  const role = user.isAdmin ? "admin" : "user";
  const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, { expiresIn: "5d" });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000,
  };

  res.cookie("jwt", token, cookieOptions);
};

module.exports = generateToken;
