const express = require("express")
const router = express.Router()
const adminController = require ("../controllers/adminController")

const VerifyFirebaseToken = require("../middleware/firebaseVerifyToken")


router.route('/')
    .get(VerifyFirebaseToken, adminController.getAllAdmins)
    .post(VerifyFirebaseToken, adminController.createNewAdmin)
    .patch(VerifyFirebaseToken, adminController.updateAdmin)
    .delete(VerifyFirebaseToken, adminController.deleteAdmin)


module.exports = router