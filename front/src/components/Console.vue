<template>
  <div class="console">
    <div class="console-header">
      <span class="console-header-title">History</span>
      <span v-show="console.length" class="console-header-taskcounter">Unique tasks created during this session: {{ taskIndex }}</span>
    </div>
    <div v-show="console.length" class="console-content">
      <ul>
        <li v-for="log in console" :key="log.number">
          <span v-for="notification in log.content" :key="notification.textClass" :class="notification.textClass">{{ notification.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    taskIndex: {
      type: Number
    },
    console: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/_variables.scss';
@import '../assets/_glassmorphism-blocks.scss';
.console {
  width: 300px;
  @include glassmorphBlockSetup(rgba(12, 17, 27, 0.800), rgba(255, 255, 255, 0.125));
  border-radius: 2px;
  padding: 10px;
  color: white;
  &-header {
    margin-bottom: 25px;
    padding: 8px;
    &-title {
      display: block;
      text-align: center;
      font-size: 22px;
    }
  }
  &-content {
    padding: 10px 10px;
    background: rgba(17, 25, 40, 1);
    border-radius: 15px;
  }
  ul {
    margin-top: 10px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    max-height: 60vh;
    overflow: auto;
    gap: 10px;
    li {
      padding: 5px;
    }
    li span {
      display: flex;
    }
  }
  &-error-content {
    color: rgba(255, 0, 0, 0.59);
  }
  &-resolve-header {
    padding: 0 calc(100px - 50% / 2);
    margin: 0 0 5px 0;
  }
  &-resolve-header,
  &-resolve-content::before,
  &-resolve-priority::before {
    color: #5d5dfc;
  }
  &-resolve-content {
    font-style: italic;
    color: #c5c5c5;
    &::before {
      content: 'content:';
      font-style: normal;
    }
  }
  &-resolve-priority {
    color: #c5c5c5;
    &::before {
      content: 'priority:';
    }
  }
}
</style>
