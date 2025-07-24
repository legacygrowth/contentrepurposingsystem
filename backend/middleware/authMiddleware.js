const tokenService = require("../services/tokenService");
const sysUserService = require("../services/userService");
const authenticateUserToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Token Required" });
    }

    const tokenData = await tokenService.getTokenByToken(token);
    if (!tokenData) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    if (tokenData.isExpired) {
      return res.status(401).json({ message: "Token Expired" });
    }

    const user = await sysUserService.getUserById(tokenData.userId);
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User Blocked" });
    }

    req.user = {
      userId: user._id,
      isPaymentVerified: user.isPaymentVerified,
      isBlocked: user.isBlocked,
      token: token,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authenticateUserToken;
