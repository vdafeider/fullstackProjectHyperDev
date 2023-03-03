const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema for user accounts
const UserSchema = new Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
    mail: { type: String, required: true }
});

// Schema for todo documents
const ToDoSchema = new Schema({
    toDo: { type: String, required: true},
});

const User = mongoose.model("UserData", UserSchema);
const ToDo = mongoose.model("ToDo", ToDoSchema);
module.exports = { User, ToDo };