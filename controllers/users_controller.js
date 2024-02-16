const User = require('../models/user');
const Student = require('../models/student');
const Interview = require('../models/interview');


module.exports.profile = async function(req, res) {
  try {
    if (req.cookies.user_id) {
      const user = await User.findById(req.cookies.user_id);
      const students = await Student.find({});
      const interviewfetch = await Interview.find({});
      console.log('interviewfetch', interviewfetch);
      return res.render("user_profile", {
        title: "User Profile",
        user: user,
        students: students,
        interviews: interviewfetch,
      });
    } else {
      console.log("entered Headers");
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error in profile:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// sign up page
module.exports.signUp = function(req, res) {
  try {
    if (!req.cookies.user) {
      return res.render("user_sign_up", {
        title: "Placement Cell | Sign Up",
      });
    } else {
      return res.redirect("/users/profile");
    }
  } catch (err) {
    console.log("Error in signUp:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// sign in page
module.exports.signIn = function(req, res) {
  try {
    if (!req.cookies.user_id) {
      return res.render("user_sign_in", {
        title: "Placement Cell | Sign In",
      });
    } else {
      return res.redirect("/users/profile");
    }
  } catch (err) {
    console.log("Error in signIn:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



//Sign up data
module.exports.create = async function(req, res) {
  try {
    // later for sign up
    if (req.body.password !== req.body.confirm_password) {
      // req.flash("success", "Password and Confirm Password are not same");
      return res.redirect("back");
    }
    
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      // User already exists
      // req.flash("error", "User already exists");
      return res.redirect("back");
    }

    // Create new user
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    // req.flash("success", "Signed Up Successfully");
    return res.redirect("/users/sign-in");
  } catch (err) {
    console.log("Error in create:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



// sign in data
module.exports.createSession = async function(req, res) {
  try {
    // find the user
    const user = await User.findOne({ email: req.body.email });
    // handle user found
    if (user) {
      // handle unmatched password
      if (user.password != req.body.password) {
        // user.validPassword(req.body.password)
        // req.flash("error", "Wrong username or password");
        return res.redirect("back");
      }
      // handle session create
      res.cookie("user_id", user.id);
      // req.flash("success", "Logged in successfully");
      return res.redirect("/users/profile");
    } else {
      // handle user not found
      // req.flash("error", "Wrong username or password");
      // console.log("Not signed in");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in createSession:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


//Sign out
module.exports.signOut = function(req, res) {
  try {
    res.clearCookie('user_id');
    // res.clearCookie(user_id);
    // req.flash("success", "Signed Out Successfully");
    return res.redirect('back');
  } catch (err) {
    console.log("Error in signOut:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// render reset password page
module.exports.resetPassword = function(req, res) {
  try {
    return res.render('user_reset_password', {
      title: 'Placement Cell | Reset Password',
    });
  } catch (err) {
    console.log("Error in resetPassword:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//reset password

module.exports.resetUserPassword = async function(req, res) {
  try {
    // password and confirm_password are not same
    console.log(req.body);
    if (req.body.password !== req.body.confirm_password) {
      // req.flash("error", "Password and Confirm Password are not same");
      // console.log("password and confirm_password are not same");
      return res.redirect("back");
    }
    // find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // user not found
      console.log("Unable to find the user with the specified email");
      // req.flash("error", "User not found");
      return res.redirect("back");
    }
    // user found
    console.log(user);
    user.password = req.body.password;
    await user.save();
    // req.flash("success", "Password Changed Successfully");
    console.log("Password changed successfully");
    return res.redirect("/users/profile");
  } catch (err) {
    console.log("Error in resetUserPassword:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
