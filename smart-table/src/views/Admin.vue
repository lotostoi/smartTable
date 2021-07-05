<template>
  <div class="wrapper">
    <h1>Add Project</h1>
    <button @click="showWindowAddProject">Add new project</button>
    <form v-if="isOpenAddProject" class="add-project">
      <input type="text" name="name" placeholder="input project's name" v-model="project.name" />
      <div class="item" v-for="item in project.content" :key="item.link || item.file">
        <img :src="item.file" alt="img" />
      </div>
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
          name="file"
          @change="item.file = $event.target.value"
        />
        <input
          v-if="item.type === 'iframe'"
          type="text"
          name="link"
          v-model="item.link"
          placeholder="Input link to iframe"
        />
        <button class="add-item" @click.prevent="addItem">add</button>
      </div>
      <button class="add-item" @click.prevent="isOpenAddItem = !isOpenAddItem">
        {{ !isOpenAddItem ? "add item" : "close" }}
      </button>
      <button
        class="create-project"
        :disabled="!project.name || !project.content.length"
        @click.prevent="$store.dispatch('content/addProject', project)"
      >
        Create new project
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpenAddProject: false,
      isOpenAddItem: false,
      project: {
        name: "",
        content: [],
      },
      item: {
        type: "image",
        file: null,
        link: null,
      },
    };
  },
  methods: {
    showWindowAddProject() {
      this.isOpenAddProject = !this.isOpenAddProject;
    },
    addItem() {
      this.project.content.push({ ...this.item });
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
