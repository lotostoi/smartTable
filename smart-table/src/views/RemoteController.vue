// eslint-disable-next-line
<template>
  <div class="wrapper">
    <!--  <div class="scroll"></div> -->
    <button class="fulscreen" @touchstart="fullScreenOn" />
    <div class="content" @dragstart="dragOff">
      <div
        v-for="img in content"
        :key="img.url"
        class="img num1"
        :style="sizePicture"
        :class="{ active: img.active }"
      >
        <div
          v-if="img.type === 'image'"
          :ref="img.projectId"
          :style="sizePicture"
          :draggable="false"
          class="img"
          @touchstart="start($event, img)"
          @touchmove="move($event, img)"
          @touchend="drop(img)"
          @transitionend="endMove($event, img)"
          @animationend="endAnimation(img)"
          @scroll.stop.prevent
        >
          <img :src="`/api/files/${img.fileName}`" alt="img" />
        </div>
        <div
          v-if="img.type === 'video'"
          :ref="img.projectId"
          :style="sizePicture"
          :draggable="false"
          class="img"
          @touchstart="start($event, img)"
          @touchmove="move($event, img)"
          @touchend="drop(img)"
          @transitionend="endMove($event, img)"
          @animationend="endAnimation(img)"
          @scroll.stop.prevent
        >
          <video alt="img" preload="auto" :ref="img.projectId">
            <source :src="`/api/files/${img.fileName}`" />
          </video>
        </div>
        <div
          v-if="img.type === 'iframe'"
          class="img"
          :style="sizePicture"
          :draggable="false"
          @touchstart="start($event, img)"
          @touchmove="move($event, img)"
          @touchend="drop(img)"
          @transitionend="endMove($event, img)"
          @animationend="endAnimation(img)"
          @scroll.stop.prevent
        >
          <iframe
            :ref="img.projectId"
            seamless
            allowtransparency
            scrolling="no"
            :src="img.link"
            class="iframe"
            alt="img"
            :draggable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io(process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "");

import { toggleFullScreen, Spring } from "@/lib";

