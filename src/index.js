const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).send({error: 'User do not exist'});
  }

  request.user = user;

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const id = uuidv4()

  const userExists = users.some(user => user.username === username)

  if(userExists) {
    return response.status(400).send({error: 'User already exists'})
  }

  const newUser = {
    id: id,
    name: name,
    username: username,
    todos: []
  }

  users.push(newUser)

  return response.status(201).json(newUser)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  const todos = user.todos

  return response.json(todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request

  const task_id = uuidv4()

  const { todos } = user

  const task = {
    id: task_id,
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  todos.push(task)

  return response.status(201).json(task)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const { user } = request

  const { id } = request.params

  const task = user.todos.find(task => task.id === id)

  if (!task){
    return response.status(404).send({error: 'Task not found'})
  }

  task.title = title
  task.deadline = new Date(deadline)

  return response.status(201).json(task)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  const { id } = request.params

  const task = user.todos.find(task => task.id === id)

  if (!task){
    return response.status(404).send({error: 'Task not found'})
  }

  task.done = true

  return response.status(201).json(task)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  const { id } = request.params

  const task = user.todos.find(task => task.id === id)

  if (!task){
    return response.status(404).send({error: 'Task not found'})
  }

  user.todos.splice(task,1)

  return response.status(204).send()

});

module.exports = app;