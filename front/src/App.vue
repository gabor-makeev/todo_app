<template>
  <div id="app">
    <div class="wrapper">
      <Console :taskIndex="uniqueTasks" :console="console" @toggle-mobile-console="toggleMobileConsole" />
      <Todo :console="console" :taskList="taskList" :createTask="createTask" @remove-task="removeTask" :toggleCompletionState="toggleCompletionState" :togglePinState="togglePinState" />
      <TodoUI @clear-task-list="clearTaskList" @reset-TODO="resetTODO" @remove-completed-tasks="removeCompletedTasks" @remove-selected-tasks="removeSelectedTasks" @filter-list="filterList" @sort-list="sortList" @reset-console="resetConsole" />
      <div class="todo-mobile-buttons">
        <button class="todo-mobile-log-trigger" @click="toggleMobileConsole">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="history" class="svg-inline--fa fa-history fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z">
            </path>
          </svg>
        </button>
        <button class="todo-mobile-menu-trigger">
          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
            </path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Console from '@/components/Console'
import TodoUI from '@/components/TodoUI'
import Todo from '@/components/Todo'
export default {
  components: {
    Console,
    TodoUI,
    Todo
  },
  data: () => ({
    taskList: [],
    originalList: [],
    console: [],
    consoleIndex: null,
    mobileConsoleState: null,
    mobileView: window.innerWidth <= 1000,
    uniqueTasks: 0,
    nightMode: true,
    API_URL: 'http://localhost:3000'
  }),
  mounted () {
    this.getTaskList()
    this.mobileConsoleState = false
    this.screenSizeListner()
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
      this.resetConsole()
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
    },
    resetConsole () {
      this.console = []
    },
    screenSizeListner () {
      window.addEventListener('resize', () => {
        if (window.innerWidth <= 1000) {
          this.mobileView = true
        } else {
          this.mobileView = false
        }
      })
    },
    toggleMobileConsole () {
      document
        .querySelector('.console')
        .classList
        .toggle('visible-mobile-console')
      console.log(document.querySelector('.console').classList)
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
@import 'assets/_global-styles.scss';
@import 'assets/_variables.scss';
@import 'assets/_mixins.scss';
@import 'assets/_glassmorphism-blocks.scss';

#app {
  @include setupFlex(center, unset, unset);
  position: relative;
  height: 100vh;
  background: no-repeat url('./assets/images/backgrounds/minimalistic.jpg');
  background-position: center;
  background-size: cover;
}

.wrapper {
  width: 1140px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  min-height: 100vh;
}

.todo-mobile-buttons {
  display: none;
}

@media (max-width: 1000px) {
  .wrapper {
    display: block;
  }
  .todo-mobile {
    &-buttons {
      @include setupFlex(space-between, unset, unset);
      position: absolute;
      bottom: 50px;
      width: 100%;
      padding: 0 (25%/2);
      & button {
        border-radius: 50px;
        width: 80px;
        height: 80px;
        padding: 20px;
        cursor: pointer;
      }
    }
    &-log-trigger,
    &-menu-trigger {
      @include glassmorphBlockSetup($todoGlassMorphBackground, $defaultYellow);
      fill: $defaultYellow;
      transition: 0.3s;
      &:hover {
        fill: $hoverYellow;
        border-color: $hoverYellow;
      }
      &:active {
        fill: $defaultYellow;
        border-color: $defaultYellow;
        background-color: $minorContentBackground;
      }
    }
  }
}

</style>
