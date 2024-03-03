'use strict'

import express from 'express'

import {
    validateJwt
} from '../middleware/validate-jwt.js'

import {
    addCompany,
    companiesAZ,
    companiesByCategory,
    companiesByYears,
    companiesZA,
    createExcel,
    getAllCompanies,
    updateCompany
} from './company.controller.js'

const api = express.Router()

api.post('/addCompany', [validateJwt], addCompany)
api.get('/getAllCompanies', [validateJwt], getAllCompanies)
api.get('/companiesByYears', [validateJwt], companiesByYears)
api.get('/companiesByCategory', [validateJwt], companiesByCategory)
api.get('/companiesAZ', [validateJwt], companiesAZ)
api.get('/companiesZA', [validateJwt], companiesZA)
api.put('/updateCompany/:id', [validateJwt], updateCompany)
api.get('/createExcel', [validateJwt], createExcel)
export default api