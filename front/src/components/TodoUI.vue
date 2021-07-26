<template>
  <div class="todo-ui">
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
.todo-ui {
  min-width: 290px;
  height: 306px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  border: 1px solid red;
  padding: 10px 25px;
  background-color: $lighterRed;
  & button {
    background-color: #000000;
    color: red;
    border: 1px red;
    border-style: dashed solid;
    padding: 8px;
    transition: 0.3s;
    cursor: pointer;
    outline: none;
    font-family: 'Inconsolata', monospace;
    font-size: 18px;
    &:hover {
      background-color: $lighterRed;
      color: white;
    }
    &:active {
      background-color: #000000;
      color: red;
    }
  }
  &-filter,
  &-sort {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: black;
    border: 1px red;
    border-style: dashed solid;
    padding: 7px;
    & span {
      color: red;
    }
    &-selector {
      height: 30px;
      outline: none;
      background-color: black;
      color: red;
    }
  }
}
</style>
