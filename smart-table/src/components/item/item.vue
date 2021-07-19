<template>
  <form class="wrapper-item">
    <span> id: {{ item.id }}</span>
    <div class="item" v-if="item.type === 'image'">
      <img :src="`/api/files/${item.fileName}`" alt="image" width="200" height="150" />
    </div>
    <div class="item" v-if="item.type === 'video'">
      <video alt="video" preload="auto" controls width="200" height="150">
        <source :src="`/api/files/${item.fileName}`" />
      </video>
    </div>
    <div class="item" v-if="item.type === 'iframe'">
      <iframe
        seamless
        allowtransparency
        scrolling="no"
        :src="item.link"
        alt="iframe"
        width="200"
        height="150"
      />
    </div>
    <div class="buttons">
      <button @click.prevent="slide('top')" :disabled="slideDisablid.top">
        <i class="fa fa-arrow-up" aria-hidden="true"></i>
      </button>
      <div class="remove">
        <input type="checkbox" name="comfirmed" v-model="isComfimed" />
        <button
          @click.prevent="
            $store.dispatch('content/removeItem', { id: item.id, projectId: item.projectId })
          "
          :disabled="!isComfimed"
        >
          Delete this item
        </button>
      </div>
      <p>Update this item</p>
      <div class="choose-type">
        <label>Choose item type</label>
        <select v-model="type" name="type">
          <option>image</option>
          <option>iframe</option>
          <option>video</option>
        </select>
      </div>
      <input
        v-if="type === 'image' || type === 'video'"
        type="file"
        name="item"
        ref="file"
        @input="file = $event.target.value"
      />
      <input
        v-if="type === 'iframe'"
        type="text"
        name="link"
        placeholder="Input link to iframe"
        @input="link = $event.target.value"
      />
      <div v-if="type === 'video'" class="loop">
        <label>
          <strong>Loop:</strong>
          <input v-if="castal" type="checkbox" name="loop" ref="loop" v-model="checked" />
        </label>
      </div>
      <button @click.prevent="update" :disabled="isDisabled">save</button>
      <button @click.prevent="slide('bot')" :disabled="slideDisablid.bot">
        <i class="fa fa-arrow-down" aria-hidden="true"> </i>
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    slideDisablid: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      checked: true,
      startLoop: false,
      link: null,
      file: null,
      type: "",
      isComfimed: false,
      castal: true,
    };
  },
  computed: {
    isDisabled() {
      return !this.link && !this.file && this.checked === this.startLoop;
    },
  },
  methods: {
    async update() {
      const loopValue = new FormData();
      loopValue.append("loop", this.checked);
      await this.$store.dispatch("content/updateItem", {
        id: this.item.id,
        projectId: this.item.projectId,
        file: this.file ? new FormData(this.$el) : loopValue,
      });
      this.$el.reset();
      this.file = null;
    },
    slide(direction) {
      this.$store.dispatch("content/slideItem", {
        id: this.item.id,
        projectId: this.item.projectId,
        direction,
      });
    },
  },
  watch: {
    file() {
      if (/\.(png|gif|jpe|jpg|jpeg|svg)$/.test(this.file)) {
        this.type = "image";
      } else {
        this.type = "video";
      }
    },
    item() {
      this.checked = this.startLoop = null;
      this.checked = this.startLoop = this.item.loop;
      if (this.checked) {
        this.castal = false;
        setTimeout(() => (this.castal = true), 10);
      }
    },
  },
  mounted() {
    this.checked = this.startLoop = this.item.loop;
    this.type = this.item.type;
  },
};
</script>
<style lang="scss" scoped>
.remove {
  display: flex;
  align-items: center;
  & > input {
    margin-right: 10px;
  }
  & > button {
    cursor: pointer;
    background-color: red;
    color: white;
    border: none;
    outline: none;
    border-radius: 3px;
  }
  & > button:disabled {
    background-color: rgb(141, 140, 140);
    cursor: not-allowed;
  }
}
.wrapper-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  box-sizing: border-box;
  margin: 20px 0;
  background-color: rgba(128, 128, 128, 0.404);
  padding: 10px;
  border-radius: 10px;
}
.buttons {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > button {
    margin: 10px;
  }
}
.item {
  width: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > video {
    margin-right: 5px;
  }
}
.choose-type {
  margin: 10px 0;
}
</style>
