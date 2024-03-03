'use strict'

import Company from './company.model.js'

import { checkUpdate } from '../utils/validator.js'
import Category from '../category/category.model.js'


export const addCompany = async (req, res) => {
    try {
        //Getting the data
        let data = req.body
        //Creating the company
        let company = await Company(data)
        //Saving the company
        await company.save()
        return res.status(200).send({ message: 'Company added successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error adding the company or client.' })

    }
}

//Getting all the categories

export const getAllCompanies = async (req, res) => {
    try {
        let companies = await Company.find()
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the companies.' })
    }
}


//Filtering by the years in the business
//In this method we order the years of trajectory from shortest to longest

export const companiesByYears = async (req, res) => {
    try {
        //Here we get all the companies and then with the sort method we can order it.
        let companiesYears = await Company.find().sort({ yearsInBussiness: 1 })
        return res.status(200).send(companiesYears)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the companies.' })
    }
}

//Filtering by the category that you want to see
export const companiesByCategory = async (req, res) => {
    try {
        //Getting the category
        let data = req.body
        //Searching by the category
        let companiesCategory = await Company.find({ bussinessCategory: data.bussinessCategory })
        return res.status(200).send(companiesCategory)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the companies.' })
    }
}

//Filtering A-Z companies
export const companiesAZ = async (req, res) => {
    try {
        //Getting the companies in order
        let companies = await Company.find().sort({ name: 1 })
        //Replying
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the companies.' })
    }
}

//Filtering Z-A companies
export const companiesZA = async (req, res) => {
    try {
        //Getting the companies in order
        let companies = await Company.find().sort({ name: -1 })
        //Replying
        return res.status(200).send(companies)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the companies.' })
    }
}

//Updating the company

export const updateCompany = async (req, res) => {
    try {
        //Getting data
        let data = req.body
        //Getting the id
        let { id } = req.params
        //Finding the companie
        let company = await Company.findById(id)
        //Checking if the company exists
        if (!company) {
            return res.status(404).send({ message: 'Company not found.' })
        }
        //Checking if the data is valid
        let update = checkUpdate(data, id)
        //Validating
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })
        //Updating the company
        let updatedCompany = await Company.updateOne(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedCompany) return res.status(400).send({ message: 'Company has not been updated' })
        return res.status(200).send({ message: 'The company has been updated.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the company.' })
    }
}

import xl from 'excel4node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createExcel = async(req, res) => {
    try {
        
        //Creating work book
        let wb = new xl.Workbook()

        //Page to work
        let ws = wb.addWorksheet('Companies Interfer')

        //Getting all the companies
        let companies = await Company.find()


        // Creating a style
        let style = wb.createStyle({
            font: {
                color: '#172732',
                size: 13,
                bold: true
            }
        })

        let title = wb.createStyle({
            font: {
              bold: true,
              color: '#FFFFFF',
              size: 12
            },
            fill: {
              type: 'pattern',
              patternType: 'solid',
              fgColor: {
                rgb: 'rgb(45, 149, 150)'
              }
            }
          });
        //Creating the columns
        ws.cell(1, 1).string("Name").style(title)
        ws.cell(1, 2).string("Address").style(title)
        ws.cell(1, 3).string("Phone").style(title)
        ws.cell(1, 4).string("Email").style(title)
        ws.cell(1, 5).string("Impact Level").style(title)
        ws.cell(1, 6).string("Years In Bussiness").style(title)
        ws.cell(1, 7).string("Bussiness Category").style(title)

        // Loop through companies and populate rows

        companies.forEach(async (company, index) => {
            
            ws.cell(index + 2, 1).string(company.name).style(style)
            ws.cell(index + 2, 2).string(company.address).style(style)
            ws.cell(index + 2, 3).string(company.phone).style(style)
            ws.cell(index + 2, 4).string(company.email).style(style)
            ws.cell(index + 2, 5).string(company.impactLevel ? company.impactLevel.toString() : '' ).style(style) 
            ws.cell(index + 2, 6).string(company.yearsInBussiness ? company.yearsInBussiness.toString() : '').style(style)
            ws.cell(index + 2, 7).string(JSON.stringify(company.bussinessCategory)).style(style) 
             /* let category = await Category.find({_id: company.bussinessCategory});
            console.log(category)
            ws.cell(index + 2, 7).string(category.title).style(style)   */
          });

       /* companies.forEach((company, index) => {
            ws.cell(index + 2, 1).string(company.name).style(style)
            ws.cell(index + 2, 2).string(company.address).style(style)
            ws.cell(index + 2, 3).string(company.phone).style(style)
            ws.cell(index + 2, 4).string(company.email).style(style)
            ws.cell(index + 2, 5).string(company.impactLevel ? company.impactLevel.toString() : '' ).style(style) 
            ws.cell(index + 2, 6).string(company.yearsInBussiness ? company.yearsInBussiness.toString() : '').style(style)
            ws.cell(index + 2, 7).string(JSON.stringify(company.bussinessCategory)).style(style)
             ws.cell(index + 2, 7).string(JSON.stringify(company.bussinessCategory)).style(style) 
        });*/

        /*  for (let i = 2; i < companies.length; i++) {
            let category = await Category.findById(companies.bussinessCategory)
            let nameCategory = category.title
            ws.cell(i, 7).string(nameCategory).style(style)
            
        }  */


        /* companies.forEach((company, index) => {
            ws.cell(index + 2, 1).string(company.name).style(style)
            ws.cell(index + 2, 2).string(company.address).style(style)
            ws.cell(index + 2, 3).string(company.phone).style(style)
            ws.cell(index + 2, 4).string(company.email).style(style)
            ws.cell(index + 2, 5).string(company.impactLevel).style(style)
            ws.cell(index + 2, 6).string(company.yearsInBussiness).style(style)
            ws.cell(index + 2, 7).string(company.bussinessCategory).style(style)
        })
 */

        ws.column(1).setWidth(30)
        ws.column(2).setWidth(30)
        ws.column(3).setWidth(30)
        ws.column(4).setWidth(30)
        ws.column(5).setWidth(30)
        ws.column(6).setWidth(30)
        ws.column(7).setWidth(30)


        console.log(" ¡ Excel Generado !")

        const pathExcel = path.join(__dirname, 'excel', 'Companies_Interfer.xlsx')

        wb.write(pathExcel, function (err, stats) {
            if (err) {
                console.error(err)
            } else {
                function downloadFile() {
                    res.download(pathExcel)
                }
                downloadFile()
                return false
            }

        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error creating the report' })
    }

}


