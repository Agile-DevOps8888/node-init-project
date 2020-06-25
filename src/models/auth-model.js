/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    DongTuring <dong@turing.com>
 * @copyright 2018 Turing Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../database/database');
var message  = require('../constants/message');
var table  = require('../constants/table');
var bcrypt = require('bcrypt-nodejs');

var authModel = {
  login: login,
  loginForAdmin: loginForAdmin,
}


/**
 * Check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function login(authData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.USER_LIST + ' WHERE email = ? '

    db.query(query, [ authData.email ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
        console.log("db query error!!");
      } else {
        if (rows.length > 0) {
          bcrypt.compare(authData.password, rows[0].password, function(error, result) {
            if (error) {
              reject({ message: message.INVALID_PASSWORD })
            } else {
              if (result) {
                let extraData = { fromWhere: authData.fromWhere }
                visitModel.checkVisitSessionWithExtraInfo(db, rows[0].id, false, false, true, extraData).then((result) =>{
                  // Get uncompleted page url
                  authModel.checkUncompletedPage(rows[0].id).then((url)=>{
                    resolve({ id:rows[0].id, url:url})  
                  }).catch((err) => {
                    reject(err)
                  })  
                })
              } else {
                reject({ message: message.INVALID_PASSWORD })
              }
            }                
          })
        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

/**
 * Check user login status with email and password
 *
 * @author  DongTuring <dong@turing.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function loginForAdmin(authData) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM ' + table.ADMIN_LIST + ' WHERE user_id = ? '

    console.log("query=", query, authData.userId);
    //let password = bcrypt.hashSync(authData.password);
    let password = authData.password;
    console.log("password=", password);

    db.query(query, [ authData.userId ], (error, rows, fields) => {
      if (error) {
        reject({ message: message.INTERNAL_SERVER_ERROR })
        console.log("db query error!!");
      } else {
        console.log("db query success!!");
        if (rows.length > 0) 
         {
          // bcrypt.compare(authData.password, rows[0].password, function(error, result) {
          //   if (error) {
          //     reject({ message: message.INVALID_PASSWORD })
          //   } else {
          //     if (result) {
          //       resolve({uid: rows[0].id})          
          //     } else {
          //       reject({ message: message.INVALID_PASSWORD })
          //     }
          //   }                
          // })
          if ((rows[0].password === password)) {
            console.log("rows[0].password!!", rows[0].password);
            resolve({uid: rows[0].id});     
          } else {
            console.log("non equeal", rows[0].password);
            reject({ message: message.INVALID_PASSWORD });
          }

        } else {
          reject({ message: message.ACCOUNT_NOT_EXIST })
        }
      }
    })
  })
}

module.exports = authModel
