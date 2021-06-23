<template>
  <div class="wrapper">
    <div class="scroll"></div>
    <div class="content" @dragstart="dragOff">
      <div
        class="img num1"
        v-for="img in content"
        :key="img.url"
        :style="sizePicture"
        :class="{ active: img.active }"
        
      >
        <img
          v-if="img.type === 'image'"
          :style="sizePicture"
          :src="img.url"
          class="img"
          alt="img"
          :ref="img.ref"
          @touchstart="start($event)"
          @touchmove="move($event, img)"
          @transitionend="endMove($event, img)"
          :draggable="false"
        />
        <!--  <div
          class="img"
          :style="sizePicture"
          v-if="img.type === 'link'"
          @mousedown.prevent="start($event)"
          @mousemove.prevent="move($event, img)"
          @touchstart.prevent="start($event)"
          @touchmove.prevent="move($event, img)"
          @transitionend.prevent="endMove($event, img)"
          :draggable="false"
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
const socket = io(
  process.env.NODE_ENV === "development" ? "http://localhost:3000/" : ""
);

import toggleFullScreen from "@/lib";

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
      isDublClick: false,
      lastMomentClick: new Date(),
    };
  },
  mounted() {
    this.dropAreaBottom = (document.documentElement.clientHeight * 15) / 100;
    const startWidth = (document.documentElement.clientWidth * 25) / 100;
    this.size = {
      width: startWidth > 200 ? startWidth : 200,
      height: (startWidth > 200 ? startWidth : 200) / 1.5,
    };
    document.addEventListener("touchend", this.drop.bind(this));
    document.addEventListener("mouseup", this.drop.bind(this));
  },
  onUnmounted() {
    document.removeEventListener("touchend", this.drop.bind(this));
    document.removeEventListener("mouseup", this.drop.bind(this));
  },

  methods: {
    dubleClick() {
      const newDateClick = new Date();
      this.isDublClick = newDateClick - this.lastMomentClick < 300;
      this.lastMomentClick = newDateClick;
    },

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
    fullScreenOn() {
      if (this.element) return;
      toggleFullScreen();
    },
    start(e) {
      this.dubleClick();
      this.isMous = true;
      this.typeEvent = e instanceof MouseEvent ? "mous" : "touch";
      this.element = {};
      this.element.el = e.target;
      this.element.x = this.getCoords(this.element.el).left;
      this.element.y = this.getCoords(this.element.el).top;
      this.startMove = new Date();
      if (this.isDublClick) {
        this.setAnim(this.element.x, -500);
      }
    },
    move(e) {
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      if (!this.element || !this.isMous) return;
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
      console.log("end-anim");
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
      console.log(111);
      if (!this.element || !this.isMous) return;
      this.isMous = false;
      this.calcTrac();
    },

    setAnim(x, y) {
      this.element.el.style.position = "absolute";
      this.element.el.style.transition = `left ${400}ms ease-out, top ${400}ms ease-out`;
      setTimeout(() => {
        this.element.el.style.left = `${x}px`;
        this.element.el.style.top = `${y}px`;
      }, 50);
    },
    endAnim({ target }) {
      target.style.transition = "left 0ms ease-out, top 0ms ease-out";
      target.style.position = "static";
    },
    calcTrac() {
      const endTime = new Date();

      if (this.track.length) {
        let {
          x: x1,
          y: y1,
          time: time1,
        } = this.track.length > 20
          ? this.track[this.track.length - 5]
          : this.track[0];
        let { x: x2, y: y2, time: time2 } = this.track[this.track.length - 1];

        let xLength, yLength, time;
        xLength = x2 - x1;
        yLength = y2 - y1;
        time = time2 - time1;

        const k = this.typeEvent === "touch" ? 400 : 200;

        if (endTime - time2 < 20) {
          this.setAnim(x2 + (xLength * k) / time, y2 + (yLength * k) / time);
        } else {
          this.element.el.style.transition = "left 0ms ease-out, top 0ms ease-out";
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
  touch-action: none;
  & > .img {
    width: 400px;
    height: 280px;
    margin: 10px;
    & > .img {
      & > .iframe {
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
  width: 40px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.13);
  touch-action: auto;
  z-index: 1000;
}
</style>
