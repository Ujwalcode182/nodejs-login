const express = require("express");
const router = express.Router()
const {getLogin,postLogin,getRegister,postRegister,getDashboard, isAuthMiddleware, postLogout} = require('../controller/controllers.js')


router.get('/',getLogin)
router.post('/login',postLogin)
router.get('/register',getRegister)
router.post('/register',postRegister)
router.get('/dashboard',isAuthMiddleware,getDashboard)
router.post('/logout', postLogout)

module.exports = router