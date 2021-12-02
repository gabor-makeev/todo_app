const fs = require('fs')

const { settings, taskList } = require('./todo')

function updateTaskListFile(newTaskList, responseCallBack) {
  return fs.writeFile('./database/taskList.json', newTaskList, (err) => {
    responseCallBack.send(err ? '{ "result": 0 }' : '{ "result": 1 }')
  })
}

function addTask(req, res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))

      const setup = new settings()
      setup.reassignIndex()

      list.add(req.body, setup.getSetup().index)

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function removeTask(req, res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.remove(req.body)

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function resetApp(req, res) {
  const setup = new settings()

  setup.resetIndex()

  updateTaskListFile(JSON.stringify([]), res)
}

function switchCompletionState(req, res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))
      list.switchCompletionState(req.body)

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function switchPinningState(req, res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))
      list.switchPinState(req.body)

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function removeCompletedTasks(res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))
      list.removeCompletedTasks()

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function removeSelectedTasks(req, res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))
      list.removeSelectedTasks(req.body)

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

function removeAllTasks(res) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))
      list.removeAllTasks()

      updateTaskListFile(JSON.stringify(list.content), res)
    }
  })
}

module.exports = { 
  addTask, 
  removeTask,
  resetApp,
  switchCompletionState,
  switchPinningState,
  removeCompletedTasks,
  removeSelectedTasks,
  removeAllTasks
}