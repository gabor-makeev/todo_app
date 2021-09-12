<template>
  <div id="app">
    <div class="wrapper">
      <Console @toggle-mobile-console="toggleMobileConsole" :consoleRequest="consoleCommand" :actionsLog="actionsLog" />
      <Todo :taskList="taskList" :createTask="createTask" @remove-task="removeTask" :toggleCompletionState="toggleCompletionState" :togglePinState="togglePinState" />
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
    actionsLog: [], // for notification handling
    consoleCommand: '',
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
    createTask (task) {
      if (task.text) {
        this.makePOSTRequest(`${this.API_URL}/addTask`, task)
          .then(() => {
            this.getTaskList()
          })
        this.logAction('add_task', task)
        this.uniqueTasks++
      }
    },
    removeTask (task) {
      this.makePOSTRequest(`${this.API_URL}/removeTask`, task)
        .then(() => {
          this.getTaskList()
        })
      this.logAction('remove_task', task)
    },
    clearTaskList (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeAllTasks`)
        .then(() => {
          this.getTaskList()
        })
      this.logAction('remove_tasks', this.taskList)
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
      this.makePOSTRequest(`${this.API_URL}/removeCompletedTasks`)
        .then(() => {
          this.logAction('remove_completed', this.getTaskContentByState('completionState'))
          this.getTaskList()
        })
      cb()
    },
    removeSelectedTasks (cb) {
      this.makePOSTRequest(`${this.API_URL}/removeSelectedTasks`, this.getSelectedTasksIDs())
        .then(() => {
          this.logAction('remove_selected', this.getTaskContentByState('selectionState'))
          this.getTaskList()
        })
      cb()
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
    logAction (action, data = null) {
      this.actionsLog.push({
        type: action,
        data: data
      })
    },
    resetConsole () {
      this.consoleCommand = 'reset'
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
