<template>
    <v-card id="myGraph">
        <!-- <v-card-title style="color:#2c3e50; padding:2% 46%">
            {{sensor}}
        </v-card-title> -->
        <v-row>
            <ul>
                <li v-for="item in time_range_list" v-bind:class="{selected:timeRange==item.message}" v-on:click="chooseTimeRange(item)"><a>{{item.message}}</a></li>
            </ul>
        </v-row>
        <div class="ct-chart ct-major-twelfth" >
        </div>
    </v-card>
</template>

<script>

export default {
  name: 'histGraph',
  props: {
    sensor: {
      type: String,
      default: 'Humidity'
    },
    node:{
        type: Number,
        default: 0
    },
    dataProp: {
      type: Object,
      default: function () { return {} }
    },
  },
  data () {
    return {
      msg: 'Template or Testing page',
      arrayData: this.dataProp,
      options:{},
      currentGraphColor: 'ct-chart-humid',
      graphColor: '#95a5a6',
      timeRange: 'Day',
      time_range_list:[
          {message: "Day"},
          {message: "Week"}
      ],
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  mounted(){
    this.updateGraph();
  },
  watch: {
    // load_data: function () {
    //   this.arrayData= this.dataProp
    // }
    sensor: function() {this.updateGraph()},
    node: function() {this.updateGraph()},
    timeRange: function() {this.updateGraph()},
  },
  methods: {
      chooseTimeRange (item){
          this.timeRange = item.message;
          console.log(this.timeRange);
      },
      updateGraph(){

        var PointLabels = Chartist.plugins.ctPointLabels({
              textAnchor: 'middle',
              labelInterpolationFnc: function (value) {
                return value.toFixed(1)
              }
            })

        let unit = "%";
        if(this.sensor == 'Temperature'){
          unit = "\u2103"
        }

        var AxisTitlePlugin = Chartist.plugins.ctAxisTitle({
          axisX: {
            axisTitle: 'Time (hours)',
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 26
            },
            textAnchor: 'middle'
          },
          axisY: {
            axisTitle: this.sensor + " (" + unit +")",
            axisClass: 'ct-axis-title',
            offset: {
              x: 0,
              y: 0
            },
            textAnchor: 'middle',
            flipTitle: false
          }
        })

        console.log("data props");
        console.log(this.arrayData);

        var plugins = [PointLabels, AxisTitlePlugin]

        console.log("sensor name");
        console.log(this.sensor);
        //console.log("we in this");
        //console.log(JSON.stringify(this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]));


        var labels = [];
        for(var i=1;i<=this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()].length;i++){
            labels.push(i);
        }

        var data = {
          labels: labels,
          series: [this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]]
        };

        this.options = {
          plugins: plugins,
          //width: 300,
          //height: 200
          fullWidth: true,
          chartPadding:{
            top: 20,
            right: 20,
            bottom: 40,
            left: 15,
          }
        };

        new Chartist.Line('.ct-chart', data, this.options);
    },
  }
}
</script>

<style scoped lang="sass">

</style>

<style scoped>
ul{
    margin-left: 45%;
    margin-top: 1%;
    /*margin-bottom: 1%;*/
    display: inline-block;
}

li{
    display: inline-block;
}

.selected{
    border-bottom: 2px solid #51D1E1;
}

li a{
    padding-right: 15%;
    color: black;
}

.ct-chart{
  margin: auto;
  height: 90%;
  width:90%;
}

/*.ct-chart .ct-series-a .ct-point, .ct-chart .ct-series-a .ct-line {
    stroke: #95a5a6; }
.ct-chart .ct-series-b .ct-point, .ct-chart .ct-series-b .ct-line {
    stroke: #f1c40f; }
.ct-chart .ct-series-c .ct-point, .ct-chart .ct-series-c .ct-line {
    stroke: #e74c3c; }
.ct-chart .ct-series-d .ct-point, .ct-chart .ct-series-d .ct-line {
    stroke: #3498db; }
.ct-chart-humid .ct-series-a .ct-point, .ct-chart-humid .ct-series-a .ct-line {
    stroke: #95a5a6; }
.ct-chart-solar .ct-series-a .ct-point, .ct-chart-solar .ct-series-a .ct-line {
    stroke: #f1c40f; }
.ct-chart-temp .ct-series-a .ct-point, .ct-chart-temp .ct-series-a .ct-line {
    stroke: #e74c3c; }
.ct-chart-moist .ct-series-a .ct-point, .ct-chart-moist .ct-series-a .ct-line {
    stroke: #3498db; }*/

text.ct-axis-title{
  padding: 10%;
  margin: 10%;
}
#myGraph{
  padding-bottom: -30px;
}
</style>
