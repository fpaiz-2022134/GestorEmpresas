'use strict'

import jwt from 'jsonwebtoken'
import Admin from '../admin/admin.model.js'

export const validateJwt = async(req, res, next)=>{
    try{
        //Getting the key access
        let secretKey = process.env.SECRET_KEY
        //Getting the token of the headers
        let { token } = req.headers
        //Verifying the token
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        //Getting the sent id
        let { uid } = jwt.verify(token, secretKey)
        //Checking if the user still exists in the DB
        let admin = await Admin.findOne({_id: uid})
        if(!admin) return res.status(404).send({message: 'User not found - Unauthorized'})
        //Ok of Middleware
        req.admin = admin
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid token or expired'})
    }
}