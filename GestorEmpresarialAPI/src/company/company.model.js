'use strict'

import {Schema, model} from 'mongoose'

const companySchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    impactLevel: {
        type: Number,
        required: true/* ,
        set: function(value) {
            return value + '%';
        } */
    },
    yearsInBussiness: {
        type: Number,
        required: true
    },
    bussinessCategory: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }

})   

export default model('company', companySchema)