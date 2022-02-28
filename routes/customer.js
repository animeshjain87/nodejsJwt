var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const customer = require('../model/customer');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/* GET customer listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a new customer');
});

//JWT example signup
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            const Newcustomer = new customer({
                _id: new mongoose.Types.ObjectId,
                userName: req.body.userName,
                lastName: req.body.lastName,
                password: hash,
                age: req.body.age,
                city: req.body.city
            });
            Newcustomer.save()
                .then(result => {
                    res.status(200).json({
                        new_customer: result
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })
});

//JWT example Login
router.post('/login', async (req, res, next) => {
    customer.find({ userName: req.body.userName })
        .exec()
        .then(Newcustomer => {
            if (Newcustomer.length < 1) {
                return res.status(401).json({
                    msg: "User Not found"
                })
            }
            bcrypt.compare(req.body.password, Newcustomer[0].password, (err, result) => {
                if (!result) {
                    return res.status(401).json({
                        msg: "password not match"
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        userName: Newcustomer[0].userName,
                        lastName: Newcustomer[0].lastName,
                    },
                        'This is secret key',
                        {
                            expiresIn: "24h"
                        }
                    );
                    res.status(200).json({
                        userName: Newcustomer[0].userName,
                        password: Newcustomer[0].password,
                        token: token
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                errormsg: err
            })
        })
});

module.exports = router;
