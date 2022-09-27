const router = require("express").Router();
const studentController = require("../controllers/students");

router
  .get("/home",studentController.auth,studentController.getDashboard)
  .get("/login", studentController.getLogin)
  .post("/login", studentController.postLogin)
  .post("/register", studentController.postRegister)
  .get("/register", studentController.getRegister)
  .get("/notice/:id",studentController.auth,studentController.getNotice)
  .get("/logout",studentController.logout)

module.exports = router;
