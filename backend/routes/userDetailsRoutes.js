const express = require("express");
const router = express.Router();
const userDetailsController = require("../controllers/userDetailsController");
const passport = require("passport");

// router.post('/signup', userDetailsController.signup);
// router.post('/login', userDetailsController.login);
router.post("/signUpEmail", userDetailsController.signUpWithEmail);
router.post("/login", userDetailsController.userLogin);
router.get("/verifytoken", userDetailsController.verifytoken);
router.put("/updatePassword", userDetailsController.updatePassword); //  exists
router.put("/updateUser", userDetailsController.updateUser); //  this is the correct function name
router.post("/google-login", userDetailsController.googleLoginWithToken); // <-- Google Login Route
router.post("/facebook-login", userDetailsController.facebookLoginWithToken); // <-- Facebook Login Route
router.post("/details-by-token", userDetailsController.GetUserDetailByToken); //user detail by token
router.get(
  "/getallworkspacebyuserid",
  userDetailsController.getAllWorkspaceByUserId
); //getv  all workspace by user id
router.get("/getAllUserDetails", userDetailsController.getAllUserDetails); //getall user-details

// Add OAuth routes with debugging
router.get("/auth/google", (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })(req, res, next);
});

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      failureRedirect: "/auth/login",
      failureMessage: true,
    })(req, res, next);
  },
  (req, res) => {
    try {
      // Successful authentication, redirect or return token
      const user = req.user;
      if (!user) {
        console.error("No user found after authentication");
        return res.redirect(
          `${
            process.env.FRONTEND_URL || "http://localhost:5173"
          }/auth/login?error=no_user`
        );
      }

      // Get frontend URL from environment variables
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

      // For SPA, redirect to frontend with token/user info
      res.redirect(
        `${frontendUrl}/auth/oauth-callback?user=${encodeURIComponent(
          JSON.stringify(user)
        )}`
      );
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      res.redirect(
        `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/auth/login?error=callback_error`
      );
    }
  }
);

module.exports = router;
