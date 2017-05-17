<template>
    <v-card id="myGraph">
        <v-card-title style="color:#2c3e50; padding:2% 50%">
            {{sensor}}
        </v-card-title>
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
    dataProp: {
      type: Array,
      default: function () { return [] }
    }
  },
  data () {
    return {
      msg: 'Template or Testing page',
      arrayData: this.dataProp
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  mounted(){
    console.log("data props");
    console.log(this.arrayData);
    var data = {
      // A labels array that can contain any sort of values
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      // Our series array that contains series objects or in this case series data arrays
      // series: [[5, 2, 4, 2, 0] ]
      series: [this.arrayData]
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
    dataProp: function(){
        console.log("we in this");
        console.log(JSON.stringify(this.dataProp));
        var data = {
          // A labels array that can contain any sort of values
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          // Our series array that contains series objects or in this case series data arrays
          // series: [[5, 2, 4, 2, 0] ]
          series: [this.dataProp]
        };

        var options = {
        };

        new Chartist.Line('.ct-chart', data, options);
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="sass">

</style>

<style scoped>
.ct-chart{
  margin: auto;
  height: 65%;
  width: 65%;
}
#myGraph{
  padding-bottom: -30px;
}
</style>
