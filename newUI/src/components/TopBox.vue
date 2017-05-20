<template>
  <v-card class="grey lighten-5 border" style="border-radius: 0px; border: none;">
    <v-card-text class="topBox border" :class="{'chosen': chosen}" style="padding: 0px">
      <v-row>
        <v-col xs12 style="height: 12px">
          <transition name="slide-bar">
            <div class="chosenBorder" v-show="chosen"></div>
          </transition>
        </v-col>
      </v-row>
      <v-row class="border" style="padding: 0px">
        <v-col xs6 class="border display-1 text-xs-left pt-1 pl-3" style="height: 45px">
          <transition name="slide-text" mode="out-in">
            <span class="nodeId" v-if="!editing" @click="editName">{{nodeIdLocal}}</span>
            <v-text-field
              v-tooltip:top="{ html: 'Press Enter' }"
              name="Name"
              label="NAME"
              style="postion: relative; top: -10px;"
              v-model="nodeIdLocal"
              @keyup.enter.native="submitName"
              @keyup.esc.native="editName"
              ref="textfield"
              v-else
            ></v-text-field>
          </transition>
        </v-col>
        <v-col xs6>
          <v-row>
            <v-col xs4 v-for="i in 2" class="pl-0 border icon" :key="i">
            </v-col>
            <v-col xs4 class="pl-0 border icon">
              <!-- <v-icon class="red--text" v-show="!allIdeal">
                radio_button_checked
              </v-icon> -->
              <i class="fa fa-exclamation red--text" aria-hidden="true" v-show="!allIdeal"></i>
            </v-col>
            <v-col xs4 v-for="i in 2" class="pl-0 border icon" :key="i">
            </v-col>
            <transition name="slide-fade">
              <v-col xs4 class="pl-0 icon" @click.stop="editName" v-show="chosen&&!editing">
                <v-icon>edit</v-icon>
              </v-col>
            </transition>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'topBox',
  props: {
    chosen: {
      type: Boolean,
      default: false
    },
    nodeId: {
      type: String,
      //to add a node
      default: '+'
    },
    allIdeal: {
      type: Boolean,
      default: true
    },
    apiKey: {
      type: String,
      default: "secret"
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      msg: 'Template or Testing page',
      editing: false,
      nodeIdLocal: this.nodeId
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  watch: {
    chosen () {
      if (!this.chosen) {
        this.editing = false
      }
    }
  },
  methods: {
    editName () {
      this.editing = !this.editing
      // console.log(this.$refs.textfield49)
      if (this.editing) {
        setTimeout(() => {
          this.$refs['textfield'].focus()
        }, 900)
      }
    },
    submitName () {
      console.log(this.nodeIdLocal);
      $.ajax({
        method: "PUT",
        url: "https://slugsense.herokuapp.com/api/sensors/"+this.id,
        data: { api_token: this.apiKey, name: this.nodeIdLocal }
      })
      this.editing = !this.editing;
    },
    log (text) {
      console.log(text)
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
.border
  // border: 1px dashed grey

.icon
  padding-left: 0
  padding-top: 2px
  height: 20px
  transition: all 0.8s
  cursor: pointer
  font-size: 19px
  &:hover
    color: #bEbEbE

.nodeId
  cursor: pointer
  font-weight: 600
  color: #bEbEbE

.topBox
  height: 60px
  box-shadow: 0px 2px 0px #BBBBBB
  transition: all 0.5s ease-in
  // border-top: 12px #FAFAFA solid
  &:hover
    box-shadow: 4px 4px 8px #888888

.chosenBorder
  width: 100%
  height: 100%
  background-color: #51D1E1

.chosen
  // border-top: 12px #51D1E1 solid

//-----------------
.slide-fade-enter
  transform: translateX(20px)
  opacity: 0

.slide-fade-enter-active
  transition: all 0.8s ease

.slide-fade-enter-to
  transform: translateY(0px)
  opacity: 1

.slide-fade-leave
  transform: translateX(0px)
  opacity: 1

.slide-fade-leave-active
  transition: all 0.2s

.slide-fade-leave-to
  transform: translateY(20px)
  opacity: 0

//---------------
.slide-bar-enter
  width: 0%
  opacity: 0.2

.slide-bar-enter-active
  transition: all 0.4s ease-out

.slide-bar-enter-to
  width: 100%
  opacity: 1

.slide-bar-leave
  height: 100%
  opacity: 0.7

.slide-bar-leave-active
  transition: all 0.4s ease-out

.slide-bar-leave-to
  height: 0%
  opacity: 0

//----------------
.slide-text-enter
  transform: translateY(-20px)
  opacity: 0

.slide-text-enter-active
  transition: all 0.4s ease-out

.slide-text-enter-to
  transform: translateY(0px)
  opacity: 1

.slide-text-leave
  transform: translateY(0px)
  opacity: 1

.slide-text-leave-active
  transition: all 0.4s ease-out

.slide-text-leave-to
  transform: translateY(20px)
  opacity: 0
</style>
