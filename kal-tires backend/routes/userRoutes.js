const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")


const VerifyFirebaseToken = require("../middleware/firebaseVerifyToken")

router.route('/')
    .get(VerifyFirebaseToken, userController.getAllUsers)
    .post(VerifyFirebaseToken, userController.createNewUser)
    .patch(VerifyFirebaseToken, userController.updateUser)
    .delete(VerifyFirebaseToken, userController.deleteUser)


    module.exports = router