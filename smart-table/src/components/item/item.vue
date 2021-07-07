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
      <button
        @click.prevent="
          $store.dispatch('content/removeItem', { id: item.id, projectId: item.projectId })
        "
      >
        Delete this item
      </button>
      <p>Update this item</p>
      <input
        v-if="item.type === 'image' || item.type === 'video'"
        type="file"
        name="item"
        ref="file"
        @input="file = $event.target.value"
      />
      <input
        v-if="item.type === 'iframe'"
        type="text"
        name="link"
        placeholder="Input link to iframe"
        @input="link = $event.target.value"
      />
      <button @click.prevent="update" :disabled="link && file">save</button>
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
    data() {
      return {
        link: null,
        file: null,
      };
    },
  },
  methods: {
    update() {
      this.$store.dispatch("content/updateItem", {
        id: this.item.id,
        projectId: this.item.projectId,
        file: new FormData(this.$el),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
</style>
