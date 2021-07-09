<template>
  <div class="wrapper">
    <h3>All projects</h3>
    <div class="wrapper-projects">
      <Project v-for="project in projects" :key="project._id" :project="project" />
    </div>
    <h3>Add Project</h3>
    <button @click="showWindowAddProject">Add new project</button>
    <div v-if="isOpenAddProject" class="add-project">
      <button class="close" @click.prevent="showWindowAddProject">X</button>
      <input type="text" name="name" placeholder="input project's name" v-model="project.name" />
      <small v-if="nameIsUse">This name is already busy</small>
      <div class="item" v-for="item in project.content" :key="item.link || item.file">
        <img :src="item.file" alt="img" />
      </div>
      <button
        class="create-project"
        :disabled="!project.name || nameIsUse"
        @click.prevent="addProject"
      >
        {{ !isLoad ? "Create new project" : "loading..." }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Project from "@/components/project";
export default {
  components: { Project },
  data() {
    return {
      isOpenAddProject: false,
      project: {
        name: "",
        content: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      isLoad: "content/isLoad",
      projects: "content/getProjects",
    }),
    nameIsUse() {
      console.log(this.projects.some(({ name }) => name === this.project.name));
      return this.projects.some(({ name }) => name === this.project.name);
    },
  },
  methods: {
    showWindowAddProject() {
      this.isOpenAddProject = !this.isOpenAddProject;
    },
    async addProject() {
      await this.$store.dispatch("content/addProject", this.project);
      this.showWindowAddProject();
      this.projects = {
        name: "",
        content: [],
      };
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
  border: 1px solid gray;
  border-radius: 10px;
  margin: 10px auto 30px;
  padding: 30px;
  position: relative;
  & > .close {
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }
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
small {
  margin: 10px;
  color: red;
}
</style>
