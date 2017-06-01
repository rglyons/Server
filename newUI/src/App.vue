<template>
  <v-app id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div id="topbar" class="cyan lighten-1 border">
      <v-row style="margin-top: 40px">
        <v-col xs5 lg8 offset-lg1 class="display-1 white--text text-xs-left border">{{chosenTab}}</v-col>
        <!-- <v-col xs2 lg1 class="mt-3 border">
          <router-link :to="choice.path" class="choice" @click.native="chosenTab=choice.text">
            {{choice.text}}
          </router-link>
          <p class="white--text">Log out</p>
        </v-col> -->
        <!-- <v-col v-for="choice in topBarChoice" :key="choice.text" xs2 lg1 class="mt-3 border" v-if="chosenTab != choice.text">
          <router-link :to="choice.path" class="choice" @click.native="chosenTab=choice.text">
            {{choice.text}}
          </router-link>
        </v-col> -->
        <v-col xs2 lg1 class="mt-3 white--text choice" v-on:click="logout">
          Logout
        </v-col>
      </v-row>
    </div>
    <v-container fluid id="mainContainer" class="border">
      <v-row class="border">
        <v-col xs12>
          <keep-alive>
            <transition name="slide-fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </keep-alive>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      topBarChoice: [{
        text: 'Overview',
        path: { name: 'dashboard'}
      }, {
        text: 'Setting',
        path: { name: 'setting'}
      }, {
        text: 'Crop Info',
        path: { name: 'setting'}
      }],
      chosenTab: 'Overview'
    }
  },
  methods:{
    logout() {
      console.log("called the logout method");
      localStorage.removeItem("token");
      window.location.href = '/';
    }
  }
}
</script>

<style lang="sass">
$topbar-height: 90px
$leftbar-width: 100px

html, body
  margin: 0
  cursor: url('./assets/cursor.png')

.border
  // border: 1px dashed grey

.choice
  transition: all 1s
  cursor: pointer
  color: #ffffff
  &:hover
    color: #555555


#topbar
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: $topbar-height
  z-index: 100
  opacity: 0.8

#sidebar
  position: fixed
  top: 0
  left: 0
  width: $leftbar-width
  padding: 6px
  padding-top: $topbar-height
  height: 100vh
  z-index: 99

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

#mainContainer
  margin-top: $topbar-height
  // margin-left: $leftbar-width
  width: calc(100% - $leftbar-width)
  // padding: 10px

h1, h2
  font-weight: normal

ul
  list-style-type: none
  padding: 0

li
  display: inline-block
  margin: 0 10px

a
  text-decoration: none

.slide-fade-enter
  transform: translateY(1300px)

.slide-fade-enter-active
  transition: all 0.8s ease

.slide-fade-enter-to
  transform: translateY(0px)

.slide-fade-leave
  transform: translateX(0px)

.slide-fade-leave-active
  transition: all 0.2s

.slide-fade-leave-to
  transform: translateX(2500px)
</style>
