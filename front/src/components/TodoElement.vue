<template>
  <div class="todo-element" :id=element.id v-bind:class="{ 'todo-element-selected': element.selectionState }">
    <div class="todo-element-leftside">
      <input class="todo-element-checkbox" type="checkbox" @click="toggleSelectionState(element)" v-show="editModeState">
      <span class="todo-element-text" v-bind:class="{ 'todo-element-completed': element.completionState }" @click="$emit('toggle-completion-state', element)">{{ element.text }}</span>
    </div>
    <div class="todo-element-rightside">
      <span v-show="element.priority !== 0" v-bind:class="{ 'todo-element-priority-high': element.priority === 'High', 'todo-element-priority-normal': element.priority === 'Normal', 'todo-element-priority-low': element.priority === 'Low' }">{{ element.priority }}</span>
      <svg v-if="!element.pinState" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="thumbtack" class="svg-inline--fa fa-thumbtack fa-w-12 todo-element-pin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" @click="$emit('toggle-pin-state', element)" v-show="editModeState">
        <path d="M298.028 214.267L285.793 96H328c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24H56C42.745 0 32 10.745 32 24v48c0 13.255 10.745 24 24 24h42.207L85.972 214.267C37.465 236.82 0 277.261 0 328c0 13.255 10.745 24 24 24h136v104.007c0 1.242.289 2.467.845 3.578l24 48c2.941 5.882 11.364 5.893 14.311 0l24-48a8.008 8.008 0 0 0 .845-3.578V352h136c13.255 0 24-10.745 24-24-.001-51.183-37.983-91.42-85.973-113.733z"></path>
      </svg>
      <svg v-else-if="element.pinState" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="unlink" class="svg-inline--fa fa-unlink fa-w-16 todo-element-pin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" @click="$emit('toggle-pin-state', element)" v-show="editModeState">
        <path d="M304.083 405.907c4.686 4.686 4.686 12.284 0 16.971l-44.674 44.674c-59.263 59.262-155.693 59.266-214.961 0-59.264-59.265-59.264-155.696 0-214.96l44.675-44.675c4.686-4.686 12.284-4.686 16.971 0l39.598 39.598c4.686 4.686 4.686 12.284 0 16.971l-44.675 44.674c-28.072 28.073-28.072 73.75 0 101.823 28.072 28.072 73.75 28.073 101.824 0l44.674-44.674c4.686-4.686 12.284-4.686 16.971 0l39.597 39.598zm-56.568-260.216c4.686 4.686 12.284 4.686 16.971 0l44.674-44.674c28.072-28.075 73.75-28.073 101.824 0 28.072 28.073 28.072 73.75 0 101.823l-44.675 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.598 39.598c4.686 4.686 12.284 4.686 16.971 0l44.675-44.675c59.265-59.265 59.265-155.695 0-214.96-59.266-59.264-155.695-59.264-214.961 0l-44.674 44.674c-4.686 4.686-4.686 12.284 0 16.971l39.597 39.598zm234.828 359.28l22.627-22.627c9.373-9.373 9.373-24.569 0-33.941L63.598 7.029c-9.373-9.373-24.569-9.373-33.941 0L7.029 29.657c-9.373 9.373-9.373 24.569 0 33.941l441.373 441.373c9.373 9.372 24.569 9.372 33.941 0z"></path>
      </svg>
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11 todo-element-cross" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" @click="$emit('remove-element', element)" v-show="!editModeState">
        <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    element: {
      type: Object
    },
    editModeState: {
      type: Boolean
    }
  },
  methods: {
    toggleSelectionState (element) {
      element.selectionState = !element.selectionState
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';
.todo-element {
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  transition: 0.3s;

  &-rightside {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &-selected {
    background-color: rgba(130, 129, 129, 0.65);
    transform: scale(1.1);
  }
  &-checkbox {
    width: 20px;
  }
  &-text {
    color: $defaultGreen;
    transition: 0.2s;
    cursor: default;
    &:hover {
      color: $lighterGreen;
    }
  }
  &-priority {
    &-low {
      color: #4287f5;
    }
    &-normal {
      color: #fcad03;
    }
    &-high {
      color: #fc2403;
    }
  }
  &-cross,
  &-pin {
    width: 20px;
    fill: $lighterRed;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      fill: red;
    }
  }
  &-pin {
    width: 15px;
    fill: rgba(255, 170, 0, 0.75);
    &:hover {
      fill: #ffaa00;
    }
  }
  &-completed {
    text-decoration: line-through;
  }
}
</style>
