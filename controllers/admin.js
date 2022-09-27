const Admin = require("../models/Admin");
const Notice = require('../models/Notice')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.cookies.token_admin;
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, admin) => {
    if (err) return res.send(err.message);
    req.admin = admin;
    next();
  });
};

exports.getLogin = (req, res) => {
  res.render("login-admin");
};

exports.postLogin = async (req, res) => {
  const { roll, pass } = req.body;
  console.log(req.body);
  try {
    const admin = await Admin.findOne({ roll });
    // wrong roll number
    if (admin == null) throw new Error("wrong roll id");
    const match = await bcrypt.compare(pass, admin.password);
    if (match) {
      const token = await jwt.sign(
        { name: admin.name, email: admin.email, id: admin.id },
        process.env.SECRET_KEY
      );
      res.cookie("token_admin", token).redirect("/admin/create/notice");
    } else throw new Error("wrong password");
  } catch (err) {
    res.send(err.message);
  }
};
exports.getRegister = (req, res) => {
  res.render("register-admin");
};
exports.getCreateNotice = (req, res) => {
  res.render('create-admin-notice')
};
exports.postCreateNotice = async (req, res) => {
  var {course,title,content,rolls,course ,branch,year} = req.body;
  var targets = [];
  try {
    if(typeof course === 'string'){
      targets=[{course,branch,year}]
    }
    else{
      for (let i = 0; i < course.length; i++) {
        targets.push({course:course[i],branch:branch[i],year:year[i]})
        
      }
      rolls = rolls.split(' ')

    }
    var notice = new Notice({
      title,
      content,
      createdBy:req.admin.id,
      targets,
      rolls
    })
    await notice.save();
    res.redirect(`/admin/notice/${notice._id}`)
    
  } catch (err) {
    res.render('login-admin',{notLogged:true})
  }
};
exports.postRegister = async (req, res) => {
  const { email, name, roll, course, branch, pass, cpass, year, adminPass } =
    req.body;
    console.log(req.body);
  try {
    // const match = await bcrypt.compare(adminPass, process.env.ADMIN_PASS);
    // if (!match) return res.send("admin password not matched");
    console.log('admin password matched');
    const hash = await bcrypt.hash(pass, 10);
    const admin = new Admin({
      email,
      name,
      roll,
      password: hash
    });
    await admin.save();
    res.render("login-admin", { success: true });
  } catch (err) {
    res.send(err);
  }
};
exports.getNotice = async (req, res) => {
  try {
    const notice =await Notice.findOne({});
    console.log(notice);
    res.send(notice)

  } catch (err) {
    console.log(err.message);
    res.send(err.message)
  }
  
};
exports.logout = (req,res)=>{
  try {
    res.clearCookie("token_admin").redirect('/admin/login')
  } catch (err) {
    res.redirect('/admin/login')
  }
}
