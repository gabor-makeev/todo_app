const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.listen(3000, () => {
console.log('Server started on 3000 port!')
})

class taskListSetup {
  getSetup () {
    return JSON.parse(fs.readFileSync('./database/taskListSetup.json', {encoding: 'utf8', flag:'r'}))
  }
  reassignIndex () {
    let setup = this.getSetup()
    if (setup.index === null) {
      setup.index = 0
    } else {
      setup.index++
    }

    fs.writeFileSync('./database/taskListSetup.json', JSON.stringify(setup))
  }
  resetIndex () {
    fs.writeFileSync('./database/taskListSetup.json', JSON.stringify({index: null}))
  }
}

class taskListObj {
  constructor(content) {
    this.content = content
  }

  add (element, id) {
    element.id = id
    this.content.push(element)
  }

  remove (element) {
    this.content.splice((element.number - 1), 1)
    this.rerenderIndexes()
  }

  rerenderIndexes () {
    for (let task = 1; task <= this.content.length; task ++) {
      this.content[task - 1].number = task
    }
  }

  switchCompletionState (element) {
    this.content.forEach(task => {
      if (task.id === element.id) {
        task.completionState = !task.completionState
      }
    })
  }

  switchPinState (element) {
    this.content.forEach(task => {
      if (task.id === element.id) {
        task.pinState = !task.pinState
      }
    })
  }

  removeCompletedTasks () {
    this.content = this.content.filter(element => element.completionState === false)
    this.rerenderIndexes()
  }

  removeSelectedTasks (selection) {
    this.content = this.content.filter(element => !selection.includes(element.id))
    this.rerenderIndexes()
  }

  removeAllTasks () {
    this.content = []
  }
}

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
      const taskList = new taskListObj(JSON.parse(data))

      const setup = new taskListSetup()
      setup.reassignIndex()

      taskList.add(req.body, setup.getSetup().index)

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.remove(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

  const setup = new taskListSetup()
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.switchCompletionState(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.switchPinState(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.removeCompletedTasks()

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.removeSelectedTasks(req.body)

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
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

      const taskList = new taskListObj(JSON.parse(data))
      taskList.removeAllTasks()

      fs.writeFile('./database/taskList.json', JSON.stringify(taskList.content), (err) => {
        if (err) {
          res.send('{ "result": 0 }')
        } else {
          res.send('{ "result": 1 }')
        }
      })
    }
  })
})
