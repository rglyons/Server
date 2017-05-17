<template>
    <v-card id="myGraph">
        <v-card-title style="color:#2c3e50; padding:2% 46%">
            {{sensor}}
        </v-card-title>
        <v-row>
            <ul>
                <li v-for="item in time_range_list" v-bind:class="{selected:timeRange==item.message}" v-on:click="chooseTimeRange(item)"><a>{{item.message}}</a></li>
            </ul>
        </v-row>
        <div class="ct-chart ct-minor-sixth"></div>
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
    console.log("data props");
    console.log(this.arrayData);
    var labels = [];
    for(var i=1;i<=this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()].length;i++){
        labels.push(i);
    }
    var data = {
      // A labels array that can contain any sort of values

      labels: labels,
      // Our series array that contains series objects or in this case series data arrays
      // series: [[5, 2, 4, 2, 0] ]
      series: [this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()]]
    };

    var options = {
      //width: 300,
      //height: 200
    };

    new Chartist.Line('.ct-chart', data, options);
  },
  watch: {
    // load_data: function () {
    //   this.arrayData= this.dataProp
    // }
    sensor: function(){
        //console.log("we in this");
        //console.log(JSON.stringify(this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]));
        var labels = [];
        for(var i=1;i<=this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()].length;i++){
            labels.push(i);
        }
        var data = {
          // A labels array that can contain any sort of values
          labels: labels,
          // Our series array that contains series objects or in this case series data arrays
          // series: [[5, 2, 4, 2, 0] ]
          series: [this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]]
        };

        var options = {
        };

        new Chartist.Line('.ct-chart', data, options);
    },
    node: function(){
        //console.log("we in this");
        //console.log(JSON.stringify(this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]));
        var labels = [];
        for(var i=1;i<=this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()].length;i++){
            labels.push(i);
        }
        var data = {
          // A labels array that can contain any sort of values
          labels: labels,
          // Our series array that contains series objects or in this case series data arrays
          // series: [[5, 2, 4, 2, 0] ]
          series: [this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]]
        };

        var options = {
        };

        new Chartist.Line('.ct-chart', data, options);
    },
    timeRange: function(){
        //console.log("we in this");
        //console.log(JSON.stringify(this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]));
        var labels = [];
        for(var i=1;i<=this.arrayData[this.timeRange][this.node][this.sensor.toLowerCase()].length;i++){
            labels.push(i);
        }
        var data = {
          // A labels array that can contain any sort of values
          labels: labels,
          // Our series array that contains series objects or in this case series data arrays
          // series: [[5, 2, 4, 2, 0] ]
          series: [this.dataProp[this.timeRange][this.node][this.sensor.toLowerCase()]]
        };

        var options = {
        };

        new Chartist.Line('.ct-chart', data, options);
    }
  },
  methods: {
      chooseTimeRange (item){
          this.timeRange = item.message;
          console.log(this.timeRange);
      },
  }
}
</script>

<style scoped lang="sass">

</style>

<style scoped>
ul{
    margin-left: 45%;
    margin-bottom: 1%;
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
  height: 65%;
  width: 65%;
}
#myGraph{
  padding-bottom: -30px;
}
</style>
