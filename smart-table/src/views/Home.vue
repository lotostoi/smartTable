<template>
  <div class="wrapper">
    <div class="content">
      <div class="img num1">
        <img src="@/assets/images/Thumb1.jpg" class="img" alt="img" />
      </div>
      <div class="img num2">
        <img
          src="@/assets/images/Thumb1.jpg"
          class="img"
          alt="img"
          @drag="move($event)"
          @dragend="end($event)"
        />
      </div>
      <div class="img num3">
        <img src="@/assets/images/Thumb1.jpg" class="img" alt="img" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: [
        {
          tag: "video",
          url: require("@/assets/videos/first.mov"),
          ref: "first",
        },
      ],
      startValue: { x: null, y: null },
    };
  },
  mounted() {},
  methods: {
    getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
      };
    },
    move(e) {
      const el = e.target;
      el.style.cssText = "position:absolute";
      if (this.startValue.x === null) {
        this.startValue = {
          x: el.left,
          y: el.top,
        };
      }
      console.log(el.left);

      el.style.left = e.clientX - el.offsetWidth / 2 + "px";
      el.style.top = e.clientY - el.offsetHeight / 2 + "px";
    },
    end(e) {
      console.log("test");
      const el = e.target;
      el.style.left = this.startValue.x + "px";
      el.style.top = this.startValue.y + "px";
      this.startValue = {
        x: null,
        y: null,
      };
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
.content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
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
