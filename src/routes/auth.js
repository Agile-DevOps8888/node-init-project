/**
 * Auth router file
 * 
 * @package   backend/src/routes
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var authService = require('../services/auth-service')

/** 
 * Login api
 */
router.post('/login', login);


/** 
 * Admin Login api
 */
router.post('/admin/login', loginForAdmin);

/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function login(req, res) {
  let email = req.body.email
  let password = req.body.password
  let fromWhere = req.body.fromWhere 
  
  console.log("log", email, password, fromWhere);
  console.log("log", req.json);
  var authData = {
    email: email,
    password: password,
    fromWhere: fromWhere
  }

  authService.login(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

/**
 * Function that check admin user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object req
 * @param   object res
 * @return  json 
 */
function loginForAdmin(req, res) {
  let userId = req.body.userId
  let password = req.body.password
  
  var authData = {
    userId: userId,
    password: password
  }

  console.log("loginForAdmin", req.body.userId, req.body.password);

  authService.loginForAdmin(authData).then((result) => {
    res.json(result)
  }).catch((err) => {
    res.json(err)
  })
}

module.exports = router
