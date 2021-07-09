<template>
  <div class="smart-table">
    <transition-group
      v-for="item in content"
      :key="item.id"
      leave-active-class="leave"
      enter-active-class="enter"
      mode="out-in"
    >
      <div v-if="item.id === id" :class="animType">
        <img
          v-if="item.type === 'image'"
          :src="`/api/files/${item.fileName}`"
          alt="img"
          class="img"
        />
        <iframe
          v-if="item.type === 'iframe'"
          :class="animType"
          :src="item.link"
          alt="img"
          class="img"
        />
        <video
          v-if="item.type === 'video'"
          :ref="item.ref"
          :class="animType"
          :src="item.url"
          alt="img"
          class="img"
          controls
          autoplay
          preload="auto"
          loop
        >
          <source :src="`/api/files/${item.fileName}`" />
        </video>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { io } from "socket.io-client";
const socket = io(process.env.NODE_ENV === "development" ? "http://localhost:3000/" : "");

export default {
  data() {
    return {
      id: null,
    };
  },
  computed: {
    ...mapGetters({
      projects: "content/getProjects",
    }),
    content() {
      const projectName = this.$route.params.projectName.trim();
      const project = this.projects.find(({ name }) => name === projectName);
      return project ? project.items : [];
    },
    startId() {
      return this.content[0].id;
    },
    animType() {
      console.log(this.$route.params.aminType);
      return this.$route.params.aminType === "bot" || this.$route.params.aminType === "center"
        ? this.$route.params.aminType
        : "bot";
    },
  },
  mounted() {
    socket.on("update-content", () => {
      this.$store.dispatch("content/getProjects");
    });
    this.id = this.startId;
    socket.on("show-next-page", ({ id }) => {
      this.id = id;
      const currentItem = this.content.find(({ id }) => id === this.id);
      if (currentItem.type === "video") {
        setTimeout(() => {
          this.$refs[currentItem.ref]?.play();
        }, 10);
      }
    });
  },
};
</script>
<style lang="scss">
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
  z-index: 500;
  animation: enter-page 0.3s linear forwards;
}
.enter-center {
  z-index: 500;
  animation: enter-page 0.3s linear forwards;
}

.bot {
  transform-origin: 50% 100% 0;
}
.center {
  transform-origin: 50% 50% 0;
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
  & > div > iframe {
    height: 100vh;
    width: 100vw;
  }
  & > div > video {
    height: 100vh;
    width: 100vw;
  }
}
</style>
