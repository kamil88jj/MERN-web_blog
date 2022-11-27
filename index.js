import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation }  from './validations/auth.js'


import UserModel from './models/User.js'


mongoose
    .connect
            (
            'mongodb+srv://admin:qqqqqq@cluster0.wqamm5o.mongodb.net/?retryWrites=true&w=majority'
            )
    .then(() => console.log('DB Ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());


app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash,
    });


    const user = await doc.save()

    res.json({
        success: true,
    });
});




app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server Ok')
})