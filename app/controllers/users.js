'use static';

var Users = require('../models/users')

/**
* create user if this user not be created
* @param {Object} user user's data
*
* @return {Promise}
*/
function createUser (user) {
  return new Promise((resolve, reject) => {
    if (!user || !user.telephone || !user.password) {
      reject({
        code: 422,
        message: 'user\'s telephone & password is necessary'
      })
    }
    Users
      .findOne({'telephone': user.telephone}, {'_id': false})
      .exec(function (err, result) {
        if (err) reject(err)

        if (result) {
          reject({
            code: 403,
            message: 'this user is already exist'
          })
        } else {
          var newUser = new Users()
          newUser.telephone = user.telephone
          newUser.password = user.password
          newUser.save()
          resolve(result)
        }
      })
  })
}

/**
* use telephone number to get user's data
* @param {Object} user user's data
*
* @return {Promise}
*/

function getUser (telephone) {
  return new Promise((resolve, reject) => {
    if (!telephone) {
      reject({
        code: 422,
        message: `telephone cound not be null`
      })
    }
    Users
      .findOne({telephone: telephone}, {'_id': false, 'telephone': true, 'usable_credit': true, 'total_credit': true, 'rank': 'true', 'created': true, 'address': true})
      .exec(function (err, result) {
        if (err) {
          reject({
            code: 500,
            message: err
          })
        }

        if (result) {
          resolve(result)
        } else {
          reject({
            code: 403,
            message: 'this user isn\'s exist'
          })
        }
      }
    )
  })
}

exports.createUser = createUser
exports.getUser = getUser
