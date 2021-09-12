<template>
  <div class="console">
    <div class="console-mobile-top">
      <div class="console-header">
        <span class="console-header-title">History</span>
        <span v-show="console.length" class="console-header-taskcounter">Unique tasks created during this session: {{ uniqueTasks }}</span>
      </div>
      <div v-show="console.length" class="console-content">
        <ul>
          <li v-for="log in console" :key="log.number">
            <span v-for="notification in log.content" :key="notification.element" :class="notification.textClass">{{ notification.text }}</span>
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
  data: () => ({
    console: [],
    consoleIndex: null,
    uniqueTasks: null
  }),
  props: {
    consoleRequest: {
      type: String,
      default: ''
    },
    actionsLog: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    createNotification (text, textClass = '') {
      const content = []
      if (textClass.length > 1) {
        text.forEach((element, index) => {
          content.push({
            text: element,
            textClass: textClass[index],
            id: index
          })
        })
      } else {
        for (let element = 0; element < text.length; element++) {
          content.push({
            text: text[element],
            textClass: textClass[0],
            id: element
          })
        }
      }
      if (this.consoleIndex === null) {
        this.initConsole()
      } else {
        this.consoleIndex++
      }
      this.console.unshift({
        content: content,
        number: this.consoleIndex
      })
    },
    initConsole () {
      this.console = []
      this.consoleIndex = 0
    },
    fetchUniqueTasks () {
      this.uniqueTasks === null ? this.uniqueTasks = 1 : this.uniqueTasks++
    }
  },
  watch: {
    consoleRequest () {
      if (this.consoleRequest === 'reset') {
        this.console = []
        this.consoleIndex = null
        this.uniqueTasks = null
      }
    },
    actionsLog () {
      const lastAction = this.actionsLog[this.actionsLog.length - 1]
      const type = lastAction.type
      const actionData = lastAction.data
      switch (type) {
        case 'add_task':
          this.createNotification(
            [actionData.text, actionData.priority !== 0 ? actionData.priority : actionData.priority = 'None'],
            ['notifications-add', 'notifications-priority']
          )
          this.fetchUniqueTasks()
          break
        case 'remove_task':
          this.createNotification(
            [actionData.text],
            ['notifications-remove']
          )
          break
        case 'remove_tasks':
          if (actionData.length) {
            this.createNotification(['All tasks were successfully removed'], ['notifications-success'])
          } else {
            this.createNotification(['There are no tasks to remove'], ['notifications-error'])
          }
          break
        case 'remove_completed':
          if (actionData.length) {
            const notificationsTasks = []
            actionData.forEach(task => {
              notificationsTasks.push('notifications-tasks')
            })
            this.createNotification(
              ['Completed tasks removed:'].concat(actionData),
              ['notifications-success'].concat(notificationsTasks)
            )
          } else {
            this.createNotification(['There are no completed tasks to remove'], ['notifications-error'])
          }
          break
        case 'remove_selected':
          if (actionData.length) {
            const notificationsTasks = []
            actionData.forEach(task => {
              notificationsTasks.push('notifications-tasks')
            })
            this.createNotification(
              ['Selected tasks removed:'].concat(actionData),
              ['notifications-success'].concat(notificationsTasks)
            )
          } else {
            this.createNotification(['There are no selected tasks to remove'], ['notifications-error'])
          }
          break
      }
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
  &-modal-terminator {
    display: none;
  }
}
.notifications {
  &-add {
    &::before {
      content: 'Added task:';
      padding: 0 10px 0 0;
      color: $infoBlue;
    }
  }
  &-priority {
    &::before {
      content: 'Priority:';
      padding: 0 10px 0 0;
      color: $infoBlue;
    }
  }
  &-remove {
    &::before {
      content: 'Removed task:';
      padding: 0 10px 0 0;
      color: $infoBlue;
    }
  }
  &-error {
    color: $errorRed;
  }
  &-success {
    color: $defaultGreen;
  }
  &-tasks {
    height: 35px;
    @include setupFlex(unset, center, unset);
    padding-top: 10px;
    &::before {
      content: url('../assets/images/icons/task-icon.svg');
      width: 20px;
      height: 25px;
      margin-right: 10px;
    }
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
