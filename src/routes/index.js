const express = require('express')
const router = express.Router()

const apiAuthRouter = require('./auth')

/**
 * Authentication page API router
 */
router.use('/', apiAuthRouter)

console.log("apiAuthRouter");

module.exports = router