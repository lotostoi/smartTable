<template>
  <div class="wrapper">
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
          @mousemove="move($event,img)"
          @touchstart="start($event)"
          @touchmove="move($event,img)"
          v-touch:release="() => drop(img)"
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

/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      element: null,
      dropAreaBottom: 100,
      size: {},
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
      this.element.x = this.getCoords(this.element.el).left;
      this.element.y = this.getCoords(this.element.el).top;
    },
    move(e, img) {
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      if (!this.element) return;
      this.element.el.style.position = "absolute";
      this.element.el.style.zIndex = 1000;
      this.element.el.style.left =
        event.pageX - this.element.el.offsetWidth / 2 + "px";
      this.element.el.style.top =
        event.pageY - this.element.el.offsetHeight / 2 + "px";
      if (event.pageY < this.dropAreaBottom / 1.5) {
        socket.emit("change-page", img);
        this.drop();
      }
    },
    drop() {
      if (!this.element ) return;
      this.element.el.style.left = this.element.x + "px";
      this.element.el.style.top = this.element.y + "px";
      this.element.el.style.position = "static";
      this.element.el.style.zIndex = 10;
      this.element = null;
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
  }
}
.img {
  width: 400px;
  height: 280px;
}
</style>
