const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

const { getTaskList } = require('./modules/getRequests')

const { 
  addTask, 
  removeTask, 
  resetApp, 
  switchCompletionState,
  switchPinningState,
  removeCompletedTasks,
  removeSelectedTasks,
  removeAllTasks
} = require('./modules/postRequests')

app.use(cors())
app.use(bodyParser.json())

app.listen(3000, () => {
  console.log('Server started on 3000 port!')
})

app.get('/taskList', (req, res) => getTaskList(res))

app.post('/addTask', (req, res) => addTask(req, res))

app.post('/removeTask', (req, res) => removeTask(req, res))

app.post('/ResetTODOApp', (req, res) => resetApp(req, res))

app.post('/toggleCompletion', (req, res) => switchCompletionState(req, res))

app.post('/togglePin', (req, res) => switchPinningState(req, res))

app.post('/removeCompletedTasks', (req, res) => removeCompletedTasks(res))

app.post('/removeSelectedTasks', (req, res) => removeSelectedTasks(req, res))

app.post('/removeAllTasks', (req, res) => removeAllTasks(res))