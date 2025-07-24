const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const userDetailsRoutes = require("./routes/userDetailsRoutes");
const postRoutes = require("./routes/postRoutes");
const postTemplateRoutes = require("./routes/postTemplateRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const agencyUserRoutes = require("./routes/agencyUserRoutes");
const tempUserRoutes = require("./routes/tempUserRoutes");
const facebookRoutes = require("./routes/facebooRoutes");
const twitterRoutes = require("./routes/twitterRoutes");
const authenticateUserRoutes = require("./routes/authenticateUserRoutes");
const socialMediaRoutes = require("./routes/socialMediaRoutes");
const socialMediaAccountsRoutes = require("./routes/socialMediaAccontsRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const memberRoutes = require("./routes/memberRoutes");
const workspaceAccountsRoutes = require("./routes/workspaceAccountsRoutes");
const userTypesRoutes = require("./routes/userTypesRoutes");
const commentRoutes = require("./routes/postCommentsRoute");
const sysWorkspaceUser = require("./routes/sysWorkspaceUserRoutes");
const twitterOAuthRoutes = require("./routes/twitterOAuthRoutes");
const twitterV2Routes = require("./routes/twitterV2Routes");
const stripeRoutes = require("./routes/stripeRoutes");
const paymentPlanController = require("./controllers/paymentPlanController");
const path = require("path");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const { fa } = require("@faker-js/faker");
// const facebookAuthRoutes = require("./routes/facebookAuthRoutes");
const twitterGOTRoutes = require("./routes/twitterGOTRoutes");
dotenv.config();
connectDB();
const app = express();
app.use(cors({ origin: true, credentials: true })); // allow cookies from frontend
app.use(bodyParser.json());
app.use(express.json());
// Express session setup (Required for passport to work with session)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      secure: false, // :exclamation: Localhost testing: false
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Import passport configuration
require("./config/passport");
app.use("/api/users", userDetailsRoutes); // User details
app.use("/api/social", socialMediaRoutes); // Social media
app.use("/api/socialmedia", socialMediaAccountsRoutes);
app.use("/api/authenticateuser", authenticateUserRoutes); // Authenticate user
app.use("/api/workspace", workspaceRoutes); // Workspaces
app.use("/api/members", memberRoutes); // Members
app.use("/api/posts", postRoutes); // Posts
app.use("/api/posttemplate", postTemplateRoutes); // Post templates
app.use("/api/agency", agencyRoutes); // Agencies
app.use("/api/agencyuser", agencyUserRoutes); // Agency users
app.use("/api/tempuser", tempUserRoutes);
app.use("/api/facebook", facebookRoutes); // Facebook routes
app.use("/api/twitter", twitterRoutes); // Twitter routes
app.use("/api/socialmedia", socialMediaAccountsRoutes);
app.use("/api/workspaceaccounts", workspaceAccountsRoutes); //workspaceAccount routes
app.use("/api/usertypes", userTypesRoutes); ///usertypes routes
app.use("/api/comments", commentRoutes); //post comments
app.use("/api/workspaceUSer", sysWorkspaceUser); //sys work space user
app.use("/api", twitterOAuthRoutes); /// for twiter auth
app.use("/api/payment-plan", paymentPlanController)
app.use("/api/stripe", stripeRoutes); // Stripe routes
//app.use("/api/twitter", twitterV2Routes);
// app.use("/api/facebook", facebookAuthRoutes);
app.use("/api/twitter", twitterGOTRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//  Old APP.js

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const session = require("express-session");
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const userDetailsRoutes = require("./routes/userDetailsRoutes");
// const authenticateUserRoutes = require("./routes/authenticateUserRoutes");
// const socialMediaRoutes = require("./routes/socialMediaRoutes");
// const socialMediaAccountsRoutes = require("./routes/socialMediaAccontsRoutes");
// const workspaceRoutes = require("./routes/workspaceRoutes");
// const memberRoutes = require("./routes/memberRoutes");
// const postRoutes = require("./routes/postRoutes");
// const postTemplateRoutes = require("./routes/postTemplateRoutes");
// const agencyRoutes = require("./routes/agencyRoutes");
// const agencyUserRoutes = require("./routes/agencyUserRoutes");
// const tempUserRoutes = require("./routes/tempUserRoutes");
// const facebookRoutes = require("./routes/facebooRoutes");
// const twitterRoutes = require("./routes/twitterRoutes");
// const workspaceAccountsRoutes = require("./routes/workspaceAccountsRoutes");
// const userTypesRoutes = require('./routes/userTypesRoutes')
// const commentRoutes=require("./routes/postCommentsRoute")
// const sysWorkspaceUser=require("./routes/sysWorkspaceUserRoutes")
// const path = require('path');
// const connectDB = require("./config/db");
// const { fa } = require("@faker-js/faker");
// dotenv.config();
// connectDB();
// const app = express();
// // Middleware
// app.use(cors());
// app.use(express.json());
// // Express session setup
// app.use(bodyParser.json());
// // Express session setup (Required for passport to work with session)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Use secure cookies in production
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );
// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// // Import passport configuration
// require("./config/passport");
// app.use("/api/users", userDetailsRoutes); // User details
// app.use("/api/social", socialMediaRoutes); // Social media
// app.use("/api/socialmedia", socialMediaAccountsRoutes);
// app.use("/api/authenticateuser", authenticateUserRoutes); // Authenticate user
// app.use("/api/workspace", workspaceRoutes); // Workspaces
// app.use("/api/members", memberRoutes); // Members
// app.use("/api/posts", postRoutes); // Posts
// app.use("/api/posttemplate", postTemplateRoutes); // Post templates
// app.use("/api/agency", agencyRoutes); // Agencies
// app.use("/api/agencyuser", agencyUserRoutes); // Agency users
// app.use("/api/tempuser", tempUserRoutes);
// app.use("/api/facebook", facebookRoutes); // Facebook routes
// app.use("/api/twitter", twitterRoutes); // Twitter routes
// app.use("/api/socialmedia", socialMediaAccountsRoutes)
// app.use("/api/workspaceaccounts", workspaceAccountsRoutes);;//workspaceAccount routes
// app.use('/api/usertypes', userTypesRoutes);  ///usertypes routes
// app.use('/api/comments',commentRoutes)//post comments
// app.use('/api/workspaceUSer',sysWorkspaceUser) //sys work space user
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
