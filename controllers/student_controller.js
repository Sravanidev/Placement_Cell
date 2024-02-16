const Student = require('../models/student');
const Interview = require('../models/interview');

module.exports.addStudent = function(req, res) {
  try {
    if(req.cookies.user_id) {
      return res.render('add_student', {
        title: 'Add Student',
      });
    } else {
      // return res.redirect('/users/sign-in');
    }
  } catch (err) {
    console.log("Error in addStudent:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.createStudent = async function(req, res) {
  try {
    const user = await Student.findOne({ email: req.body.email });
    if (!user) {
      const dsa_score = req.body.dsa_score;
      const webD_score = req.body.webD_score;
      const react_score = req.body.react_score;
      if (
        dsa_score < 0 ||
        dsa_score > 100 ||
        webD_score > 100 ||
        webD_score < 0 ||
        react_score < 0 ||
        react_score > 100
      ) {
        return res.redirect("back");
      }
      await Student.create({
        name: req.body.name,
        email: req.body.email,
        batch: req.body.batch,
        status: req.body.status,
        dsa_score: req.body.dsa_score,
        webD_score: req.body.webD_score,
        react_score: req.body.react_score,
      });
      return res.redirect("/users/profile");
    } else {
      console.log("student is already Added");
      return res.redirect("/users/profile");
    }
  } catch (err) {
    console.log("Error in createStudent:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.studentDetails = async function(req, res) {
  try {
    console.log(req.params.id);
    const student = await Student.findOne({ _id: req.params.id });
    return res.render("student_details", {
      title: "MY page",
      student: student,
    });
  } catch (err) {
    console.log("Error in studentDetails:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.editStudentDetails = async function(req, res) {
  try {
    console.log(req.params.id);
    const student = await Student.findOne({ _id: req.params.id });
    return res.render("edit_student", {
      title: "MY page",
      student: student,
    });
  } catch (err) {
    console.log("Error in editStudentDetails:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.updateStudent = async function(req, res) {
  try {
    const student = await Student.findOne({ email: req.body.email });
    if (student) {
      if (req.body.status != undefined && req.body.status != student.status) {
        await student.updateOne({ email: req.body.email }, { status: req.body.status });
        await student.save();
        console.log("student status updated");
      }
      
      if (req.body.company != undefined) {
        await Student.updateOne(
          { email: req.body.email },
          {
            $push: {
              interviews: [
                {
                  company: req.body.company,
                  date: req.body.date,
                  result: req.body.result,
                },
              ],
            },
          }
        );
        await student.save();
      }

      const company = await Interview.findOne({ company_name: req.body.company });
      if (company) {
        await Interview.updateOne(
          { company_name: req.body.company },
          {
            $push: {
              students: [
                {
                  student: student._id,
                  result: "Interview Pending",
                },
              ],
            },
          }
        );
        await company.save();
      } else {
        await Interview.create({
          company_name: req.body.company,
          date: req.body.date,
          students: [
            {
              student: student._id,
              result: "Interview Pending",
            },
          ],
        });
      }
      return res.redirect("back");
    } else {
      console.log("student found");
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in updateStudent:", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
