<template>
  <div class="wrapper">
    <div class="scroll"></div>
    <div class="content">
      <div
        :ref="img.ref"
        v-for="img in content"
        :key="img.url"
        style="transform: none"
      >
        <img
          v-if="img.type === 'image'"
          :style="sizePicture"
          :src="img.url"
          class="img"
          alt="img"
          :draggable="false"
          style="transform: none"
        />
        <!--       <div
          class="img"
          :style="sizePicture"
          v-if="img.type === 'link'"
          :ref="img.ref"
          :draggable="false"
          style="transform: none"
        >
          <iframe
            seamless
            allowtransparency
            scrolling="no"
            :style="sizePicture"
            :src="img.url"
            class="iframe"
            alt="img"
            :ref="img.ref"
            :draggable="false"
          ></iframe>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
import { toggleFullScreen } from "@/lib";
import { styler, value, listen, pointer, spring } from "popmotion";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "",
);

/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      element: null,
      dropAreaBottom: 100,
      size: {},
      track: [],
      endFirstAnim: {},
      isMous: false,
      typeEvent: "touch",
      itemsConfig: {},
    };
  },
  mounted() {
    const items = Object.entries(this.$refs);

    items.forEach((el) => {
      const item = el[1];
      const itemStyler = styler(item);
      const itemXY = value({ x: 0, y: 0 }, itemStyler.set);

      function startTracking() {
        pointer(itemXY.get()).start(itemXY);
      }

      function stopTracking() {
        spring({
          from: itemXY.get(),
          velocity: itemXY.getVelocity(),
          stiffness: 200,
          damping: 10,
        })
          .start(itemXY)
         // .stop(console.log(1));
      }

      listen(item, "mousedown touchstart").start(startTracking);
      listen(document, "mouseup touchend").start(stopTracking);
    });

    console.log(this.itemsConfig);
  },
  methods: {
    fullScreenOn() {
      if (this.element) return;
      toggleFullScreen();
    },
    startTracking(ref) {
      console.log(this.$refs[ref]);
    },
  },
  computed: {
    ...mapGetters({
      content: "content/getContent",
    }),
    sizePicture() {
      return (
        "width: " + this.size.width + "px; height: " + this.size.height + "px;"
      );
    },
    heightDropArea() {
      return "padding-top: " + this.dropAreaBottom + "px;";
    },
  },
};
</script>

<style lang="scss" scoped>
.back-video {
  width: 100vw;
  height: 100vh;
}
.wrapper {
  width: 100%;
  height: 100vh;
  background-color: black;
  position: relative;
}

.content {
  width: 100%;
  min-height: 100vh;
  background-color: black;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  // overflow: hidden;
  border: 3px solid transparent;
  //touch-action: none;
  & > .img {
    width: 400px;
    height: 280px;
    margin: 10px;
    & > .img {
      & > .iframe {
        pointer-events: none;
      }
      & > img {
        pointer-events: none;
      }
    }
  }

  & > .active {
    border: 2px solid white;
  }
}
.img {
  width: 400px;
  height: 280px;
}
.scroll {
  position: fixed;
  right: 0;
  top: 0;
  width: 30px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.13);
  touch-action: auto;
  z-index: 1000;
}
</style>
