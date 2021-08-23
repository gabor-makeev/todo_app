<template>
  <div class="todo">
    <div class="todo-control">
      <button @click="toggleEditMode" class="todo-control-edit" v-bind:class="{ 'todo-control-edit-on': editMode }">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
        </svg>
      </button>
      <input type="text" placeholder="add a task" v-model="taskContent" class="todo-control-input">
      <div class="todo-control-priority">
        <button class="todo-control-priority-button" v-bind:class="{ 'todo-control-priority-button-active': priorityBox }" @click="togglePriorityBox">Choose</button>
        <div class="todo-control-priority-selector" v-show="priorityBox">
          <button class="todo-control-high-priority" @click="changePriority('High')">High</button>
          <button class="todo-control-normal-priority" @click="changePriority('Normal')">Normal</button>
          <button class="todo-control-low-priority" @click="changePriority('Low')">Low</button>
          <button class="todo-control-none-priority" @click="changePriority('None')">None</button>
        </div>
      </div>
      <button @click="initTaskCreation(taskContent, taskPriority)" class="todo-control-button">Add</button>
    </div>
    <div class="todo-pinned" v-show="pinnedTasks">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paperclip" class="svg-inline--fa fa-paperclip fa-w-14 todo-pinned-paperclip" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M43.246 466.142c-58.43-60.289-57.341-157.511 1.386-217.581L254.392 34c44.316-45.332 116.351-45.336 160.671 0 43.89 44.894 43.943 117.329 0 162.276L232.214 383.128c-29.855 30.537-78.633 30.111-107.982-.998-28.275-29.97-27.368-77.473 1.452-106.953l143.743-146.835c6.182-6.314 16.312-6.422 22.626-.241l22.861 22.379c6.315 6.182 6.422 16.312.241 22.626L171.427 319.927c-4.932 5.045-5.236 13.428-.648 18.292 4.372 4.634 11.245 4.711 15.688.165l182.849-186.851c19.613-20.062 19.613-52.725-.011-72.798-19.189-19.627-49.957-19.637-69.154 0L90.39 293.295c-34.763 35.56-35.299 93.12-1.191 128.313 34.01 35.093 88.985 35.137 123.058.286l172.06-175.999c6.177-6.319 16.307-6.433 22.626-.256l22.877 22.364c6.319 6.177 6.434 16.307.256 22.626l-172.06 175.998c-59.576 60.938-155.943 60.216-214.77-.485z"></path>
      </svg>
      <TodoElement v-for="task in taskList" :key="task.id" :element="task" @remove-element="removeElement" @toggle-completion-state="toggleCompletionState" @toggle-pin-state="togglePinState" :editModeState="editMode" v-show="task.pinState"/>
    </div>
    <div class="todo-unpinned">
      <TodoElement v-for="task in taskList" :key="task.id" :element="task" @remove-element="removeElement" @toggle-completion-state="toggleCompletionState" @toggle-pin-state="togglePinState" :editModeState="editMode" v-show="!task.pinState"/>
    </div>
  </div>
</template>

