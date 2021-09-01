<template>
  <div class="console">
    <div class="console-mobile-top">
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
    <div class="console-mobile-bottom">
      <button class="console-modal-terminator" @click="$emit('toggle-mobile-console')">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z">
          </path>
        </svg>
      </button>
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
@import '../assets/_mixins.scss';
.console {
  @include glassmorphBlockSetup($classicGlassMorphBackground, $classicGlassMorphBorder);
  flex: 0 1 300px;
  border-radius: 2px;
  padding: 10px;
  color: white;
  max-width: 285px;
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
  &-modal-terminator {
    display: none;
  }
}

@media (max-width: 1000px) {
  .console {
    @include setupFlex(space-between, center, column);
    display: none;
    position: absolute;
    padding: 15px calc(50% - 420px / 2);
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: unset;
    &-content {
      padding: 10 0;
    }
    &-mobile-top {
      padding: 0 10px;
    }
    &-mobile-bottom {
      width: 100%;
      padding: 0 10px;
    }
    &-header-taskcounter {
      display: block;
      text-align: center;
      padding: 10px;
    }
    &-content ul li {
      @include setupFlex(unset, center, column)
    }
    &-modal-terminator {
      @include setupFlex(center, center, unset);
      bottom: 10px;
      background-color: $defaultYellow;
      border: none;
      border-radius: 10px;
      padding: 10px 0;
      margin: 0 auto;
      width: 100%;
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
  .visible-mobile-console {
    display: flex;
  }
}
</style>
