const express = require('express');
const router = express.Router();
const User = require("../models/User")
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = "MynameISAbdulazizImfromMurshidabad";
router.post("/createuser",
    [
        body('email').isEmail(),
        body('name').isLength({ min: 4 }),
        body('password','Incorrect Password').isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        let userExist = await User.findOne({ email});
        if(userExist){
            return res.status(400).json({ errors: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password,salt)
        try {
            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPassword
            })
            res.json({ success: true })
        }
        catch (err) {
            res.json({ success: false })
        }
    })

router.post("/loginuser",
    [
        body('email').isEmail(),
        body('password','Incorrect Password').isLength({ min: 8 })
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: "User not found" })
            }
            const passwordMatch = await bcrypt.compare(req.body.password, userData.password)
            if (!passwordMatch) {
                return res.status(400).json({ errors: "Wrong password" })
            }
            const data={
                user:{
                    id:userData.id,
                }
            }
            const userName = userData.name;
            const authToken = jwt.sign(data,jwtSecret)
            return res.json({ success: true,authToken,userName})
        }
        catch (err) {
            console.log(err);
        }
    })
    
module.exports = router;