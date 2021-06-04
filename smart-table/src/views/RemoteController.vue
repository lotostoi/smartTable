<template>
  <div class="wrapper" @mouseup="drop(img)" @touchend="drop(img)">
    <div class="content" @dragstart="dragOff" :style="heightDropArea">
      <div class="dropArea" ref="dropArea"></div>
      <div
        class="img num1"
        v-for="img in content"
        :key="img.url"
        :style="sizePicture"
        @mouseup="drop(img)"
        @touchend="drop(img)"
        :class="{ active: img.active }"
      >
        <img
          :style="sizePicture"
          :src="img.url"
          class="img"
          alt="img"
          :ref="img.ref"
          @mouseup="drop(img)"
          @mousedown="start($event)"
          @mousemove="move($event, img)"
          @touchstart="start($event)"
          @touchmove="move($event, img)"
          @transitionend="endMove($event, img)"
          :draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io(process.env.NODE_ENV ==='development'  ? "http://localhost:3000/": '');

/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      element: null,
      dropAreaBottom: 100,
      size: {},
      track: [],
      endFirstAnim: {},
      lastTik: false,
    };
  },
  mounted() {
    this.dropAreaBottom = (document.documentElement.clientHeight * 15) / 100;
    const startWidth = (document.documentElement.clientWidth * 25) / 100;
    this.size = {
      width: startWidth > 200 ? startWidth : 200,
      height: (startWidth > 200 ? startWidth : 200) / 1.5,
    };
  },
  methods: {
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
      };
    },
    dragOff() {
      return false;
    },
    start(e) {
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      this.element = {};
      this.element.el = e.target;
      this.element.x = this.getCoords(this.element.el).left;
      this.element.y = this.getCoords(this.element.el).top;
      this.startMove = new Date();
      console.log(event.pageX, event.pageY);
    },
    move(e) {
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      if (!this.element) return;
      this.element.el.style.position = "absolute";
      this.element.el.style.zIndex = 1000;
      this.element.el.style.left =
        event.pageX - this.element.el.offsetWidth / 2 + "px";
      this.element.el.style.top =
        event.pageY - this.element.el.offsetHeight / 2 + "px";

      this.track.push({
        x: event.pageX - this.element.el.offsetWidth / 2,
        y: event.pageY - this.element.el.offsetHeight / 2,
        time: new Date(),
      });
    },
    endMove(e, img) {
      console.log(e.target.offsetTop, e.target.clientHeight);
      if (e.target.offsetTop + e.target.clientHeight < 0) {
        socket.emit("change-page", img);
        this.content.map((el) => {
          if (el.id == img.id) {
            el.active = true;
          } else {
            el.active = false;
          }
        });
        e.target.style.display = "none";
        setTimeout(() => {
          e.target.style.display = "flex";
        }, 1000);
      }
      e.target.style.transition = "left 0ms ease-out, top 0ms ease-out";
      e.target.style.position = "static";

      this.element = null;
      this.track = [];
    },
    drop() {
      if (!this.element) return;
      this.calcRtac();
    },

    calcRtac() {
      const endTime = new Date();

      if (this.track.length) {
        let { x: x1, y: y1, time: time1 } =
          this.track.length > 20
            ? this.track[this.track.length - 10]
            : this.track[0];
        let { x: x2, y: y2, time: time2 } = this.track[this.track.length - 1];

        console.log(endTime - time2, "time");
        let xLength, yLength, time;
        xLength = x2 - x1;
        yLength = y2 - y1;
        time = time2 - time1;

        if (endTime - time2 < 20) {
          this.element.el.style.transition =
            "left 500ms ease-out, top 500ms ease-out";
          this.element.el.style.left = `${x2 + (xLength * 100) / time}px`;
          this.element.el.style.top = `${y2 + (yLength * 100) / time}px`;
        } else {
          this.element.el.style.transition =
            "left 0ms ease-out, top 0ms ease-out";
          this.element.el.style.position = "static";
        }
      }
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
  width: 100vw;
  height: 100vh;
  background-color: black;
  position: relative;
}
.dropArea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 15vh;
  border: 1px solid gray;
  box-sizing: border-box;
}
.content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  box-sizing: border-box;
  overflow: hidden;
  border: 3px solid transparent;
  & > .img {
    width: 400px;
    height: 280px;
    margin: 10px;
  }
  & > .active {
    border: 2px solid white;
  }
}
.img {
  width: 400px;
  height: 280px;
}
</style>
