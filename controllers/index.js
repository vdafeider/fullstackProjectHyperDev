const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const jwt = require('jsonwebtoken')

// file with secret-key for JWT
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname,  '../secr.env') });
const secretKey = process.env.jwtSecret

// Models are in external file
const { User, ToDo } = require("../models/index.js");

// Middelware to validate user by token (access to users with the name that ends @gmail.com)
const authUser = (req, res, next) => {
    const token = req.headers.token
    if (token){
        const decoded = jwt.verify(token, secretKey)
        decoded.name.includes('@gmail.com') ? next() : res.status(403).send({ 'err': 'No permit to this page' })
    } else {
        res.status(400).send({ 'err': 'No authorisation token was attached in the head of the request' })
    }
}

// Middelware to filter only JSON content type
const filterNotJson = (req, res, next) => {
    if (req.get('Content-Type')!=='application/json') {
        res.status(400).send({'err': 'Only JSON content type requests are allowed'});
    } else {
         next();
    }
}

// Middelware that checks new toDo lenght limit
const checkLenghtLimit = ((req, res, next) => {
    if (req.query.todo.length<141){
        next()
    } else {
        res.status(400).send({'err': 'Failed to upload. To do string is too long, up to 140 characters are allowed.'});
    }
})

// Controller that returns the list of all toDo from db
const getAllToDo = (async(req, res) => {
    const allToDo = await ToDo.find({});
    res.status(200).json(allToDo);
});

// Controller that checks new toDo lenght limit and if acceptable saves to the db
const createNewToDo= (async(req, res) => {
        const newToDo = new ToDo({
            toDo: req.query.todo
        });
        const insertedToDo = await newToDo.save();
        res.status(201).json(insertedToDo);
})

// Controller that updates toDo by id
const updateToDo = (async(req, res) => {
    const id = req.query.id;
    const updatedToDo = await ToDo.findByIdAndUpdate(id, {
        toDo: req.query.todo
    })
    res.status(200).json(updatedToDo)
})

// Controller that deletes toDo from the db by id
const deleteToDoById = (async (req, res) => {
    const { id } = req.params;
    const deletedToDo = await ToDo.findByIdAndDelete(id);
    res.status(200).json(deletedToDo);
})

// Checks whether email is already registered and if no, creates new User info in db
const createUser= (async(req, res) => {
    const newUser = new User({
      name: req.body.name,
      pass: req.body.password,
      mail: req.body.mail,
    });
    let checkIfAlreadyRegistered = await User.exists({mail: req.body.mail});
    if (!checkIfAlreadyRegistered) {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } else {
        res.send({'err':'Current email is already registered'});
    }
});

// Login data validator and token generator
const verifyUserJWT = async (req, res) => {
    const mail = req.body.mail
    const pwd = req.body.password
    let checkIfExist = await User.exists({mail: mail});
    if (checkIfExist){
        let userInfo = await User.find({mail: mail});
        if (userInfo[0].pass==pwd){
            const payload = {
                'name': userInfo[0].name,
                'mail': userInfo[0].mail
            }
            const token = jwt.sign(JSON.stringify(payload), secretKey, { algorithm: 'HS256' })
            res.send({ 'token': token })
        } else {
            res.send({ 'err' : 'Wrong mail and password set'})
        }
    } else {
        res.send({ 'err' : 'User with such email is not registered'})
    }
};

module.exports = {
    authUser,
    filterNotJson,
    checkLenghtLimit,
    getAllToDo,
    createNewToDo,
    deleteToDoById,
    updateToDo,
    createUser,
    verifyUserJWT
}