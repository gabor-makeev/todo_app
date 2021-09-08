<template>
  <div id="app">
    <div class="wrapper">
      <Console :taskIndex="uniqueTasks" :console="console" @toggle-mobile-console="toggleMobileConsole" />
      <Todo :console="console" :taskList="taskList" :createTask="createTask" @remove-task="removeTask" :toggleCompletionState="toggleCompletionState" :togglePinState="togglePinState" />
      <TodoUI @clear-task-list="clearTaskList" @reset-TODO="resetTODO" @remove-completed-tasks="removeCompletedTasks" @remove-selected-tasks="removeSelectedTasks" @filter-list="filterList" @sort-list="sortList" @reset-console="resetConsole" @toggle-mobile-todo-ui="toggleMobileTodoUI" />
      <MobileInterface @toggle-mobile-console="toggleMobileConsole" @toggle-mobile-TodoUI="toggleMobileTodoUI" />
    </div>
  </div>
</template>

<script>
import Console from '@/components/Console'
import TodoUI from '@/components/TodoUI'
import Todo from '@/components/Todo'
import MobileInterface from '@/components/MobileInterface'
export default {
  components: {
    Console,
    TodoUI,
    Todo,
    MobileInterface
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
  },
  methods: {
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
    getTaskList () {
      this.makeGETRequest(`${this.API_URL}/taskList`)
        .then((data) => {
          this.taskList = data
          this.originalList = data
        })
    },
    createTask (task, taskPriority) {
      if (task.length) {
        this.makePOSTRequest(`${this.API_URL}/addTask`, { text: task, number: this.taskList.length + 1, selectionState: false, completionState: false, pinState: false, priority: taskPriority })
          .then(() => {
            this.getTaskList()
          })
        this.uniqueTasks++
        this.createNotification(
          [
            task,
            taskPriority === 0 ? 'None' : taskPriority
          ],
          [
            'notifications-add',
            'notifications-priority'
          ]
        )
      } else {
        this.createNotification(
          ['Not valid value entered'],
          ['notifications-error']
        )
      }
    },
    removeTask (task) {
      this.makePOSTRequest(`${this.API_URL}/removeTask`, task)
        .then(() => {
          this.getTaskList()
        })
      this.createNotification(
        [task.text],
        ['notifications-remove']
      )
    },
    clearTaskList (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeAllTasks`)
        .then(() => {
          this.getTaskList()
        })
      this.createNotification(['All tasks were successfully removed'])
      cb()
    },
    resetTODO (cb) {
      this.makePOSTRequest(`${this.API_URL}/ResetTODOApp`)
        .then(() => {
          this.getTaskList()
        })
      this.resetConsole()
      cb()
    },
    getTaskContentByState (state) {
      const tasksWithState = []
      this.taskList.forEach(task => {
        if (task[state]) {
          tasksWithState.push(task.text)
        }
      })
      return tasksWithState
    },
    removeCompletedTasks (cb) {
      if (this.getTaskContentByState('completionState').length) {
        this.createNotification(
          ['Completed tasks removed:'].concat(this.getTaskContentByState('completionState')),
          ['notifications-details']
        )
        this.makePOSTRequest(`${this.API_URL}/removeCompletedTasks`)
          .then(() => {
            this.getTaskList()
          })
        cb()
      } else {
        this.createNotification(
          ['There are no completed tasks to remove'],
          ['notifications-error']
        )
      }
    },
    removeSelectedTasks (cb) {
      if (this.getTaskContentByState('selectionState').length) {
        this.createNotification(
          ['Selected tasks removed:'].concat(this.getTaskContentByState('selectionState')),
          ['notifications-details']
        )
        this.makePOSTRequest(`${this.API_URL}/removeSelectedTasks`, this.getSelectedTasksIDs())
          .then(() => {
            this.getTaskList()
          })
        cb()
      } else {
        this.createNotification(
          ['There are no selected tasks to remove'],
          ['notifications-error']
        )
      }
    },
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
    getSelectedTasksIDs () {
      const selectedTasksIDs = []
      this.taskList.forEach(task => {
        if (task.selectionState) {
          selectedTasksIDs.push(task.id)
        }
      })
      return selectedTasksIDs
    },
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
    initConsole () {
      this.consoleIndex = 0
    },
    createNotification (text, textClass = '') {
      const content = []
      if (textClass.length > 1) {
        text.forEach((element, index) => {
          content.push({
            text: element,
            textClass: textClass[index],
            id: index
          })
        })
      } else {
        for (let element = 0; element < text.length; element++) {
          content.push({
            text: text[element],
            textClass: textClass[0],
            id: element
          })
        }
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
    toggleMobileConsole () {
      document
        .querySelector('.console')
        .classList
        .toggle('visible-mobile-console')
    },
    toggleMobileTodoUI () {
      document
        .querySelector('.todo-ui')
        .classList
        .toggle('visible-mobile-todo-ui')
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

@media (max-width: 1000px) {
  .wrapper {
    display: block;
  }
}

</style>