/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      element: null,
      size: {},
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
      startX: 0,
      startY: 0,
      currentItem: null,
      items: new Map(),
      newConfig: null,
    };
  },
  watch: {
    newConfig(newValue) {
      console.log(newValue);
    },
  },
  mounted() {
    const startWidth = (document.documentElement.clientWidth * 25) / 100;
    this.size = {
      width: startWidth > 200 ? startWidth : 200,
      height: (startWidth > 200 ? startWidth : 200) / 1.5,
    };
    socket.on("update-content", () => {
      this.$store.dispatch("content/getProjects");
    });
    socket.on("update-config", (config) => {
      this.newConfig = config;
    });
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
        top: box.top,
        left: box.left,
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
      this.dubleClick();

      const item = this.initItem(img);

      if (item.leftSpring && item.topSpring) {
        item.leftSpring.stopAnimation();
        item.topSpring.stopAnimation();
      }

      item.currentItem = img;
      item.isDragging = true;
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];

      item.startX = this.getCoords(event.target).left;
      item.startY = this.getCoords(event.target).top;

      item.domElement = e.target;

      item.initialX = event.clientX - item.realX;
      item.initialY = event.clientY - item.realY;
      const newItem =
        item.domElement.querySelector("img") ||
        item.domElement.querySelector("iframe") ||
        item.domElement.querySelector("video");

      item.conf = this.conf;

      if (!this.isDublClick) {
        newItem.classList.add("big-scale");
      }

      if (this.isDublClick) {
        newItem.classList.remove("big-scale");
        item.isDragging = false;
        item.domElement.style.animation = "fly-top 800ms ease-out";
        setTimeout(() => {
          socket.emit("change-page", item.currentItem);
          this.content.map((el) => {
            if (el.id == item.currentItem.id) {
              el.active = true;
            } else {
              el.active = false;
            }
          });
        }, 200);
      }
    },

    updateImgContainerStyles({ domElement, realX, realY }) {
      domElement.style.transform = `translate(${realX}px, ${realY}px)`;
    },
    setImgInTheFirstPlace({ domElement }) {
      domElement.style.transform = `translate(${0}px, ${0}px)`;
      domElement.style.opacity = `1`;
    },
    hideImg({ domElement }) {
      domElement.style.opacity = `0`;
    },

    getSpeed(item, field) {
      let speedSum = 0;
      let dividerSum = 0;

      let slicedPoints = item.dragPoints.slice(-17);

      slicedPoints.forEach((point, idx) => {
        const prevPoint = slicedPoints[idx - 1];

        if (!prevPoint) {
          return;
        }

        const speed =
          (point[field] - prevPoint[field]) /
          ((point.timestamp - prevPoint.timestamp) / item.conf.speed);
        const alpha = 1 / (slicedPoints.length - idx) ** 2;

        speedSum += speed * alpha;
        dividerSum += alpha;
      });

      return speedSum / dividerSum;
    },

    move(e, { id }) {
      const item = this.items.get(id);
      if (!item.isDragging) return;
      const event = e instanceof MouseEvent ? e : e.changedTouches[0];
      item.realX = event.clientX - item.initialX;
      item.realY = event.clientY - item.initialY;
      item.dragPoints.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: performance.now(),
      });
      this.updateImgContainerStyles(item);
    },

    drop({ id }) {
      const item = this.items.get(id);
      if (!item.isDragging) {
        return;
      }
      const newItem =
        item.domElement.querySelector("img") ||
        item.domElement.querySelector("iframe") ||
        item.domElement.querySelector("video");
      newItem.classList.remove("big-scale");
      const xSpeed = this.getSpeed(item, "x");
      const ySpeed = this.getSpeed(item, "y");
      item.leftSpring = new Spring({
        ...item.conf,
        from: item.realX,
        to: 0,
        initVelocity: xSpeed,
        onStop: () => this.stop(item),
        onUpdate: ({ value }) => {
          item.realX = value;
          this.updateImgContainerStyles(item);
        },
      });

      item.topSpring = new Spring({
        ...item.conf,
        realY: item.realY,
        initVelocity: ySpeed,
        from: item.realY,
        to: 0,
        onStop: () => this.stop(item, "y"),
        onUpdate: ({ value }) => {
          item.realY = value;
          this.updateImgContainerStyles(item);
        },
      });

      item.leftSpring.startAnimation();
      item.topSpring.startAnimation();
      item.dragPoints = [];
      item.isDragging = false;
      // this.items.delete(id);
    },

    endAnimation({ id }) {
      const { domElement } = this.items.get(id);
      domElement.style.animation = "";
      this.items.delete(id);
    },

    stop(item = {}, axis = "x") {
      if (
        item.realY < -item.startY - item.domElement.offsetHeight ||
        item.realX < -item.startX - item.domElement.offsetWidth ||
        item.realX > item.startX + item.domElement.offsetWidth
      ) {
        if (axis === "y") {
          this.hideImg(item);
          setTimeout(() => {
            this.setImgInTheFirstPlace(item);
            item.realX = 0;
            item.realY = 0;
            item.initialX = 0;
            item.initialY = 0;
            item.startX = 0;
            item.startY = 0;
            socket.emit("change-page", item.currentItem);
            this.content.map((el) => {
              if (el.id == item.currentItem.id) {
                el.active = true;
              } else {
                el.active = false;
              }
            });
            item.dragPoints = [];
            item.isDragging = false;
          }, 300);
        }
        return true;
      } else {
        return false;
      }
    },
    initItem({ id }) {
      const defaultItem = {
        domElement: null,
        realX: 0,
        realY: 0,
        initialX: 0,
        initialY: 0,
        isDragging: false,
        dragPoints: [],
        leftSpring: null,
        topSpring: null,
        startX: 0,
        startY: 0,
        currentItem: null,
        moved: false,
        conf: null,
      };
      if (this.items.has(id)) return this.items.get(id);
      this.items.set(id, defaultItem);
      return this.items.get(id);
    },
  },
  computed: {
    ...mapGetters({
      config: "content/getConfig",
      projects: "content/getProjects",
    }),
    content() {
      const projectName = this.$route.params.projectName.trim();
      const project = this.projects.find(({ name }) => name === projectName);
      return project ? project.items : [];
    },
    conf() {
      return (
        this.newConfig ||
        this.config || {
          friction: 2,
          tension: 5,
          mass: 0.4,
          speed: 1000,
        }
      );
    },
    sizePicture() {
      return "width: " + this.size.width + "px; height: " + this.size.height + "px;";
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
  }
  99% {
    transform: translate(0, -100vh);
    opacity: 0;
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
        width: 100%;
        height: 100%;
      }
      & > video {
        pointer-events: none;
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 255);
        & > source {
          pointer-events: none;
        }
      }
      & > img {
        pointer-events: none;
        width: 100%;
        height: 100%;
      }
    }
  }

  .big-scale {
    transform: scale(1.15);
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
