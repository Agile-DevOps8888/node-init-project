/**
 * Auth service file
 * 
 * @package   backend/src/services
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var authModel = require('../models/auth-model')
var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
var timer  = require('../constants/timer')

var authService = {
  login: login,
  loginForAdmin: loginForAdmin,
}


/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function login(authData) {
  return new Promise((resolve, reject) => {
    authModel.login(authData).then((data) => {
      if (data) {
        let userId = data.id
        let token = jwt.sign({ uid: userId, landing: true }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token, 'url': data.url } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}


/**
 * Function that check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  json 
 */
function loginForAdmin(authData) {
  return new Promise((resolve, reject) => {
    authModel.loginForAdmin(authData).then((data) => {
      if (data) {
        let token = jwt.sign({ admin: true, uid: data.uid }, key.JWT_SECRET_KEY, {
          expiresIn: timer.TOKEN_EXPIRATION
        })
        
        resolve({ code: code.OK, message: '', data: { 'token': token } })
      }
    }).catch((err) => {
      if (err.message === message.INTERNAL_SERVER_ERROR)
        reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
      else
        reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
    })
  })
}


module.exports = authService
