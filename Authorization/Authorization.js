const jwt = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  try {
    const token = req.cookies;
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.id = id;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports =  {authorization} ;
