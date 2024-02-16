const Interview = require('../models/interview');

module.exports.addInterview = function (req, res) {
  try {
    if (req.cookies.user_id) {
      return res.render("add_interview", {
        title: "Add Student",
      });
    } else {
      return res.redirect("/users/sign-in");
    }
  } catch (err) {
    console.log("Error in addInterview:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.createInterview = function (req, res) {
  try {
    console.log(req.body.company_name);
    Interview.findOne({ company_name: req.body.company_name })
      .then(company => {
        if (!company) {
          return Interview.create({
            company_name: req.body.company_name,
            date: req.body.interview_date,
          });
        } else {
          console.log("interview is already added");
          return Promise.reject("Interview is already added");
        }
      })
      .then(new_interview => {
        return res.redirect("/users/profile");
      })
      .catch(err => {
        console.log("Error in createInterview:", err);
        return res.redirect("back");
      });
  } catch (err) {
    console.log("Error in createInterview:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.interviewDetails = async (req, res) => {
  try {
    const interviews = await Interview.findOne({ _id: req.params.id }).populate(
      "students.student",
      "name"
    );
    return res.render("interview_details", {
      title: "MY page",
      interview: interviews,
    });
  } catch (err) {
    console.log("error while fetching all the interviews from the DB!", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
