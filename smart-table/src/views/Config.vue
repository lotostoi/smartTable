<template>
  <form @submit.prevent="save">
    <div v-for="field in fields" :key="field.name">
      <label :for="field.name">{{ field.name }}: </label>
      <input
        type="number"
        :name="field.name"
        :placeholder="field.name"
        v-model="field.value"
        :id="field.name"
        step="0.01"
      />
      <small v-if="field.isValied && startValid" style="color: red">{{
        field.errorMessege
      }}</small>
    </div>

    <button :disabled="isDisabled">Save</button>
  </form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fields: [],
      startValid: false,
    };
  },
  methods: {
    save() {
      console.log(1);
      const newConfig = new FormData();
      Object.values(this.fields).forEach((f) => {
        const { name: key, value } = f;
        console.log(key, value);
        newConfig.append(key, value);
      });
      this.$store.dispatch("content/updateConfig", newConfig);
    },
    valid(field) {
      this.startValid = true;
      field.isValied = parseInt(field.value);
    },
  },
  computed: {
    ...mapGetters({
      config: "content/getConfig",
    }),
    isDisabled() {
      return this.fields.some(({ value }) => value === "");
    },
  },
  mounted() {
    this.$nextTick().then(() => {
      Object.keys(this.config).forEach((field) => {
        this.fields.push({
          name: field,
          value: this.config[field],
        });
      });
    });
  },
};
</script>
<style lang="scss" scoped>
form {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  margin: 100px auto;
  & > div {
    display: flex;
    flex-direction: column;
    & > input {
      min-height: 30px;
      margin: 10px 0;
    }
  }
  & > button {
    margin: 10px 0;
    min-height: 40px;
  }
}
</style>
