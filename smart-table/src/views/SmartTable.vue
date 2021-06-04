<template>
  <div class="smart-table">
    <transition-group
      v-for="item in content"
      :key="item.id"
      leave-active-class="leave"
      enter-active-class="enter"
      mode="out-in"
    >
      <div v-if="item.id === id">
        <img :src="item.url" alt="img" />
      </div>
    </transition-group>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io(process.env.NODE_ENV ==='development' ? "http://localhost:3000/" : "");
/* eslint-enable no-unused-vars */

export default {
  data() {
    return {
      id: 1,
    };
  },
  mounted() {
    socket.on("show-next-page", ({ id }) => (this.id = id));
  },
  computed: {
    ...mapGetters({
      content: "content/getContent",
    }),
  },
};
</script>
<style lang="scss" >
@keyframes leave-page {
  from {
    z-index: 100;
  }
  to {
    z-index: 100;
  }
}

@keyframes enter-page {
  from {
    z-index: 500;
    transform: scale(0);
    // transform: translateY(100%);
  }

  to {
    transform: scale(1);
    z-index: 500;
    // transform: translateX(0);
  }
}
.leave {
  z-index: 100;
  animation: leave-page 0.3s linear forwards;
}

.enter {
  transform-origin: 50% 100% 0;
  z-index: 500;
  animation: enter-page 0.3s linear forwards;
}

.smart-table {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  & > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    z-index: 10;
  }
  & > div > img {
    height: 100vh;
    width: 100vw;
  }
}
</style>

