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
  @include glassmorphBlockSetup($classicGlassMorphBackground, $classicGlassMorphBorder);
  flex: 0 1 300px;
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
    background-color: $minorContentBackground;
    border-radius: 15px;
  }
  ul {
    margin-top: 10px;
    list-style-type: none;
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
    color: $errorRed;
  }
  &-resolve-header {
    padding: 0 calc(100px - 50% / 2);
    margin: 0 0 5px 0;
  }
  &-resolve-header,
  &-resolve-content::before,
  &-resolve-priority::before {
    color: $infoBlue;
  }
  &-resolve-content {
    font-style: italic;
    color: $defaultTextColor;
    &::before {
      content: 'content:';
      font-style: normal;
    }
  }
  &-resolve-priority {
    color: $defaultTextColor;
    &::before {
      content: 'priority:';
    }
  }
}

@media (max-width: 1000px) {
  .console {
    display: none;
  }
}
</style>
