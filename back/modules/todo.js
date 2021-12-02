const fs = require('fs')

class settings {
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

class taskList {
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

module.exports = {
  settings, 
  taskList
}