'use strict'

import Admin from './admin.model.js'
import jwt from 'jsonwebtoken'

import { generateJwt } from '../utils/jwt.js'
import {
    encrypt,
    checkPassword,
    checkUpdate
} from '../utils/validator.js'

//Testing
export const test = async (req, res) => {
    return res.send('Hello World')
}

export const register = async (req, res) => {
    try {
        //Information of the admin
        let data = req.body
        //Encrypting the password
        data.password = await encrypt(data.password)
        //Rol by defect ADMIN
        data.rol = 'ADMIN'
        //Creating the admin
        const admin = new Admin(data)
        //Saving the admin
        await admin.save()
        //Returning the admin
        return res.status(201).send({ message: 'Admin created successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering the admin.' })
    }
}

export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find()
        return res.status(200).send(admins)
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the admins.' })

    }
}

//LOGIN
export const login = async (req, res) => {
    try {
        //Capturing the information
        let { username, email, password } = req.body
        //Checking that the admin has send the username or the email
        if (!username && !email) return res.status(400).send({ message: 'We need your username or email to login.' })

        let admin = await Admin.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        if (!admin) return res.status(404).send({ message: 'Admin not found' })
        //Checking the password
        if (admin && await checkPassword(password, admin.password)) {
            let loggedAdmin = {
                uid: admin._id,
                username: admin.username,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
            //Generate the token
            let token = await generateJwt(loggedAdmin)
            //Respond (dar acceso)
            return res.send(
                {
                    message: `Welcome ${admin.name}`,
                    loggedAdmin,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error logging in.' })
    }
}


export const updateAdmin = async (req, res) => {
    try {
        //Getting id
        let { id } = req.params
        //Getting the id by the token
        let { _id } = req.admin
        //Getting the data
        let data = req.body
        //Validating that only the user can update himself.
        if (id != _id) return res.status(401).send({ message: 'You do not have permission to update another user.' })


        let update = checkUpdate(data, _id)

        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })

        //Updating the user
        let udpatedAdmin = await Admin.updateOne(
            { _id: _id },
            data,
            { new: true }
        )

        //Validation of the updated action
        if (!udpatedAdmin) return res.status(404).send({ message: 'Admin not found' })

        return res.status(200).send({ message: 'Admin updated successfully.' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating the admin.' })
    }
}

export const deleteAdmin = async (req, res) => {
    try {
        //Getting the id of the admin
        let { id } = req.params
        //Getting the id by the token
        let { _id } = req.admin
        //Validating that only the admin can delete himself.
        if (id != _id) return res.status(401).send({ message: 'You do not have permission to delete another admin.' })
        //Finding and deleting the admin

        let deletedAdmin = await Admin.deleteOne({ _id: _id })
        //Validation of the deleted action
        if (!deletedAdmin) return res.status(404).send({ message: 'Admin not found' })
        //Replying
        return res.status(200).send({ message: 'Admin deleted successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting the admin.' })
    }
}