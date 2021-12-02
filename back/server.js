const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

const { settings, taskList } = require('./todo');

app.use(cors())
app.use(bodyParser.json())

app.listen(3000, () => {
console.log('Server started on 3000 port!')
})

app.get('/taskList', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    res.send(data)
  })
})

app.post('/addTask', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      const list = new taskList(JSON.parse(data))

      const setup = new settings()
      setup.reassignIndex()

      list.add(req.body, setup.getSetup().index)

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/removeTask', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.remove(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/ResetTODOApp', (req, res) => {

  const setup = new settings()
  setup.resetIndex()

  fs.writeFile('./database/taskList.json', JSON.stringify([]), (err) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {
      res.send('{ "result": 1 }')
    }
  })
})

app.post('/toggleCompletion', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.switchCompletionState(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/togglePin', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.switchPinState(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/removeCompletedTasks', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.removeCompletedTasks()

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/removeSelectedTasks', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.removeSelectedTasks(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})

app.post('/removeAllTasks', (req, res) => {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    if (err) {
      res.send('{ "result": 0 }')
    } else {

      const list = new taskList(JSON.parse(data))
      list.removeAllTasks()

      fs.writeFile('./database/taskList.json', JSON.stringify(list.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})