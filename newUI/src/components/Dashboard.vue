<template>
  <v-container fluid class="px-4 py-3">
    <div class="myRow border">
      <div v-for="(node, index) in nodes" class="myCol-xs-10 myCol-sm-5 myCol-md-2 border">
        <top-box @click.native.stop="chooseNode(index)" :chosen="chosenNode==node.id" :nodeId="node.id" :allIdeal="checkAllStatus(index)" class="topBox"></top-box>
      </div>
    </div>
    <v-row class="border">
      <v-col xs12 class="border">
        <div class="border white--text text-xs-center mt-4 mb-4 graph">
          <img src="../assets/mockGraph.png">
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="box in boxes" xs12 sm6 lg3 class="border" :key="box.type">
        <bot-box :boxType="box.type" :good="checkStatus(box.ideal, parseInt(box.data.substring(0, 2)))" :data="box.data" :ideal="parseIdealRangeHtml(box.ideal, box.type)"></bot-box>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopBox from './TopBox.vue'
import BotBox from './BotBox.vue'
export default {
  name: 'test',
  components: {
    'top-box': TopBox,
    'bot-box': BotBox
  },
  data () {
    return {
      msg: 'Dashboard',
      nodes: [{
        id: '49',
        boxes: [{
          type: 'Humidity',
          good: true,
          data: '49%',
          ideal: ['10','50']
        }, {
          type: 'Light',
          good: false,
          data: '33%',
          ideal: ['30','50']
        }, {
          type: 'Temperature',
          good: false,
          data: '37&#8451;',
          ideal: ['50', '70']
        },{
          type: 'Moisture',
          good: true,
          data: '29%',
          ideal: ['70','90']
        }]
      }, {
        id: '50',
        boxes: [{
          type: 'Humidity',
          good: true,
          data: '12%',
          ideal: ['44','55']
        }, {
          type: 'Light',
          good: false,
          data: '13%',
          ideal: ['10','20']
        }, {
          type: 'Temperature',
          good: true,
          data: '64&#8451;',
          ideal: ['18','28']
        },{
          type: 'Moisture',
          good: true,
          data: '12%',
          ideal: ['25','35']
        }]
      }, {
        id: '51',
        boxes: [{
          type: 'Humidity',
          good: false,
          data: '40%',
          ideal: ['10','45']
        }, {
          type: 'Light',
          good: true,
          data: '33%',
          ideal: ['10','70']
        }, {
          type: 'Temperature',
          good: true,
          data: '24&#8451;',
          ideal: ['18','28']
        },{
          type: 'Moisture',
          good: true,
          data: '56%',
          ideal: ['25','65']
        }]
      }, {
        id: '52',
        boxes: [{
          type: 'Humidity',
          good: false,
          data: '23%',
          ideal: ['44','55']
        }, {
          type: 'Light',
          good: true,
          data: '33%',
          ideal: ['10','80']
        }, {
          type: 'Temperature',
          good: false,
          data: '77&#8451;',
          ideal: ['20','38']
        },{
          type: 'Moisture',
          good: false,
          data: '55%',
          ideal: ['45','55']
        }]
      }, {
        id: '53',
        boxes: [{
          type: 'Humidity',
          good: true,
          data: '44%',
          ideal: ['23','65']
        }, {
          type: 'Light',
          good: true,
          data: '39%',
          ideal: ['30','60']
        }, {
          type: 'Temperature',
          good: false,
          data: '10&#8451;',
          ideal: ['8','28']
        },{
          type: 'Moisture',
          good: true,
          data: '12%',
          ideal: ['23','67']
        }]
      }],
      chosenNode: '',
      boxes: []
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  mounted (){
    this.chosenNode = this.nodes[0].id
    this.boxes = this.nodes[0].boxes
  },
  methods: {
    test () {
      console.log('abc')
    },
    chooseNode (idx) {
      this.chosenNode = this.nodes[idx].id
      this.boxes = this.nodes[idx].boxes
    },
    parseIdealRangeHtml (range, type) {
      const celsius = '&#8451;'
      const fahrenheit = '&#8457;'
      const percentage = () => {
        return '%' + range[0] + '-' + range[1]
      }
      const objLiteral = {
        Humidity () {
          return percentage()
        },
        Light () {
          return percentage()
        },
        Temperature () {
          return range[0] + '-' + range[1] + celsius
        },
        Moisture () {
          return percentage()
        }
      }
      return objLiteral[type]()
    },
    checkAllStatus (idx) {
      const boxes = this.nodes[idx].boxes
      for (let box of boxes) {
        if (!this.checkStatus(box.ideal, parseInt(box.data.substring(0, 2)))) return false
      }
      return true
    },
    checkStatus (range, value) {
      if (range[0] <= value && range[1] >= value ) return true
      return false
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
.border
  // border: 1px dashed grey

.topBox
  cursor: pointer

.graph
  height: 300px
  img
    width: 100%
    height: 100%
  // background-image: url('../assets/mockGraph.png')
</style>

<style scoped>
.myRow::after {
    content: "";
    clear: both;
    display: table;
}
[class*="myCol-"] {
  width: 100%;
}
[class*="myCol-"] {
    float: left;
    padding: 5px;
}
@media only screen and (min-width: 576px) {
  /* For tablets: */
  .myCol-xs-1 {width: 10%;}
  .myCol-xs-2 {width: 20%;}
  .myCol-xs-3 {width: 30%;}
  .myCol-xs-4 {width: 40%;}
  .myCol-xs-5 {width: 50%;}
  .myCol-xs-6 {width: 60%;}
  .myCol-xs-7 {width: 70%;}
  .myCol-xs-8 {width: 80%;}
  .myCol-xs-9 {width: 90%;}
  .myCol-xs-10 {width: 100%;}
}
@media only screen and (min-width: 768px) {
  /* For desktop: */
  .myCol-sm-1 {width: 10%;}
  .myCol-sm-2 {width: 20%;}
  .myCol-sm-3 {width: 30%;}
  .myCol-sm-4 {width: 40%;}
  .myCol-sm-5 {width: 50%;}
  .myCol-sm-6 {width: 60%;}
  .myCol-sm-7 {width: 70%;}
  .myCol-sm-8 {width: 80%;}
  .myCol-sm-9 {width: 90%;}
  .myCol-sm-10 {width: 100%;}
}
@media only screen and (min-width: 992px) {
  /* For desktop: */
  .myCol-md-1 {width: 10%;}
  .myCol-md-2 {width: 20%;}
  .myCol-md-3 {width: 30%;}
  .myCol-md-4 {width: 40%;}
  .myCol-md-5 {width: 50%;}
  .myCol-md-6 {width: 60%;}
  .myCol-md-7 {width: 70%;}
  .myCol-md-8 {width: 80%;}
  .myCol-md-9 {width: 90%;}
  .myCol-md-10 {width: 100%;}
}
@media only screen and (min-width: 1200px) {
  /* For desktop: */
  .myCol-lg-1 {width: 10%;}
  .myCol-lg-2 {width: 20%;}
  .myCol-lg-3 {width: 30%;}
  .myCol-lg-4 {width: 40%;}
  .myCol-lg-5 {width: 50%;}
  .myCol-lg-6 {width: 60%;}
  .myCol-lg-7 {width: 70%;}
  .myCol-lg-8 {width: 80%;}
  .myCol-lg-9 {width: 90%;}
  .myCol-lg-10 {width: 100%;}
}
</style>
