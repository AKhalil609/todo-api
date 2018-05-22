const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = "5b02f092a9bfd720d0ac15f8";

if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}else{
    User.findById(id).then((user)=>{
        console.log(user);
        
    }).catch((e)=>{
        console.log(e);
        
    });
}
