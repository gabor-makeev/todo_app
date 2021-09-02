<template>
  <div class="todo-mobile-buttons">
    <button class="todo-mobile-log-trigger" @click="$emit('toggle-mobile-console')">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="history" class="svg-inline--fa fa-history fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z">
            </path>
      </svg>
    </button>
    <button class="todo-mobile-menu-trigger" @click="$emit('toggle-mobile-TodoUI')">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z">
            </path>
      </svg>
    </button>
  </div>
</template>

<style lang="scss">
@import '../assets/_mixins.scss';
@import '../assets/_glassmorphism-blocks.scss';
@import '../assets/_variables.scss';

.todo-mobile-buttons {
  display: none;
}

@media (max-width: 1000px) {
  .todo-mobile {
    &-buttons {
      @include setupFlex(space-between, unset, unset);
      position: absolute;
      bottom: 50px;
      width: 100%;
      padding: 0 (25%/2);
      & button {
        border-radius: 50px;
        width: 80px;
        height: 80px;
        padding: 20px;
        cursor: pointer;
      }
    }
    &-log-trigger,
    &-menu-trigger {
      @include glassmorphBlockSetup($todoGlassMorphBackground, $defaultYellow);
      fill: $defaultYellow;
      transition: 0.3s;
      &:hover {
        fill: $hoverYellow;
        border-color: $hoverYellow;
        background-color: $minorContentBackground;
      }
      &:active {
        fill: $defaultYellow;
        border-color: $defaultYellow;
        background-color: $minorContentBackground;
      }
    }
  }
}
</style>
