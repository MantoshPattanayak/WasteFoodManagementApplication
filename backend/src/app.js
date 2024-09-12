const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const cors = require("cors");
var cookieParser = require("cookie-parser");
let api_version = process.env.API_VERSION;
const uploadDir = process.env.UPLOAD_DIR;
const statusCode = require("./utils/statusCode");


//------------------------------------------path all files-----------------------------------------------------//
const authRoutes = require("./routes/api/" + api_version + "/auth/user.routes");
const foodsRoutes = require("./routes/api/" + api_version + "/foods/foods.routes");
const notificationRoutes = require("./routes/api/" + api_version + "/notifications/notifications.routes");
const activityRoutes = require('./routes/api/' + api_version + '/activity/activity.routes');
//-------------------------------------------------------------------------------------------------------------//



//----------------------------------------------middlewares-----------------------------------------------------//
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb"
  })
);
app.use(cookieParser());
app.use((err, req, res, next)=>{
  if(err){
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:"something went wrong"
    })
  }
})
//-------------------------------------------------------------------------------------------------------------//


//-------------------------------------------define router-----------------------------------------------------//
app.use("/auth", authRoutes);
app.use("/food", foodsRoutes);
app.use("/notification", notificationRoutes);
app.use("/activity", activityRoutes);
//-------------------------------------------------------------------------------------------------------------//



module.exports = {
  app
};