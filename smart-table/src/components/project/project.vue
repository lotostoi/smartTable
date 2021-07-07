<template>
  <div class="wrapper-project">
    <div class="id">
      <strong>id: </strong> <span>{{ project._id }}</span>
    </div>
    <div class="title">
      <strong>Project name: </strong> <span>{{ project.name }}</span>
    </div>
    <hr class="line" />
    <h4>Items</h4>
    <p class="items-message" v-if="!project.items.length">This project is empty...</p>
    <div class="items-lits">
      <Item v-for="item in project.items" :key="item.id" :item="item" />
    </div>
    <AddItem :projectId="project._id" />
    <hr class="line" />
    <div class="remove">
      <label for="remove-project"> Are you sure that you want to delete this project? </label>
      <input type="checkbox" id="remove-project" v-model="isComfirmed" />
      <button @click.prevent="removeProject(project._id)" :disabled="!isComfirmed || isLoad">
        {{ !isLoad ? "Remove project" : "Loading..." }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AddItem from "@/components/add-item";
import Item from "@/components/item";
export default {
  components: { AddItem, Item },
  data() {
    return {
      isComfirmed: false,
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      isLoad: "content/isLoad",
    }),
  },
  methods: {
    ...mapActions({
      removeProject: "content/removeProject",
    }),
  },
};
</script>
<style lang="scss" scoped>
.line {
  width: 100%;
}
h4 {
  margin: 10px auto;
}
.wrapper-project {
  display: flex;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px auto;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid gray;
  border-radius: 10px;
}
.remove {
  display: flex;
  align-items: center;
  & > label {
    font-size: 0.6rem;
  }
  & > button {
    cursor: pointer;
    background-color: red;
    outline: none;
    border: none;
    border-radius: 5px;
    padding: 5px;
    color: white;
  }
  & > button:disabled {
    cursor: not-allowed;
    background-color: rgba(163, 163, 163, 0.548);
    color: white;
  }
}
.items-message {
  margin: 10px auto;
  padding: 0;
}
.items-lits {
  width: 100%;
  box-sizing: border-box;
}
</style>
