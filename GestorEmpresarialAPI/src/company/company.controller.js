'use strict'

import Company from './company.model.js'

import { checkUpdate } from '../utils/validator.js'
import companyModel from './company.model.js'

export const addCompany = async(req, res)=>{
    try {
        //Getting the data
        let data = req.body
        //Creating the company
        let company = await Company(data)
        //Saving the company
        await company.save()
        return res.status(200).send({message: 'Company added successfully.'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error adding the company or client.'})
        
    }
}

//Getting all the categories

export const getAllCompanies = async(req, res)=>{
    try {
        let companies = await Company.find()
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the companies.'})
    }
}


//Filtering by the years in the business
//In this method we order the years of trajectory from shortest to longest

export const companiesByYears = async(req, res)=>{
    try {
        //Here we get all the companies and then with the sort method we can order it.
        let companiesYears = await Company.find().sort({yearsInBussiness: 1})
        return res.status(200).send(companiesYears)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the companies.'})
    }
}

//Filtering by the category that you want to see
export const companiesByCategory = async(req, res)=>{
    try {
        //Getting the category
        let data = req.body
        //Searching by the category
        let companiesCategory = await Company.find({bussinessCategory: data.bussinessCategory})
        return res.status(200).send(companiesCategory)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the companies.'})
    }
}

//Filtering A-Z companies
export const companiesAZ = async(req, res) =>{
    try {
        //Getting the companies in order
        let companies = await Company.find().sort({name: 1})
        //Replying
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the companies.'})   
    }
}

//Filtering Z-A companies
export const companiesZA = async(req, res) =>{
    try {
        //Getting the companies in order
        let companies = await Company.find().sort({name: -1})
        //Replying
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the companies.'})   
    }
}

//Updating the company

export const updateCompany = async(req, res)=>{
    try {
        //Getting data
        let data = req.body
        //Getting the id
        let {id} = req.params
        //Finding the companie
        let company = await Company.findById(id)
        //Checking if the company exists
        if (!company) {
            return res.status(404).send({message: 'Company not found.'})
        }
        //Checking if the data is valid
        let update = checkUpdate(data, id)
        //Validating
        if(!update) return res.status(400).send({message:'Have submitted some data that cannot be update or missing'})
        //Updating the company
        let updatedCompany = await Company.updateOne(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCompany) return res.status(400).send({message: 'Company has not been updated'})
        return res.status(200).send({message: 'The company has been updated.'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the company.'})
    }
}


