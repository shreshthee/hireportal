const Student = require("../models/Student");
const Notice = require("../models/Notice")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.token
  if (token == null) return res.render("login-student",{notLogged:true});
  jwt.verify(token, process.env.SECRET_KEY, (err, student) => {
    if (err) return res.render("login-student",{notLogged:true});
    req.student = student;
    next();
  });
};


exports.getLogin = (req, res) => {
  res.render("login-student");
};




exports.postLogin = async (req, res) => {
  const { roll, pass } = req.body;
  console.log(req.body);
  try {
    const student = await Student.findOne({ roll });
    // wrong roll number
    if (student == null) return res.render("login-student",{checkpass:true});
    const match = await bcrypt.compare(pass, student.password);
    console.log(match);
    if (match) {
      const token = await jwt.sign(
        { name: student.name, email: student.email, id: student.id },
        process.env.SECRET_KEY
      );
      res.cookie('token',token).redirect("/student/home");
    } else throw new Error("wrong password");
  } catch (err) {
    return res.render("login-student",{checkpass:true});
  }
};
exports.getRegister = (req, res) => {
  res.render("register-student");
};
exports.getDashboard = async (req, res) => {
  const notices = await Notice.find({
    $or:[
      {
        targets:{
          course:'0',
          branch:'0',
          year:'0',
        }
      },
      {
        targets:{
          course:'0',
          branch:'0',
          year:req.student.year,
        }
      },
      {
        targets:{
          course:'0',
          branch:req.student.branch,
          year:'0',
        }
      },
      {
        targets:{
          course:'0',
          branch:req.student.branch,
          year:req.student.year,
        }
      },
      {
        targets:{
          course:req.student.course,
          branch:'0',
          year:'0',
        }
      },
      {
        targets:{
          course:req.student.course,
          branch:'0',
          year:req.student.year,
        }
      },
      {
        targets:{
          course:req.student.course,
          branch:req.student.branch,
          year:'0',
        }
      },
      {
        targets:{
          course:req.student.course,
          branch:req.student.branch,
          year:req.student.year,
        }
      },
    ]
  })
  res.render('student-home',{notices,student:req.student})
};
exports.postRegister = async (req, res) => {
  const { email, name, roll, course, branch, pass, cpass, year } = req.body;
  console.log(req.body);
  try {
    if(cpass!=pass) throw new Error('password not match')
    const hash = await bcrypt.hash(pass, 10);
    const student = new Student({
      email,
      name,
      roll,
      course,
      branch,
      password: hash,
      year
    });
    await student.save();
    res.render("login-student", { success: true });
  } catch (err) {
    return res.render("register-student",{checkpass:true});
  }
};
exports.getNotice = (req, res) => {
  res.send(req.params.id);
};
exports.logout = (req,res)=>{
  try {
    res.clearCookie("token").redirect('/student/login')
  } catch (err) {
    res.redirect('/student/login')
  }
}
