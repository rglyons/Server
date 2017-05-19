<template>
  <v-container fluid class="px-4 py-3">
    <!-- <div class="myRow border">
      <div v-for="(node, index) in fakenodes" class="myCol-xs-10 myCol-sm-5 myCol-md-2 border">
        <top-box @click.native.stop="chooseNode(index)" :chosen="chosenNode==node.id" :nodeId="node.id" :allIdeal="checkAllStatus(index)" class="topBox"></top-box>
      </div>
    </div> -->
    <!-- <div v-if="loaded" > -->
    <div class="myRow border">
      <div v-for="(node, index) in nodes" class="myCol-xs-10 myCol-sm-5 myCol-md-2 border">
        <top-box @click.native.stop="chooseNode(index)" :chosen="chosenNode==node.id && !addingNode" :id="node.id" :nodeId="getNodeName(node)" :apiKey="apiKey":allIdeal="checkNodeStatus(index)" class="topBox"></top-box>
      </div>
      <div class="myCol-xs-10 myCol-sm-5 myCol-md-2 border">
        <top-box @click.native.stop="addNode()" :chosen="addingNode" class="topBox"></top-box>
      </div>
    </div>
    <!-- </div> -->
    <v-row class="border">
      <v-col xs12 class="border">
        <div v-if="histDataLoaded" class="border white--text text-xs-center mt-4 mb-4 graph">
          <hist-graph :sensor="chosenSensor" :node="chosenNode" :dataProp="historicalData"></hist-graph>
        </div>
      </v-col>
    </v-row>
    <v-row id="bottomBoxes">
      <v-col xs12 v-for="i in items" sm6 lg3 class="border" :key="newboxes[i].type">
        <bot-box @click.native.stop="chooseSensor(newboxes[i].type)" :chosen="chosenSensor==newboxes[i].type" :boxType="newboxes[i].type" :data="parseDataValue(newboxes[i])" :good="checkBoxStatus(newboxes[i])" :ideal=" parseIdealRangeHtml(newboxes[i].ideal, newboxes[i].type)" :min="newboxes[i].ideal[0]" :max="newboxes[i].ideal[1]" class="topBox"></bot-box>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TopBox from './TopBox.vue'
import BotBox from './BotBox.vue'
import Graph from './Graph.vue'