<script>
import TodoElement from '@/components/TodoElement'
export default {
  components: {
    TodoElement
  },
  data: () => ({
    taskContent: '',
    taskPriority: '',
    editMode: false,
    pinnedTasks: false,
    priorityBox: false
  }),
  mounted () {
    this.taskPriority = 0
  },
  watch: {
    taskList () {
      this.arePinnedTasks()
    }
  },
  props: {
    taskList: {
      type: Array,
      default: () => []
    },
    console: {
      type: Array
    },
    rerenderTaskIndexes: {
      type: Function
    },
    createTask: {
      type: Function
    },
    toggleCompletionState: {
      type: Function
    },
    togglePinState: {
      type: Function
    }
  },
  methods: {
    initTaskCreation (task, taskPriority) {
      this.createTask(task, taskPriority)
      this.taskContent = ''
      this.taskPriority = 0
      document.querySelector('.todo-control-priority-button').textContent = 'choose'
    },
    removeElement (task) {
      this.$emit('remove-task', task)
    },
    toggleEditMode () {
      this.editMode = !this.editMode
    },
    togglePriorityBox () {
      this.priorityBox = !this.priorityBox
    },
    changePriority (priority) {
      if (priority === 'None') {
        this.taskPriority = 0
      } else {
        this.taskPriority = priority
      }
      this.priorityBox = false
      const priorityButton = document.querySelector('.todo-control-priority-button')
      priorityButton.textContent = priority
    },
    arePinnedTasks () {
      let pinnedTasks = false
      this.taskList.forEach(task => {
        if (task.pinState) {
          pinnedTasks = true
        }
      })
      this.pinnedTasks = pinnedTasks
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';
@import '../assets/_glassmorphism-blocks.scss';
.todo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 25px;
  @include glassmorphBlockSetup(rgba(17, 25, 40, 0.75), rgba(255, 255, 255, 0.125));

  &-pinned {
    width: 100%;
    background-color: rgba(255, 255, 0, 0.04);
    position: relative;
    padding: 45px 20px 10px 20px;
    transition: 0.3s;
    &-paperclip {
      transition: 0.3s;
    }

    & .todo-element {
      border: none;
    }

    &:hover {

      & .todo-pinned-paperclip {
        fill: rgb(17, 25, 40, 0.75);
      }
    }

    &-paperclip {
      width: 30px;
      fill: rgb(17, 25, 40);
      position: absolute;
      top: 10px;
      left: 50%;
    }
  }

  &-unpinned {
    margin-top: 10px;
    padding: 0 20px 10px 20px;
    width: 100%;
  }

  &-control {
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    height: 60px;
    background-color: #0c111a;

    &-input {
      height: 40px;
      max-width: 320px;
      background-color: transparent;
      border: none;
      padding: 0 5px;
      margin-left: 10px;
      color: white;
      flex: 1 0 auto;
      outline: none;
      font-family: 'Roboto Mono', monospace;
      font-size: 24px;
      transition: 0.3s;
      &::placeholder {
        color: rgba(255, 255, 255, 0.63);
        font-family: 'Roboto Mono', monospace;
      }
    }

    &-button {
      width: 50px;
      height: 100%;
      border: none;
      background-color: transparent;
      color: rgba(245, 245, 245, 0.616);
      font-family: 'Roboto Mono', monospace;
      font-size: 24px;
      cursor: pointer;
      transition: 0.3s;
      margin-right: 15px;
      &:hover {
        color: white;
      }
    }

    &-edit {
      background-color: transparent;
      width: 35px;
      height: 35px;
      margin-left: 20px;
      border: none;
      cursor: pointer;
      transition: 0.3s;
      fill: rgba(255, 255, 255, 0.822);
      &:hover {
        transform: scale(1.1);
      }
      &-on {
        fill: #ffaa00;
      }
    }
    &-priority {
      position: relative;
      display: flex;
      justify-content: center;
      width: 80px;
      &-button {
        font-family: 'Roboto Mono', monospace;
        border: 1px solid rgba(170, 172, 177, 0.397);;
        background-color: transparent;
        color: white;
        width: 100%;
        height: 30px;
        font-size: 16px;
        transition: 0.3s;
        cursor: pointer;
        &:hover {
          background-color: rgba(170, 172, 177, 0.397);
        }
        &-active {
          background-color: rgba(170, 172, 177, 0.397);
        }
      }
      &-selector {
        position: absolute;
        width: 130px;
        min-height: 100px;
        display: grid;
        box-shadow: rgba(99, 99, 99, 1) 0px 2px 8px 0px;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        margin: 35px 0 0 0;
        z-index: 100;
        & button {
          border: none;
          padding: 10px 0;
          background-color: rgb(17, 25, 40);
          transition: 0.3s;
          cursor: pointer;
          opacity: 0.75;
          font-family: inherit;
          font-weight: bold;
          font-size: 14px;
          &:hover {
            background-color: rgba(8, 12, 19, 0.835);
            opacity: 1;
          }
        }
      }
    }
    &-high-priority {
      color: rgba(224, 106, 106, 1);
    }
    &-normal-priority {
      color: rgb(106, 161, 224);
    }
    &-low-priority {
      color: rgb(133, 224, 106);
    }
    &-none-priority {
      color: rgb(207, 207, 207);
    }
  }
}
</style>
