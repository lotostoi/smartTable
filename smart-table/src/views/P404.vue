<template>
  <div class="wrapper">
    <p>404</p>
    <router-link :to="{ name: 'admin' }">Go to admin</router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  max-width: 1000px;
  height: 80vh;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  & > p {
    font-size: 20vh;
  }
  & > a {
    font-size: 1rem;
  }
}
</style>
