<template>
  <div class="todo-ui">
    <span class="todo-ui-title">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="ellipsis-h" class="svg-inline--fa fa-ellipsis-h fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z"></path>
      </svg>
    </span>
    <div class="todo-ui-menu">
      <div class="todo-ui-filter">
      <span>Filter tasks</span>
      <select class="todo-ui-filter-selector" v-model="filterOption">
        <option value="0" selected disabled hidden>Options</option>
        <option value="All">All</option>
        <option value="Without Priority">Without priority</option>
        <option value="High">High</option>
        <option value="Normal">Normal</option>
        <option value="Low">Low</option>
        <option value="Completed">Completed</option>
      </select>
      </div>
      <div class="todo-ui-sort">
      <span>Sort tasks</span>
      <select class="todo-ui-sort-selector" v-model="sortingOption">
        <option value="0" selected disabled hidden>Options</option>
        <option value="Default">Default</option>
        <option value="HighLow">From high to low</option>
        <option value="LowHigh">From low to high</option>
      </select>
      </div>
      <button class="todo-ui-button" @click="$emit('remove-selected-tasks', resetUI)">Remove Selected Tasks</button>
      <button class="todo-ui-button" @click="$emit('remove-completed-tasks', resetUI)">Remove Completed Tasks</button>
      <button class="todo-ui-button" @click="$emit('clear-task-list', resetUI)">Clear list</button>
      <button class="todo-ui-button" @click="$emit('reset-TODO', resetUI)">Reset TODO app</button>
    </div>
    <button class="todo-ui-modal-terminator" @click="$emit('toggle-mobile-todo-ui')">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
        </path>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  data: () => ({
    filterOption: '',
    sortingOption: ''
  }),
  mounted () {
    this.resetUI()
  },
  watch: {
    filterOption () {
      this.$emit('filter-list', this.filterOption)
    },
    sortingOption () {
      this.$emit('sort-list', this.sortingOption)
    }
  },
  methods: {
    resetUI () {
      this.filterOption = 0
      this.sortingOption = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';
@import '../assets/_glassmorphism-blocks.scss';
@import '../assets/_mixins.scss';
.todo-ui {
  @include setupFlex(flex-start, center, column);
  @include glassmorphBlockSetup($classicGlassMorphBackground, $classicGlassMorphBorder);
  max-width: 290px;
  border-radius: 2px;
  &-title {
    @include setupFlex();
    width: 100%;
    height: 70px;
    & svg {
      width: 100px;
      height: 60px;
      fill: white;
    }
  }
  &-menu {
    @include setupFlex(unset, center, column);
    padding: 0 25px;
    gap: 10px;
  }
  &-button {
    background-color: $buttonBackground;
    border: none;
    border-radius: 15px;
    box-shadow: $todoGlassMorphBackground 0px 2px 8px 0px;
    color: $defaultTextColor;
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;
    outline: none;
    font-family: 'Roboto Mono', monospace;
    font-size: 16px;
    width: 100%;
    &:hover {
      background-color: $buttonHoverBackground;
      color: white;
    }
    &:active {
      background-color: $buttonBackground;
      color: $defaultTextColor;
      box-shadow: none;
    }
  }
  &-filter,
  &-sort {
    @include setupFlex(unset, center, unset);
    gap: 10px;
    background-color: $buttonBackground;
    border: none;
    border-radius: 15px;
    box-shadow: $todoGlassMorphBackground 0px 2px 8px 0px;
    font-size: 14px;
    width: 100%;
    &:hover {
      & span {
        color: white;
      }
      & select {
        color: white;
      }
    }
    & span {
      color: $defaultTextColor;
      transition: 0.3s;
      width: 50%;
      padding: 10px 0 10px 7px;
    }
    &-selector {
      height: 100%;
      outline: none;
      border: none;
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      width: 50%;
      background-color: $minorContentBackground;
      color: $defaultTextColor;
      font-family: inherit;
      transition: 0.3s;
    }
  }
  &-modal-terminator {
    display: none;
  }
}

@media (max-width: 1000px) {
  .todo-ui {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100%;
    z-index: 1;
    &-menu {
      width: 100%;
      gap: 20px;
    }
    &-button,
    &-filter,
    &-sort {
      background-color: $minorContentBackground;
      font-size: 18px;
      padding: 10px;
      &:hover {
        & span {
          color: $defaultTextColor;
        }
        & select {
          color: $defaultTextColor;
        }
      }
    }
    & select {
      font-size: 16px;
      background-color: $moduleBackground;
      color: $defaultTextColor;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      width: 40%;
      height: 75%;
    }
    &-modal-terminator {
      @include setupFlex(center, center, unset);
      position: absolute;
      bottom: 10px;
      background-color: $defaultYellow;
      border: none;
      border-radius: 10px;
      padding: 10px 0;
      margin: 0 auto;
      width: 75%;
      cursor: pointer;
      fill: $minorContentBackground;
      transition: 0.3s;
      &:hover {
        background-color: $minorContentBackground;
        fill: $hoverYellow;
        box-shadow: 0 0 0 2px $hoverYellow inset;
      }
      &:active {
        fill: $minorContentBackground;
        box-shadow: 0 0 0 2px $minorContentBackground inset;
        background-color: $defaultYellow;
      }
      & svg {
        width: 50px;
      }
    }
  }
  .visible-mobile-todo-ui {
    display: flex;
  }
}
</style>
