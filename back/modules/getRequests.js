const fs = require('fs')

function getTaskList(response) {
  fs.readFile('./database/taskList.json', 'utf8', (err, data) => {
    response.send(data)
  })
}

module.exports = { getTaskList }