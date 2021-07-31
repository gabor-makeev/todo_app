<template>
  <div class="console">
    <span class="console-title">CONSOLE:</span>
    <div class="console-content">
      <span class="console-content-taskcounter">Unique tasks created during this session: {{ taskIndex }}</span>
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
.console {
  max-width: 300px;
  max-height: 81vh;
  background-color: rgba(17, 25, 40, 0.75);
  backdrop-filter: blur(16px) saturate(180%);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 10px;
  overflow: auto;
  color: white;
  &-content {
    margin-top: 10px;
  }
  ul {
    margin-top: 10px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    li {
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
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
