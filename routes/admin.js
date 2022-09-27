const router = require("express").Router();
const adminController = require("../controllers/admin");

router
  .get("/create/notice",adminController.auth,adminController.getCreateNotice)
  .post("/create/notice",adminController.auth,adminController.postCreateNotice)
  .get("/login", adminController.getLogin)
  .post("/login", adminController.postLogin)
  .post("/register", adminController.postRegister)
  .get("/register", adminController.getRegister)
  .get("/notice/:id",adminController.auth,adminController.getNotice)
  .get('/logout',adminController.logout)

module.exports = router;