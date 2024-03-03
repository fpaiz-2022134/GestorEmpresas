'use strict'

import express from 'express'

import {
    deleteAdmin,
    getAdmins,
    login,
    register,
    test,
    updateAdmin
}from './admin.controller.js'

import { validateJwt } from '../middleware/validate-jwt.js'

const api = express.Router()

api.get('/test', test)
api.post('/register',register )
api.post('/login', login)
api.get('/getAdmins',[validateJwt], getAdmins)
api.put('/updateAdmin/:id', [validateJwt], updateAdmin)
api.delete('/deleteAdmin/:id', [validateJwt], deleteAdmin)

export default api