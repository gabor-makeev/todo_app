<template>
  <div id="app">
    <div class="wrapper">
      <Console :taskIndex="uniqueTasks" :console="console" />
      <Todo :console="console" :taskList="taskList" :createTask="createTask" @remove-task="removeTask" :toggleCompletionState="toggleCompletionState" :togglePinState="togglePinState" />
      <TodoUI @clear-task-list="clearTaskList" @reset-TODO="resetTODO" @remove-completed-tasks="removeCompletedTasks" @remove-selected-tasks="removeSelectedTasks" @filter-list="filterList" @sort-list="sortList" />
    </div>
    <ThemeSwitcher @toggle-theme="toggleTheme" :nightMode="nightMode" />
  </div>
</template>

<script>
import Console from '@/components/Console'
import TodoUI from '@/components/TodoUI'
import Todo from '@/components/Todo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
export default {
  components: {
    Console,
    TodoUI,
    Todo,
    ThemeSwitcher
  },
  data: () => ({
    taskList: [],
    originalList: [],
    console: [],
    consoleIndex: null,
    uniqueTasks: 0,
    nightMode: true,
    API_URL: 'http://localhost:3000'
  }),
  mounted () {
    this.getTaskList()
  },
  methods: {
    //
    // Requests START
    //
    // GET and POST requests
    // that are responsible for the communication
    // between Front and Back-end
    // in particular, the todo-api/database/taskList.json and taskListSetup.json files
    makeGETRequest (url) {
      return fetch(url)
        .then((data) => {
          return data.json()
        })
    },
    makePOSTRequest (url, data) {
      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then((data) => {
          return data.json()
        })
    },
    //
    // Requests END
    //
    // Methods with request usage START
    //
    // getTaskList obtains the data
    // about tasks that are already registered
    // on back-end and assigns it to
    // taskList and originalList variables on Front-end
    getTaskList () {
      this.makeGETRequest(`${this.API_URL}/taskList`)
        .then((data) => {
          this.taskList = data
          this.originalList = data
        })
    },
    // createTask sends a POST request
    // which instructs the back-end localhost server
    // to register the task or send a notification if needed
    createTask (task, taskPriority) {
      if (task.length) {
        this.makePOSTRequest(`${this.API_URL}/addTask`, { text: task, number: this.taskList.length + 1, selectionState: false, completionState: false, pinState: false, priority: taskPriority })
          .then(() => {
            this.getTaskList()
          })
        const notifications = ['::Added task::', `'${task}'`]
        if (taskPriority === 0) {
          notifications.push('None')
        } else {
          notifications.push(taskPriority)
        }
        const classes = ['console-resolve-header', 'console-resolve-content', 'console-resolve-priority']
        this.createNotification(notifications, classes)
        this.uniqueTasks++
      } else {
        this.createNotification(['Not valid value entered'], ['console-error-content'])
      }
    },
    // removeTask sends a POST requests
    // and instructs the back-end to remove a specific task
    removeTask (task) {
      this.makePOSTRequest(`${this.API_URL}/removeTask`, task)
        .then(() => {
          this.getTaskList()
        })
    },
    // clearTaskList simply removes all tasks via a POST request
    clearTaskList (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeAllTasks`)
        .then(() => {
          this.getTaskList()
        })
      cb()
    },
    // resetTODO resets the app to its original settings (taskList = [], index = null)
    resetTODO (cb) {
      this.makePOSTRequest(`${this.API_URL}/ResetTODOApp`)
        .then(() => {
          this.getTaskList()
        })
      cb()
    },
    // removeCompletedTasks sends a POST request
    // which instructs to remove all tasks with completionState === true
    // the state is being checked on the back-end
    removeCompletedTasks (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeCompletedTasks`)
        .then(() => {
          this.getTaskList()
        })
      cb()
    },
    // removeSelectedTasks works the same way as removeCompletedTasks
    // but the selectionState is checked on front-end
    // as it shouldn't be known on back-end
    removeSelectedTasks (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeSelectedTasks`, this.getSelectedTasksIDs())
        .then(() => {
          this.getTaskList()
        })
      cb()
    },
    // toggleCompletionState changes the completionState on back-end
    toggleCompletionState (task) {
      this.makePOSTRequest(`${this.API_URL}/toggleCompletion`, task)
        .then(() => {
          this.getTaskList()
        })
    },
    togglePinState (task) {
      this.makePOSTRequest(`${this.API_URL}/togglePin`, task)
        .then(() => {
          this.getTaskList()
        })
    },
    //
    // Methods with request usage END
    //
    // getSelectedTasksIDs collects the data about selectionStates
    // and returns an array of tasks
    getSelectedTasksIDs () {
      const selectedTasksIDs = []
      this.taskList.forEach(task => {
        if (task.selectionState) {
          selectedTasksIDs.push(task.id)
        }
      })
      return selectedTasksIDs
    },
    // filterList filters the list of tasks on front-end
    filterList (option) {
      if (option === 'All') {
        this.getTaskList()
      } else if (option === 'Completed') {
        this.taskList = this.originalList.filter(task => task.completionState)
      } else if (option === 'Without Priority') {
        this.taskList = this.originalList.filter(task => task.priority === 0)
      } else {
        this.taskList = this.originalList.filter(task => task.priority === option)
      }
    },
    // sortList sorts the list of tasks on front-end
    sortList (option) {
      const prioritiesArray = ['High', 'Normal', 'Low', 0]
      this.taskList = []
      if (option === 'Default') {
        this.getTaskList()
      } else if (option === 'HighLow') {
        for (let priority = 0; priority <= prioritiesArray.length; priority++) {
          this.originalList.forEach(task => {
            if (task.priority === prioritiesArray[priority]) {
              this.taskList.push(task)
            }
          })
        }
      } else {
        for (let priority = prioritiesArray.length - 1; priority >= 0; priority--) {
          this.originalList.forEach(task => {
            if (task.priority === prioritiesArray[priority]) {
              this.taskList.push(task)
            }
          })
        }
      }
    },
    // initConsole creates launching conditions
    // for the console component (consoleIndex is used as a key)
    initConsole () {
      this.consoleIndex = 0
    },
    // in createNotification, the text parameter
    // is an array containing a string or a series of strings
    // as soon as a notification may require several lines of messages
    // the textClass is needed for styling of different types of notifications
    // for example an error message is red-colored, while a task creation
    // notification features several colors and styles
    createNotification (text, textClass) {
      const content = []
      for (let element = 0; element < text.length; element++) {
        content.push({
          text: text[element],
          textClass: textClass[element]
        })
      }
      if (this.consoleIndex === null) {
        this.initConsole()
      } else {
        this.consoleIndex++
      }
      this.console.unshift({
        content: content,
        number: this.consoleIndex
      })
    },
    toggleTheme () {
      this.nightMode = !this.nightMode
    }
  },
  watch: {
    nightMode () {
      const body = document.getElementsByTagName('body')[0]
      body.style.transition = '0.3s'
      if (this.nightMode) {
        body.style.backgroundColor = 'black'
      } else {
        body.style.backgroundColor = 'white'
      }
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100;200;300;400;500;600;700&display=swap');
@import 'assets/_variables.scss';
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto Mono', monospace;
  background-color: #000000;
}

#app {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: no-repeat url('./assets/images/backgrounds/minimalistic.jpg');
  background-size: cover;
}

.wrapper {
  width: 1140px;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

</style>
