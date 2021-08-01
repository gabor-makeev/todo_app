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
      <button @click="$emit('remove-selected-tasks', resetUI)">Remove Selected Tasks</button>
      <button @click="$emit('remove-completed-tasks', resetUI)">Remove Completed Tasks</button>
      <button @click="$emit('clear-task-list', resetUI)">Clear list</button>
      <button @click="$emit('reset-TODO', resetUI)">Reset TODO app</button>
    </div>
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
.todo-ui {
  max-width: 290px;
  display: flex;
  flex-direction: column;
  @include glassmorphBlockSetup(rgba(12, 17, 27, 0.800), rgba(255, 255, 255, 0.125));
  border-radius: 2px;
  &-title {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    & svg {
      width: 100px;
      height: 60px;
      fill: white;
    }
  }
  &-menu {
    padding: 0 25px;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
  }
  & button {
    background-color: rgba(17, 25, 40, 0.397);
    border: none;
    border-radius: 15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    color: rgba(255, 255, 255, 0.80);
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;
    outline: none;
    font-family: 'Roboto Mono', monospace;
    font-size: 16px;
    width: 100%;
    &:hover {
      background-color: rgba(17, 25, 40, 0.753);
      color: rgba(255, 255, 255, 1);
    }
    &:active {
      background-color: rgba(17, 25, 40, 0.397);
      color: rgba(255, 255, 255, 0.80);
      box-shadow: none;
    }
  }
  &-filter,
  &-sort {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba(17, 25, 40, 0.397);
    border: none;
    border-radius: 15px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    font-size: 14px;
    width: 100%;
    &:hover {
      & span {
        color: rgb(255, 255, 255);
      }
      & select {
        color: rgb(255, 255, 255);
      }
    }
    & span {
      color: rgba(255, 255, 255, 0.80);
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
      background-color: rgb(12, 17, 26);
      color: rgba(255, 255, 255, 0.80);
      font-family: inherit;
      transition: 0.3s;
    }
  }
}
</style>
