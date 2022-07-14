const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var fetchuser = require("../midleware/fetchuser");
var jwt = require("jsonwebtoken");

const jwt_script = "adarshisagood$oy";
// 1 rout for creating(C) ,Validation (v) ,bcript (B) and give authanticating (A) token and ensure uniqu email -------------
router.post(
  "/",
  [
    body("name", "enter a valid name").isLength({ min: 3 }), // validating
    body("email", "enter a valid email").isEmail(),
    body("password", "possword must be atlist 5 chr").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email }); //insure a unique email
      if (user) {
        return res.status(400).json({success,
          error: "please enter uniqur value for email this email alredy exit",
        });
      }
      const salt = await bcrypt.genSalt(10); // hach the password
      secPass = await bcrypt.hash(req.body.password, salt);

      // creating the user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_script); // giving user a token
      console.log(authtoken);
      // jwt.sign(user)
      //  res.json(user)
        success=true;
        res.json({success, authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).json({success,
        error: "some error has occer",
      });
    }
  }
);

// 2 rout for authanticate user (/api/auth/login),Validation (v) ,bcript (B) and give authanticating (A) token and ensure uniqu email -------------
router.post(
  "/login",
  [body("email", "enter a valid email").isEmail()],
  [body("password", " password canot be blank").exists()],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "please try to login with correct credentials" });
      }

      const passwordCamapir = await bcrypt.compare(password, user.password);

      if (!passwordCamapir) {
        return res
          .status(400)
          .json({success, error: "please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_script); // giving user a token
      // console.log(authtoken);
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).json({success,error:"internal server error erro has occer"});
    }
  }
);

// 3 -rout get logged in User detatle  (/api/auth/getuser) no login requir -------------
router.post("/getuser", fetchuser, async (req, res) => {
  let success=false
  try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.json({success,user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success,
      error: "some error has occer",
    });
  }
});
module.exports = router;
