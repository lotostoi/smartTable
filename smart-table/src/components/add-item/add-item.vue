<template>
  <form class="wrapper">
    <div class="wrapper-add-item" v-if="isOpenAddItem">
      <div class="choose-type">
        <label for="type-item">Choose item type</label>
        <select id="type-item" v-model="item.type">
          <option>image</option>
          <option>iframe</option>
          <option>video</option>
        </select>
      </div>
      <input
        v-if="item.type === 'image' || item.type === 'video'"
        type="file"
        name="item"
        @change="item.file = $event.target.value"
        ref="file"
      />
      <input
        v-if="item.type === 'iframe'"
        type="text"
        name="link"
        v-model="item.link"
        placeholder="Input link to iframe"
      />
      <button class="add-item" @click.prevent="addNewItem" :disabled="isDisabled">add</button>
    </div>
    <button class="add-item" @click.prevent="isOpenAddItem = !isOpenAddItem">
      {{ !isOpenAddItem ? "add item" : "close" }}
    </button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import uniqid from "uniqid";
export default {
  data() {
    return {
      isOpenAddItem: false,
      item: {
        type: "image",
        file: null,
        link: null,
      },
    };
  },
  props: {
    projectId: { type: String, required: true },
  },
  computed: {
    ...mapGetters({
      isLoad: "content/isLoad",
    }),
    isDisabled() {
      return !this.item.file && !this.item.link;
    },
  },
  methods: {
    ...mapActions({
      addItem: "content/addItem",
      removeItem: "content/removeItem",
      updateItem: "content/apdateItem",
    }),
    async addNewItem() {
      const file = new FormData(this.$el);
      const description = this.item;
      Object.keys(description).forEach((key) => {
        file.append(key, description[key]);
      });
      await this.addItem({ id: uniqid(), projectId: this.projectId, file });
      this.item = {
        type: "image",
        file: null,
        link: null,
      };
      this.isOpenAddItem = !this.isOpenAddItem;
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  outline: none;
  width: 100%;
  max-width: 800px;
  margin: 10px auto;
}

.wrapper {
  background-color: white;
  height: auto;
}
.add-project {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  width: 100%;
  max-width: 900px;
}
.wrapper-add-item {
  padding: 20px 0;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 5px;
  width: 100%;
  margin: 10px auto;
}
.add-item {
  margin: 10px auto;
}
.choose-type {
  width: 100%;
  display: flex;
  justify-content: center;
  & > label {
    margin-right: 10px;
  }
}
</style>
