<template>
  <v-card class="grey lighten-5 border mb-3" style="border-radius: 0px; border: none;">
    <v-row>
      <v-col xs12 style="height: 12px">
        <transition name="slide-bar">
          <div class="chosenBorder" v-show="chosen"></div>
        </transition>
      </v-col>
    </v-row>
      <v-row class="border" style="padding: 0px">
        <v-col xs12 class="border text-xs-left pl-4 headline">
          <v-row class="border">
            <v-col xs6 class="border">{{boxType}}</v-col>
            <v-col xs6>
              <v-row>
                <v-col xs4 v-for="x in 2" :key="x+123" class="border icon">
                </v-col>
                <v-col xs4>
                  <v-icon :class="{'red--text': !good, 'green--text': good}">
                    radio_button_checked
                  </v-icon>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col xs12 class="border display-2 grey--text" v-html="data">
        </v-col>
        <v-col xs12 class="border">
          <div class="infoBox pa-1 grey lighten-3 border">
            <v-row class="border innerInfoBox" :class="{'red--text': !good, 'grey--text': good}">
              <v-col xs12 class="border" style="height: 35px"></v-col>
              <v-col xs12 class="headline text-xs-left border pl-4" style="font-weight: 600">Idealy</v-col>
              <v-col xs12 class="display-1 text-xs-center border" style="font-weight: 600" v-html="ideal"></v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'botBox',
  props: {
    chosen: {
      type: Boolean,
      default: false
    },
    boxType: {
      type: String,
      default: 'BoxType'
    },
    good: {
      type: Boolean,
      default: true
    },
    data: {
      type: String,
      default: '(%|&#8451;|&#8457;)'
    },
    ideal: {
      type: String,
      default: '(%|&#8451;|&#8457;)25-35'
    }
  },
  data () {
    return {
      msg: 'Template or Testing page'
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  watch: {
  },
  methods: {
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
.border
  // border: 1px dashed grey
  .chosenBorder
    width: 100%
    height: 100%
    background-color: #51D1E1

.infoBox
  height: 135px
  margin: 0 auto
  width: 98.5%
  .innerInfoBox
    transition: all 0.5s

.icon
  padding-left: 0
  height: 40px
  transition: all 0.5s
  cursor: pointer
  &:hover
    color: #bEbEbE

.nodeId
  cursor: pointer
  font-weight: 600
  color: #bEbEbE

.botBox
  height: 240px
  box-shadow: 0px 1px 1px #BBBBBB
  transition: all 0.5s ease-in
  border-top: 15px #FAFAFA solid
  &:hover
    box-shadow: 2px 2px 3px #888888

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
</style>
