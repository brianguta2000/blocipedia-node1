const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
validation = require("./validation");

router.get("/users/sign_up", userController.signUp);

router.post("/users", validation.validateUsers, userController.create);

router.get("/users/sign_in", userController.signInForm);

router.post("/users/sign_in", validation.validateSignIn, userController.signIn);

router.get("/users/sign_out", userController.signOut);

router.post("/users/upgradeCharge", userController.upgradeCharge);

router.get("/users/upgradeForm", userController.upgradeForm);

router.post("/users/upgradeUser", userController.upgradeUser);

router.get("/users/downgradeForm", userController.downgradeForm);

router.post("/users/downgradeUser", userController.downgradeUser);

module.exports = router;