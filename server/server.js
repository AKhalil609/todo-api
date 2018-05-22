const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todo', (req, res)=>{
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }),(e) =>{
        res.status(400).send(e);
    }
});

app.get('/todo/:id',(req, res) =>{
    var id=req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            res.send({todo});

        }).catch((e) => {
            res.status(404).send();
        });
    }
})

app.get('/todo', (req, res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    }, (e)=>{
        res.status(400).send(e);
    })
})

app.delete('/todo/:id', (req, res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send();
        }
        
        res.send(todo);
        
    }).catch((e)=>{
        res.status(400).send();
    });
    
});

app.patch('/todo/:id', (req, res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo)=>{
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
})

app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
    
});

module.exports = {app};