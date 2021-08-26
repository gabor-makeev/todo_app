<template>
  <div class="todo">
    <div class="todo-control">
      <button @click="toggleEditMode" class="todo-control-edit" v-bind:class="{ 'todo-control-edit-on': editMode }">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
        </svg>
        <span>Edit</span>
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
@import '../assets/_mixins.scss';
.todo {
  @include glassmorphBlockSetup($todoGlassMorphBackground, $todoGlassMorphBorder);
  padding-bottom: 25px;

  &-pinned {
    width: 100%;
    background-color: $todoPinnedBackground;
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
        fill: $hoverYellow;
      }
    }

    &-paperclip {
      width: 30px;
      fill: $defaultYellow;
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
    @include setupFlex(space-evenly, center, unset);
    padding: 0 15px;
    width: 100%;
    min-height: 60px;
    background-color: $minorContentBackground;

    &-input {
      height: 40px;
      flex: 1 1 auto;
      background-color: transparent;
      border: none;
      padding: 0 5px;
      margin-left: 5px;
      color: white;
      outline: none;
      font-family: 'Roboto Mono', monospace;
      font-size: 24px;
      transition: 0.3s;
      &::placeholder {
        color: $defaultPlaceholderColor;
        font-family: 'Roboto Mono', monospace;
      }
    }

    &-button {
      width: 50px;
      height: 100%;
      border: none;
      background-color: transparent;
      color: $defaultTextColor;
      font-family: 'Roboto Mono', monospace;
      font-size: 24px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        color: white;
      }
    }

    &-edit {
      background-color: transparent;
      flex: 0 0 35px;
      height: 35px;
      border: none;
      cursor: pointer;
      transition: 0.3s;
      fill: $defaultSVGcolor;
      &:hover {
        fill: $hoverSVGcolor;
      }
      &-on {
        fill: $hoverYellow;
        &:hover {
          fill: $hoverYellow;
        }
      }
      & span {
        display: none;
      }
    }
    &-priority {
      @include setupFlex(center, unset, unset);
      flex: 0 1 80px;
      margin-right: 7px;
      position: relative;
      &-button {
        font-family: 'Roboto Mono', monospace;
        border: 1px solid $classicGlassMorphBorder;
        background-color: transparent;
        color: white;
        width: 100%;
        padding: 0 10px;
        height: 30px;
        font-size: 16px;
        transition: 0.3s;
        cursor: pointer;
        &:hover {
          background-color: $classicGlassMorphBorder;
        }
        &-active {
          background-color: $classicGlassMorphBorder;
        }
      }
      &-selector {
        position: absolute;
        width: 130px;
        min-height: 100px;
        display: grid;
        box-shadow: $classicGlassMorphBorder 0px 2px 8px 0px;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        margin: 35px 0 0 0;
        z-index: 100;
        & button {
          border: none;
          padding: 10px 0;
          background-color: $moduleBackground;
          transition: 0.3s;
          cursor: pointer;
          opacity: 0.75;
          font-family: inherit;
          font-weight: bold;
          font-size: 14px;
          &:hover {
            background-color: $moduleHoverBackground;
            opacity: 1;
          }
        }
      }
    }
    &-high-priority {
      color: $highPriority;
    }
    &-normal-priority {
      color: $normalPriority;
    }
    &-low-priority {
      color: $lowPriority;
    }
    &-none-priority {
      color: $nonePriority;
    }
  }
}

@media (max-width: 1000px) {
  .todo {
    width: 100%;
    height: 100%;
    padding: 15vh 0 0 0;
    &-control {
      flex-wrap: wrap;
      padding: 15px 15px;
      width: unset;
      max-width: (100%/4) * 3;
      margin: 0 auto;
      background-color: transparent;
      &-input {
        order: -1;
        width: 100%;
        background-color: $minorContentBackground;
        padding: 30px 15px;
        margin-left: 0;
        &::placeholder {
          text-align: center;
        }
      }
      &-button {
        flex: 0 0 (100%/3);
        background-color: $defaultGreen;
        font-size: 18px;
        height: 35px;
        color: $minorContentBackground;
        &:active {
          background-color: $minorContentBackground;
          color: $defaultGreen;
          box-shadow: 0 0 0 2px $defaultGreen inset;
        }
      }
      &-edit {
        flex: 0 0 (100%/3);
        background-color: $defaultYellow;
        font-family: inherit;
        font-size: 18px;
        color: $minorContentBackground;
        & svg {
          display: none;
        }
        & span {
          display: block;
        }
        &-on {
          background-color: $minorContentBackground;
          box-shadow: 0 0 0 2px $defaultYellow inset;
          & span {
            color: $defaultYellow;
          }
        }
      }
      &-priority {
        flex: 0 0 (100%/3);
        order: 0;
        margin-right: 0;
        &-button {
          height: 35px;
          background-color: $defaultBlue;
          border: none;
          &:hover {
            background-color: $hoverBlue;
          }
          &-active {
            background-color: $hoverBlue;
          }
        }
      }
    }
  }
}
</style>
