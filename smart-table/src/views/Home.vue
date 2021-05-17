<template>
  <div class="wrapper">
    <div
      class="content"
      @dragstart="dragOff"
      :style="'padding-top: ' + dropAreaBottom + 'px;'"
    >
      <div class="dropArea" ref="dropArea"></div>
      <div
        class="img num1"
        v-for="img in content"
        :key="img.url"
        :style="'width: ' + size.width + 'px; height: ' + size.height + 'px;'"
      >
        <img
          :style="'width: ' + size.width + 'px; height: ' + size.height + 'px;'"
          :src="img.url"
          class="img"
          alt="img"
          :ref="img.ref"
          v-touch:press="start()"
          v-touch:drag="move()"
          v-touch:release="() => drop()"
          @mousemove="() => {}"
          :draggable="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        { url: require("@/assets/images/Thumb1.jpg"), ref: "img1" },
        { url: require("@/assets/images/Thumb2.jpg"), ref: "img2" },
        { url: require("@/assets/images/Thumb3.jpg"), ref: "img3" },
      ],
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
    start() {
      return (e) => {
        this.element = {};
        this.element.el = e.target;
        this.element.x = this.getCoords(this.element.el).left;
        this.element.y = this.getCoords(this.element.el).top;
      };
    },
    move() {
      return (e) => {
        console.log(e);
        if (!this.element) return;
        this.element.el.style.position = "absolute";
        this.element.el.style.zIndex = 1000;
        this.element.el.style.left =
          e.changedTouches[0].pageX - this.element.el.offsetWidth / 2 + "px";
        this.element.el.style.top =
          e.changedTouches[0].pageY - this.element.el.offsetHeight / 2 + "px";
        if (e.changedTouches[0].pageY < this.dropAreaBottom / 1.5) this.drop();
      };
    },
    drop() {
      if (!this.element) return;
      this.element.el.style.left = this.element.x + "px";
      this.element.el.style.top = this.element.y + "px";
      this.element.el.style.position = "static";
      this.element.el.style.zIndex = 10;
      this.element = null;
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
