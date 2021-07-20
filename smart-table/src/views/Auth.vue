<template>
  <div class="cont">
    <h1>Авторизация</h1>
    <form class="from">
      <p class="errorMessag" :class="error ? 'active' : ''">Не верный логин или пароль</p>
      <label for="inputLogin">Логин или email: </label>
      <input
        class="field"
        type="text"
        name="login"
        id="inputLogin"
        placeholder="Введите логин или пароль"
        v-model="username"
      />
      <label for="inputPassword">Пароль: </label>
      <input
        class="field"
        type="password"
        name="password"
        id="inputPassword"
        placeholder="Введите пароль"
        v-model="password"
      />
      <button
        type="submit"
        :class="!validForm ? 'disabled' : ''"
        :disabled="!validForm ? true : false"
        @click.prevent="toAuth"
      >
        Войти
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => ({
    username: "",
    password: "",
    save: true,
    error: false,
  }),
  components: {},
  methods: {
    ...mapActions({
      auth: "auth/auth",
    }),
    async toAuth() {
      const res = await this.auth({ username: this.username, password: this.password });
      !res && (this.error = true);
      console.log(this.error);
    },
  },
  computed: {
    validForm() {
      return this.username !== "" && this.password !== "" ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin mq($width, $type: min) {
  @if $type==max {
    $width: $width - 1px;
  }
  @media only screen and (#{$type}-width: $width) {
    @content;
  }
}

// pleceholder
@mixin placeholder {
  &::-webkit-input-placeholder {
    @content;
  }
  &:-moz-placeholder {
    @content;
  }
  &::-moz-placeholder {
    @content;
  }
  &:-ms-input-placeholder {
    @content;
  }
}

// animations

$time: 0.3s;

@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes page-leave {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100px);
  }
}

.page-leave {
  animation: page-leave $time;
}
.page-enter {
  animation: page-enter $time;
}

//shadows

@mixin grayShadow {
  & {
    -webkit-box-shadow: 0px 0px 5px 0px rgb(184, 184, 184);
    -moz-box-shadow: 0px 0px 5px 0px rgb(184, 184, 184);
    box-shadow: 0px 0px 5px 0px rgb(184, 184, 184);
  }
}

$baseBGC: #343a40;
$baseBGCOrange: rgba(133, 54, 8, 0.664);
$baseBGCGray: rgba(32, 32, 32, 0.061);

$baseWidth: 1200px;
$baseColor: rgb(58, 177, 195);

$baseColorHover: rgb(250, 133, 38);
$baseColorActive: rgb(251, 85, 63);

//light text

$lightBaseFont: rgb(224, 222, 222);
$lightHoverFont: rgb(240, 192, 148);
$lightActiveFont: rgb(255, 157, 0);

// dark text
$darkBaseFont: rgba(0, 0, 0, 0.966);
$darkHoverFont: rgb(253, 124, 4);
$darkActiveFont: rgb(255, 102, 0);

//sizes
$heightHeader: 70px;
$heightFooter: 50px;

//
$focusColor: rgba(0, 140, 255, 0.219);
$errorFocusColor: rgba(255, 0, 0, 0.267);

$disabledColor: #4253666b;
// animations

$time: 0.3s;

@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes page-leave {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100px);
  }
}

.page-leave {
  animation: page-leave $time;
}
.page-enter {
  animation: page-enter $time;
}
.cont {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.main {
  display: flex;
  width: 100%;
  max-width: $baseWidth;
  margin: 0 auto;
  padding: 10px 0;
  flex-direction: column;
  align-items: center;
}
.errorMessag {
  opacity: 0;
  text-align: left;
  color: red;
}
.errorMessag.active {
  opacity: 1;
}
h1 {
  text-align: left;
  width: 320px;
  margin: 30px 0 10px;
  font-size: 1.5rem;
}
.from {
  margin-top: 2vh;
  width: 320px;
  display: flex;
  flex-direction: column;
}
label {
  margin: 10px 0;
  width: 300px;
  display: flex;
  align-items: flex-start;
}
input.field {
  width: 300px;
  height: 50px;
  padding: 0 10px;
  outline: none;
  font-size: 0.9rem;
  border: 1px solid rgba(128, 128, 128, 0.89);
  border-radius: 3px;
  @include grayShadow;
  box-sizing: border-box;
  &:focus {
    background-color: $focusColor;
  }
  @include placeholder {
    font-size: 0.9rem;
    font-weight: 300;
  }
}
.save {
  margin: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & input {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid gray;
    &:checked {
      position: relative;
      &::before {
        position: absolute;
        content: "\2714";
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        background-color: $baseColor;
        width: 20px;
        height: 20px;
        font-size: 1rem;
        color: $darkBaseFont;
        border-radius: 2px;
        border: 1px solid gray;
        @include grayShadow;
      }
    }
  }
  & label {
    font-size: 0.8rem;
    width: auto;
  }
}
.to-registrate,
.forget-password {
  margin: 20px 0 10px;
  text-align: left;
  font-size: 0.8rem;
  color: $darkBaseFont;
  &:hover {
    color: $darkHoverFont;
  }
  &:active {
    color: $darkActiveFont;
  }
}
button {
  width: 300px;
  border-radius: 2px;
  background-color: $baseColor;
  box-sizing: border-box;
  padding: 0 10px;
  height: 50px;
  border: none;
  outline: none;
  display: flex;
  font-size: 1.2rem;
  align-items: center;
  color: $lightBaseFont;
  justify-content: center;
  margin: 10px 0;
  @include grayShadow;
  &:hover {
    background-color: $baseBGC;
    color: $lightBaseFont;
  }
  &:active {
    transform: scale(0.99);
  }
}
button.disabled {
  width: 300px;
  border-radius: 2px;
  background-color: $disabledColor;
  box-sizing: border-box;
  padding: 0 10px;
  height: 50px;
  border: none;
  outline: none;
  display: flex;
  font-size: 1rem;
  align-items: center;
  color: $lightBaseFont;
  justify-content: center;
  cursor: not-allowed;
  margin: 10px 0;
  @include grayShadow;
  &:hover {
    background-color: $disabledColor;
    color: $lightBaseFont;
  }
  &:active {
    transform: scale(1);
  }
}
</style>
