'use strict'

import {
    validateJwt
} from '../middleware/validate-jwt.js'

import express from 'express'


import {
    addCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from './category.controller.js'

const api = express.Router()


api.post('/addCategory', [validateJwt], addCategory)
api.delete('/deleteCategory/:id',[validateJwt], deleteCategory)
api.get('/getCategories', [validateJwt], getCategories)
api.put('/updateCategory/:id', [validateJwt], updateCategory)

export default api

