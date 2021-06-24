<template>
  <div class="wrapper">
    <!--  <div class="scroll"></div> -->
    <button class="fulscreen" @touchstart="fullScreenOn"></button>
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
          @touchstart="start($event, img)"
          @touchmove="move($event, img)"
          @transitionend="endMove($event, img)"
          @animationend="endAnimation"
          @scroll.stop.prevent
          :draggable="false"
        />
        <!--  <div
          class="img"
          :style="sizePicture"
          v-if="img.type === 'link'"
          @touchstart="start($event, img)"
          @touchmove="move($event, img)"
          @transitionend="endMove($event, img)"
          @animationend="endAnimation"
          @animationiteration="test"
          @scroll.stop.prevent
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

import { toggleFullScreen, Spring } from "@/lib";

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
      realX: 0,
      realY: 0,
      initialX: 0,
      initialY: 0,
      isDragging: false,
      dragPoints: [],
      leftSpring: null,
      topSpring: null,
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
      this.dubleClick();
      if (this.element) return;
      if (this.isDublClick) {
        toggleFullScreen();
      }
    },
    start(e, img) {
      if (this.leftSpring && this.topSpring) {
        this.leftSpring.stopAnimation();
        this.topSpring.stopAnimation();
      } 
      this.isDragging = true;
      this.dubleClick();
      this.typeEvent = e instanceof MouseEvent ? "mous" : "touch";
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      this.element = {};
      this.element.typeAnim = null;
      this.element.el = e.target;
      this.initialX = event.clientX - this.realX;
      this.initialY = event.clientY - this.realY;

      //  this.updateImgContainerStyles();
      if (this.isDublClick) {
        this.element.typeAnim = "flyTop";
        this.element.el.style.animation = "fly-top 400ms ease-out";
        setTimeout(() => {
          socket.emit("change-page", img);
          this.content.map((el) => {
            if (el.id == img.id) {
              el.active = true;
            } else {
              el.active = false;
            }
          });
        }, 200);
      }
    },
    updateImgContainerStyles() {
      this.element.el.style.transform = `translate(${this.realX}px, ${this.realY}px)`;
    },
    setImgInTheFirstPlace() {
      this.element.el.style.transform = `translate(${0}px, ${0}px)`;
    },

    getSpeed(field) {
      let speedSum = 0;
      let dividerSum = 0;

      let slicedPoints = this.dragPoints.slice(-17);

      slicedPoints.forEach((point, idx) => {
        const prevPoint = slicedPoints[idx - 1];

        if (!prevPoint) {
          return;
        }

        const speed =
          (point[field] - prevPoint[field]) /
          ((point.timestamp - prevPoint.timestamp) / 1000);
        const alpha = 1 / (slicedPoints.length - idx) ** 2;

        speedSum += speed * alpha;
        dividerSum += alpha;
      });

      return speedSum / dividerSum;
    },

    move(e) {
      if (!this.isDragging) return;
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      this.realX = event.clientX - this.initialX;
      this.realY = event.clientY - this.initialY;
      this.dragPoints.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: performance.now(),
      });
      this.updateImgContainerStyles();
    },

    drop() {
      if (!this.isDragging) {
        return;
      }

      const xSpeed = this.getSpeed("x");
      const ySpeed = this.getSpeed("y");

      const springConfig = {
        friction: 2,
        tension: 5,
        mass: 0.4,
      };

      this.leftSpring = new Spring({
        ...springConfig,
        realY: this.realY,
        from: this.realX,
        to: 0,
        initVelocity: xSpeed,
        onUpdate: ({ value }) => {
          this.realX = value;

          this.updateImgContainerStyles();
        },
      });

      this.topSpring = new Spring({
        ...springConfig,
        realY: this.realY,
        axis: "y",
        initVelocity: ySpeed,
        from: this.realY,
        to: 0,
        onUpdate: ({ value }) => {
          this.realY = value;

          this.updateImgContainerStyles();
        },
      });

      this.leftSpring.startAnimation();
      this.topSpring.startAnimation();

      this.dragPoints = [];
      this.isDragging = false;
    },

    endAnimation() {
      this.element.typeAnim = "flyTop";
      this.element.el.style.animation = "";
      this.element = {};
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

<style lang="scss">
.fulscreen {
  position: fixed;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  z-index: 1000;
  opacity: 0;
}

@keyframes fly-top {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(0, -100vh);
    opacity: 0;
  }
  99% {
    transform: translate(0, -100vh);
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}
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
  // touch-action: none;
  & > .img {
    width: 400px;
    height: 280px;
    margin: 10px;
    touch-action: none;
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
