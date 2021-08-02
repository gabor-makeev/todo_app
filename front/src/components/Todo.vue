<template>
  <div class="todo">
    <div class="todo-control">
      <button @click="toggleEditMode" class="todo-control-edit" v-bind:class="{ 'todo-control-edit-on': editMode }">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
          <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
        </svg>
      </button>
      <input type="text" placeholder="add a task" v-model="taskContent" class="todo-control-input">
      <select class="todo-control-priority" v-model="taskPriority">
        <option value="0" id="defaultPriority" selected disabled hidden>
<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sliders-h" class="svg-inline--fa fa-sliders-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M496 384H160v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h80v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h336c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160h-80v-16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h336v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h80c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm0-160H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v16H16C7.2 64 0 71.2 0 80v32c0 8.8 7.2 16 16 16h208v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-16h208c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16z"></path></svg></option>
        <option value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
      </select>
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
    pinnedTasks: false
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
    },
    removeElement (task) {
      this.$emit('remove-task', task)
    },
    toggleEditMode () {
      this.editMode = !this.editMode
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
  gap: 25px;
  padding: 25px 10px;
  @include glassmorphBlockSetup(rgba(17, 25, 40, 0.75), rgba(255, 255, 255, 0.125));

  &-pinned {
    width: 250px;
    background-color: rgba(255, 255, 0, 0.04);
    box-shadow: rgb(0, 0, 0) 0px 30px 60px -12px inset, rgba(255, 255, 255, 0.3) 0px 18px 36px -18px inset;
    position: relative;
    padding: 45px 20px 10px 20px;
    margin: 0 0 0 70px;
    transition: 0.3s;

    &:hover {
      transform: scale(1.025);

      & .todo-pinned-paperclip {
        fill: #ffaa00;
      }
    }

    &-paperclip {
      width: 30px;
      fill: #FFAA00BF;
      position: absolute;
      top: 10px;
      left: 110px;
    }
  }

  &-unpinned {
    margin: 0 0 0 70px;
    padding: 0 20px 10px 20px;
    width: 250px;
  }

  &-control {
    display: flex;
    gap: 5px;
    align-items: center;

    &-input {
      height: 40px;
      width: 250px;
      background-color: #000000;
      border: 1px $defaultGreen;
      border-style: dashed solid;
      padding: 0 5px;
      color: $defaultGreen;
      outline: none;
      font-family: 'Inconsolata', monospace;
      font-size: 18px;
      transition: 0.3s;
      &::placeholder {
        color: $lighterGreen;
        font-family: 'Inconsolata', monospace;
      }
      &:hover {
        background-color: #171717;
      }
    }
    &-button,
    &-priority {
      height: 25px;
      background-color: #000000;
      color: $defaultGreen;
      border: 1px solid $defaultGreen;
      border-radius: 3px;
      transition: 0.3s;
      cursor: pointer;
      outline: none;
      padding: 3px 5px;
      font-family: 'Inconsolata', monospace;
      font-size: 16px;
      &:hover {
        background-color: #171717;
      }
      &:active {
        background-color: #000000;
      }
    }

    &-edit {
      background-color: transparent;
      width: 35px;
      height: 35px;
      border: none;
      cursor: pointer;
      transition: 0.3s;
      fill: rgba(255, 255, 255, 0.822);
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