const nobody = "sVT9PgIDO6TlTMb0XOvIpHGpZuzTos";
const sustainability = "8KTSdFjzYD9Lx333rDJQv2YWSQzjmB";
const apiKey = sustainability;
let deployURL = "https://slugsense.herokuapp.com";
let getuserURL = deployURL + "/api/users/getuser";
let getRecentURL = deployURL + "/api/users/sensor_readings";
let getHistoricalUrl = deployURL + "/api/users/day_avg";
export default {
  name: 'test',
  components: {
    'top-box': TopBox,
    'bot-box': BotBox,
    'hist-graph': Graph
  },
  data () {
    return {
      msg: 'Dashboard',
      chosenNode: '0',
      chosenSensor:'Humidity',
      boxes: [],
      time_range: 'day_avg',
      fakeArrayData: [1,2,3,4],
      selectedData: [1,2,3],
      histDataLoaded: false,
      nobody: "sVT9PgIDO6TlTMb0XOvIpHGpZuzTos",
      sustainability: "8KTSdFjzYD9Lx333rDJQv2YWSQzjmB",
      apiKey: nobody,
      //placeholder data, gets updated on data fetch
      newboxes:[{
          type: 'Humidity',
          good: true,
          data: 49,
          ideal: [10,50],
        }, {
          type: 'Light',
          good: false,
          data: 33,
          ideal: [30,50]
        }, {
          type: 'Temperature',
          good: false,
          data: 37,//&#8451;',
          ideal: [50, 70]
        },{
          type: 'Moisture',
          good: true,
          data: 29,
          ideal: [70,90]
        }],
      nodes: [],
      loaded: false,
      sensors :{},
      addingNode: false,
      items: [0,1,2,3],
      historicalData: {},
    }
  },
  created () {
    this.fetchNodeData();
    this.fetchRecentData();
    this.fetchHistoricalData();
  },
  mounted (){
    // this.chosenNode = this.nodes
    // this.boxes = this.newboxes
  },
  methods: {
    addNode(){
      this.addingNode = true;
    },
    fetchNodeData(){
      var self = this;
      $.post(getuserURL,
      {api_token: apiKey},
      function(data){
        self.nodes = data.sensors;
        self.chosenNode = data.sensors[0].id
        console.log("this is real data");
        console.log(JSON.stringify(data.sensors));
        self.loaded = true;

        self.newboxes[0].ideal[0] = data.sensors[0].humidityMin
        self.newboxes[0].ideal[1] = data.sensors[0].humidityMax
        self.newboxes[2].ideal[0] = data.sensors[0].tempMin
        self.newboxes[2].ideal[1] = data.sensors[0].tempMax
        self.newboxes[3].ideal[0] = data.sensors[0].moistureMin
        self.newboxes[3].ideal[1] = data.sensors[0].moistureMax
        self.newboxes[1].ideal[0] = data.sensors[0].sunlightMin
        self.newboxes[1].ideal[1] = data.sensors[0].sunlightMax
      }
    )},
    fetchRecentData(){
      var self = this;
      $.post(getRecentURL,
        {api_token: apiKey},
        function(data){
          console.log("recent values")
          console.log(JSON.stringify(data));
            self.sensors = data;
            self.newboxes[0].data = data[0]["humidity"]
            self.newboxes[2].data = data[0]["temperature"]
            self.newboxes[1].data = data[0]["sunlight"]
            self.newboxes[3].data = data[0]["moisture"]
        })
    },
    fetchHistoricalData(){
      let self = this;
      $.post(getHistoricalUrl,
        {api_token: apiKey},
        function(data){
          let day_avg= {};
          let humInfo;
          let sunInfo;
          let tempInfo;
          let moistureInfo;
          for(var i=0;i<data.length;i++){
              humInfo = data[i].map(function(a){return a['humidity']});
              sunInfo = data[i].map(function(a){return a['sunlight']});
              tempInfo = data[i].map(function(a){return a['temperature']});
              moistureInfo = data[i].map(function(a){return a['moisture']});
              day_avg[data[i][0]['id']] = {humidity:humInfo,light:sunInfo,temperature:tempInfo,moisture:moistureInfo};
          }
          self.historicalData["Day"] = day_avg;
          self.historicalData["Week"] = {49:{humidity:[1,2,3],light:[4,20],temperature:[6,9,69],moisture:[3,2,1]}};
          //self.selectedData = self.historicalData[self.time_range][self.chosenNode][self.chosenSensor.toLowerCase()];
          console.log("historicalData");
          console.log(JSON.stringify(data));
          console.log(data);
          console.log("historicalData")
          console.log(JSON.stringify(self.historicalData));
          self.histDataLoaded = true;
        })
    },
    chooseNode (idx) {
      this.addingNode = false;
      this.chosenNode = this.nodes[idx].id
     // self.selectedData = self.historicalData[self.time_range][self.chosenNode][self.chosenSensor.toLowerCase()];
      // this.boxes = this.fakenodes[idx].boxes
      console.log("index", idx);
      console.log("node was changed")
      console.log(this.nodes[idx])
      console.log(this.sensors[idx])

      //humidity
      this.newboxes[0].ideal[0] = this.nodes[idx].humidityMin
      this.newboxes[0].ideal[1] = this.nodes[idx].humidityMax
      this.newboxes[0].data = this.sensors[idx].humidity
      //temperature
      this.newboxes[2].ideal[0] = this.nodes[idx].tempMin
      this.newboxes[2].ideal[1] = this.nodes[idx].tempMax
      this.newboxes[2].data = this.sensors[idx].temperature
      //moisture
      this.newboxes[3].ideal[0] = this.nodes[idx].moistureMin
      this.newboxes[3].ideal[1] = this.nodes[idx].moistureMax
      this.newboxes[3].data = this.sensors[idx].moisture
      //sunlight
      this.newboxes[1].ideal[0] = this.nodes[idx].sunlightMin
      this.newboxes[1].ideal[1] = this.nodes[idx].sunlightMax
      this.newboxes[1].data = this.sensors[idx].sunlight
      console.log(this.newboxes)
    },
    chooseSensor (type) {
        this.chosenSensor = type;
        //self.selectedData = self.historicalData[self.time_range][self.chosenNode][self.chosenSensor.toLowerCase()];
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
    parseDataValue(box){
      const celsius = '&#8451;'
      const fahrenheit = '&#8457;'
      if(box.type != "Temperature")
        return (box.data + "%")
      else
        return (box.data + celsius)
    },
    getNodeName(n){
      if(n.name) return n.name+""
        return n.id+""
    },
    checkAllStatus (idx) {
      const boxes = this.newboxes
      for (let box of boxes) {
        if (!this.checkStatus(box.ideal, box.data)) return false
      }
      return true
    },
    checkStatus (range, value) {
      if (range[0] <= value && range[1] >= value ) return true
      return false
    },
    checkBoxStatus(box){
      return this.checkStatus(box.ideal, box.data);
    },
    checkNodeStatus(idx){
        if(this.sensors[idx]["humidity"]<this.nodes[idx].humidityMin || this.sensors[idx]["humidity"]>this.nodes[idx].humidityMax)
            return false;
        if(this.sensors[idx]["sunlight"]<this.nodes[idx].sunlightMin || this.sensors[idx]["sunlight"]>this.nodes[idx].sunlightMax)
            return false;
        if(this.sensors[idx]["temperature"]<this.nodes[idx].tempMin || this.sensors[idx]["temperature"]>this.nodes[idx].tempMax)
            return false;
        if(this.sensors[idx]["moisture"]<this.nodes[idx].moistureMin || this.sensors[idx]["moisture"]>this.nodes[idx].moistureMax)
            return false;
        return true;
    },
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
  //img
    width: 100%
    height: 100%
    padding-bottom: 50px;
  // background-image: url('../assets/mockGraph.png')
</style>

<style scoped>

#bottomBoxes{
  padding-top: 50px;
}
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
