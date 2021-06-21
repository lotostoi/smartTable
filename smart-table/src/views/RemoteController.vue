<template>
  <div class="wrapper">
    <div class="scroll"></div>
    <div class="content">
     
    <div
        class="img num1"
        v-for="img in content"
        :key="img.url"
        :style="sizePicture"
        :class="{ active: img.active }"
        :draggable="false"
        style="transform: none;"
      >
        <img
          v-if="img.type === 'image'"
          :style="sizePicture"
          :src="img.url"
          class="img"
          alt="img"
          :ref="img.ref"
          :draggable="false"
          style="transform: none;"
        />
        <div
          class="img"
          :style="sizePicture"
          v-if="img.type === 'link'"
          :ref="img.ref"
          :draggable="false"
          style="transform: none;"
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
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
import { styler, value, listen, pointer, spring } from "popmotion";
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000/" : ""
);

function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  var cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

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
      const [name, newEl] = el;
      this.itemsConfig[name] = {};

      this.itemsConfig[name].elStyler = styler(newEl);
      const elStyler = this.itemsConfig[name].elStyler;

      const elXY = (this.itemsConfig[name].elXY = value(
        { x: 300, y: 200 },
        elStyler.set
      ));
      const startTracking = (this.itemsConfig[name].startTracking = pointer(
        elXY.get()
      ).start(elXY));
      const stopTracking = (this.itemsConfig[name].stopTracking = spring({
        from: elXY.get(),
        velocity: elXY.getVelocity(),
        stiffness: 100,
        damping: 10,
      }).start(elXY));
      listen(newEl, "mousedown touchstart").start(startTracking);
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
