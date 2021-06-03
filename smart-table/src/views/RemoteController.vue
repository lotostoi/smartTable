<template>
  <div class="wrapper" @mouseup="drop(img)" @touchend="drop(img)">
    <div class="content" @dragstart="dragOff" :style="heightDropArea">
      <div class="dropArea" ref="dropArea"></div>
      <div
        class="img num1"
        v-for="img in content"
        :key="img.url"
        :style="sizePicture"
      >
        <img
          :style="sizePicture"
          :src="img.url"
          class="img"
          alt="img"
          :ref="img.ref"
          @mousedown="start($event)"
          @mousemove="move($event, img)"
          @touchstart="start($event)"
          @touchmove="move($event, img)"
          @transitionend="endMove"
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
const socket = io("http://localhost:3000/");
const debounce = require("debounce");
/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      element: null,
      dropAreaBottom: 100,
      size: {},
      track: [],
      basePos: {},
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
      this.element = {};
      this.element.el = e.target;
      this.element.x = this.basePos.x = this.getCoords(this.element.el).left;
      this.element.y = this.basePos.y = this.getCoords(this.element.el).top;
      this.startMove = new Date();
    },
    move(e) {
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      if (!this.element) return;
      console.log(this.element);
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
    endMove(e) {
      if (this.basePos) {
        e.target.style.left = this.basePos.x + "px";
        e.target.style.top = this.basePos.y + "px";

        this.basePos = null;
        //e.target.style.transform = `translate(${this.basePos.x}px,${this.basePos.y}px)`;
      }
    },
    drop() {
      if (!this.element) return;
      /*       this.element.el.style.left = this.element.x + "px";
      this.element.el.style.top = this.element.y + "px";
      this.element.el.style.position = "static";
      this.element.el.style.zIndex = 10; */

      this.calcRtac();
    
      this.element = null;
    },

    calcRtac() {
      if (this.track.length) {
        let { x: x1, y: y1, time: time1 } =
          this.track.length > 20
            ? this.track[this.track.length - 10]
            : this.track[0];
        let { x: x2, y: y2, time: time2 } = this.track[this.track.length - 1];

        let xLength, yLength, time;
        xLength = x2 - x1;
        yLength = y2 - y1;
        time = time2 - time1;

        this.element.el.style.transform = `translate(${
          (xLength * 100) / time
        }px,${(yLength * 100) / time}px)`;
        this.track = [];
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
  & > .img {
    width: 400px;
    height: 280px;
    border: 1px solid white;
    margin: 10px;
    transition: transform 500ms;
  }
}
.img {
  width: 400px;
  height: 280px;
  transition: transform 500ms ease-out;
}
</style>
