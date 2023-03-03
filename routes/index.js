const express = require('express');
const router = express.Router();

// all contollers are in external file
const  { 
  authUser,
  filterNotJson,
  checkLenghtLimit,
  getAllToDo,
  createNewToDo,
  deleteToDoById,
  updateToDo,
  createUser,
  verifyUserJWT
} = require('../controllers/index.js')

// creates new user
router.post("/register", filterNotJson, createUser);

// login and auth token generator
router.post("/login", filterNotJson, verifyUserJWT);

// returns all ToDo from mongo db
router.get('/todo', filterNotJson, authUser, getAllToDo);

// create new ToDo in db
router.post("/todo/", filterNotJson, authUser, checkLenghtLimit, createNewToDo);

// delete ToDo by id
router.delete("/todo/:id", filterNotJson, authUser, deleteToDoById);

// modify ToDo by id
router.put("/todo", filterNotJson, authUser, updateToDo);

module.exports = router;