'use strict'

import Category from './category.model.js'
import Company from '../company/company.model.js'

import { checkUpdate } from '../utils/validator.js' 

export const addCategory = async (req, res) => {
    try {
        //Getting the information
        let data = req.body

        //Creating the category
        let category = await Category(data)
        //Saving the category
        category = await category.save()
        //Replying
        return res.status(200).send({message: 'Your category has been created.'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating the category' })
    }
}

export const getCategories= async(req,res)=>{
    let categories = await Category.find()

    return res.send(categories)
}

export const updateCategory = async(req, res)=>{
    try {
        //Getting the id of the category
        let {id} = req.params
        //Getting the data
        let data = req.body

        //Searching the category by id
        let category = await Category.findOne({_id: id})
        if (!category) return res.status(404).send({message: 'Category not found'})
        //Checking the update
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })

        //Updating the comment
        let updatedCategory = await Category.updateOne(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCategory) return res.status(404).send({message: 'Category has not been updated.'})
        //Replying
        return res.status(200).send({message: 'Category updated successfully.'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the comment' })
    }
}


export const deleteCategory = async(req, res)=>{
    try{
        //Getting id
        let {id} = req.params
        //Finding the companies by the category
        let companies = await Company.find({category: id})
        console.log(companies)
        for(let company of companies){
            if(company.businessCategory._id == id) return res.status(400).send({message: 'You cannot delete this category because it has companies.'})
        }

        let deletedCategory = await Category.findByIdAndDelete({_id: id})
        //Validation
        if(!deletedCategory) return res.status(404).send({message: 'The category is not found'})
        //Replying
        return res.status(200).send({message: 'The category has been deleted successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Category has not been deleted'})
    }
}