var print = function(text) {
    console.log(text);
};

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // ============ AJAX =============
    let userURL = "https://slugsense.herokuapp.com/api/users/username/"+sessionStorage.getItem("username");
    self.get_values = function() {
        $.getJSON(userURL,
            function(info) {
            //    var sensors = [];
            //    var histSensorData = [];
                /*for (var i=0; i<info['sensor_count'];i++){
                    console.log(i);
                    var entries = info[i]["sensors"];
                    // Get most recent entry for the sensor and push to sensors list
                    sensors.push(entries[0]);
                    var sensorEntry = [];
                    for(var key in entries){
                        sensorEntry.push(entries[key]);
                    }
                    histSensorData.push(sensorEntry);
                }
                sensors.reverse();*/
                self.vue.sensors = info['sensors'];
                //self.vue.selected_node = self.vue.sensors[0]['id'];
                console.log(JSON.stringify(info['sensors']));
                //console.log("sensors" + JSON.stringify(histSensorData));
                /*for(var key in sensors){
                    console.log(JSON.stringify(sensors[key]));
                }*/
                // self.vue.humid = info.humid;
                var processSensor = function(sensor, senList){
                    console.log(JSON.stringify(sensor));
                    //console.log(senList);
                    self.vue.histSenList.push(sensor);
                    senList.push(sensor['entries'][0]);
                    //self.vue.selected_node = senList[0]['sensorId'];
                    //self.vue.humid = senList[0]["humidity"];
                    //self.vue.solar = senList[0]["sunlight"];
                    //self.vue.temp = senList[0]["temperature"];
                    //self.vue.moist = senList[0]["moisture"];
                    return senList;
                }
                let sensorInfo = [];
                //console.log(JSON.stringify(self.vue.sensors[node]));
                let sensorURL = "https://localhost:3030/api/users/"+info['id']+'/day_avg';
                $.getJSON(sensorURL,
                    function(data){
                        console.log("Yooooooooo");
                        console.log(JSON.stringify(data));
                        self.vue.day_avgs=data;
                    });
                let dataURL = "https://slugsense.herokuapp.com/api/users/"+info['id']+"/sensor_readings";
                $.getJSON(dataURL,
                    function(data){
                        console.log("hiii");
                        self.vue.humid = data[0]['humidity'];
                        self.vue.temp = data[0]['temperature'];
                        self.vue.solar = data[0]['sunlight'];
                        self.vue.moist = data[0]['moisture'];
                        self.vue.selected_node = data[0]['sensorId'];
                        self.vue.sensorInfo = data;
                    });
                //console.log(JSON.stringify(self.vue.sensorInfo));
                /*self.vue.humid = sensorInfo[0]["humidity"];
                self.vue.solar = sensorInfo[0]["sunlight"];
                self.vue.temp = sensorInfo[0]["temperature"];
                self.vue.moist = sensorInfo[0]["moisture"];*/

                if (!self.vue.humid_animating) {
                    self.vue.humid_animating = true;
                    self.vue.humid_old = 380 - (self.vue.humid * 4);
                    //self.vue.humid = sensors[0]["humidity"];
                    self.update_humid_graph();
                }
                // self.vue.solar = info.solar;
                if (!self.vue.solar_animating) {
                    self.vue.solar_animating = true;
                    self.vue.solar_old = 380 - (self.vue.solar * 4);
                    //self.vue.solar = sensors[0]["sunlight"];
                    self.update_solar_graph();
                }
                // self.vue.temp = info.temp;
                if (!self.vue.temp_animating) {
                    self.vue.temp_animating = true;
                    self.vue.temp_old = 380 - (self.vue.temp * 4);
                    //self.vue.temp = sensors[0]["temperature"];
                    self.update_temp_graph();
                }
                if (!self.vue.moist_animating) {
                    self.vue.moist_animating = true;
                    self.vue.moist_old = 380 - (self.vue.moist * 4);
                    //self.vue.moist = sensors[0]["moisture"];
                    self.update_moist_graph();
                }
                print(self.vue.humid);
                print(self.vue.solar);
                print(self.vue.temp);
                print(self.vue.moist);
                print('get success');
                // self.update_moist_graph();
            }
        );
    };

    self.update_moist_graph = function() {
        jQuery('#g-clip-rect').attr('height', self.vue.moist_old);
        var to = 380 - (self.vue.moist * 4);
        if (to < 0) {
            to = 0;
            self.vue.moist = 100;
        }
        jQuery('#moist-animation').attr({ 'from': self.vue.moist_old, 'to': to, 'dur': "4s" });
        self.vue.moist_old = 380 - (self.vue.moist * 4);
        if (self.vue.moist_old < 0) {
            self.vue.moist_old = 0;
        }
        self.vue.moist_animating = false;
    };

    self.update_temp_graph = function() {
        jQuery('#g-clip-rect').attr('height', self.vue.temp_old);
        var to = 380 - (self.vue.temp * 4);
        if (to < 0) {
            to = 0;
            self.vue.temp = 100;
        }
        jQuery('#temp-animation').attr({ 'from': self.vue.temp_old, 'to': to, 'dur': "4s" });
        self.vue.temp_old = 380 - (self.vue.temp * 4);
        if (self.vue.temp_old < 0) {
            self.vue.temp_old = 0;
        }
        self.vue.temp_animating = false;
    };

    self.update_solar_graph = function() {
        jQuery('#g-clip-rect').attr('height', self.vue.solar_old);
        var to = 380 - (self.vue.solar * 4);
        if (to < 0) {
            to = 0;
            self.vue.solar = 99;
        }
        jQuery('#solar-animation').attr({ 'from': self.vue.solar_old, 'to': to, 'dur': "4s" });
        self.vue.solar_old = 380 - (self.vue.solar * 4);
        if (self.vue.solar_old < 0) {
            self.vue.solar_old = 0;
        }
        self.vue.solar_animating = false;
    };

    self.update_humid_graph = function() {
        jQuery('#g-clip-rect').attr('height', self.vue.humid_old);
        var to = 380 - (self.vue.humid * 4);
        if (to < 0) {
            to = 0;
            self.vue.humid = 100;
        }
        jQuery('#humid-animation').attr({ 'from': self.vue.humid_old, 'to': to, 'dur': "4s" });
        self.vue.humid_old = 380 - (self.vue.humid * 4);
        if (self.vue.humid_old < 0) {
            self.vue.humid_old = 0;
        }
        self.vue.humid_animating = false;
    };

    // =========== HELPER ===========
    $(document).ready(function() {
        $("#menu-toggle").click(function(e) {
            e.preventDefault();
            $("#wrapper").toggleClass("toggled");
        });
    });

    self.tab_name = function(text) {
        if (text == 'home') {
            return '';
        } else if (text == 'temp') {
            return 'Temperature';
        } else if (text == 'moist') {
            return 'Moisture';
        } else if (text == 'humid') {
            return 'Humidity';
        } else if (text == 'heat') {
            return 'Overview';
        } else if (text == 'solar') {
            return 'Light';
        } else {
            return text;
        }
    }


    // =========== Interaction ===========
    self.change_tab = function(tab) {
        self.vue.active_tab = tab;
        document.getElementById("mnav-popout").style.width = "0";
        /*curSensor = self.vue.histSenList.filter(function(value){return value['id']==self.vue.selected_node});
        console.log(curSensor[0]['entries']);
        humInfo = curSensor[0]['entries'].map(function(a){return a['humidity']}).reverse();
        sunInfo = curSensor[0]['entries'].map(function(a){return a['sunlight']}).reverse();
        tempInfo = curSensor[0]['entries'].map(function(a){return a['temperature']}).reverse();
        moistureInfo = curSensor[0]['entries'].map(function(a){return a['moisture']}).reverse();*/
        var huminfo;
        var sunInfo;
        var tempInfo;
        var moistureInfo;
        for(var i=0; i < self.vue.day_avgs.length;i++){
            if(day_avgs[i][0]['id']==self.vue.selected_node){
                huminfo = self.vue.day_avgs[i].map(function(a){return a['humidity']});
                suninfo = self.vue.day_avgs[i].map(function(a){return a['sunlight']});
                tempinfo = self.vue.day_avgs[i].map(function(a){return a['temperature']});
                moistureInfoinfo = self.vue.day_avgs[i].map(function(a){return a['moisture']});
            }
        }
        labelArray = [];
        console.log(JSON.stringify(self.vue.day_avgs));
        for(var i=0; i<humInfo.length;i++){
            labelArray[i] = i;
        }
        if(self.vue.active_tab == 'humid'){
            new Chartist.Line('.ct-chart-humid', {
                  labels: labelArray,
                  series: [
                        humInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'solar'){
            new Chartist.Line('.ct-chart-solar', {
                  labels: labelArray,
                  series: [
                        sunInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'temp'){
            new Chartist.Line('.ct-chart-temp', {
                  labels: labelArray,
                  series: [
                        tempInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'moist'){
            new Chartist.Line('.ct-chart-moist', {
                  labels: labelArray,
                  series: [
                        moistureInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }
    };

    self.change_sensor = function(node) {

        /*self.vue.humid=node['humidity'];
        self.vue.solar=node['sunlight'];
        self.vue.temp=node['temperature'];
        self.vue.moist=node['moisture'];
        self.vue.selected_node=node['sensorId'];
        curSensor = self.vue.histSenList.filter(function(value){return value['id']==self.vue.selected_node});
        console.log(curSensor[0]['entries']);
        humInfo = curSensor[0]['entries'].map(function(a){return a['humidity']}).reverse();
        sunInfo = curSensor[0]['entries'].map(function(a){return a['sunlight']}).reverse();
        tempInfo = curSensor[0]['entries'].map(function(a){return a['temperature']}).reverse();
        moistureInfo = curSensor[0]['entries'].map(function(a){return a['moisture']}).reverse();*/
        labelArray = [];
        var huminfo;
        var sunInfo;
        var tempInfo;
        var moistureInfo;
        for(var i=0; i < self.vue.day_avgs.length;i++){
            if(day_avgs[i][0]['id']==self.vue.selected_node){
                huminfo = self.vue.day_avgs[i].map(function(a){return a['humidity']});
                suninfo = self.vue.day_avgs[i].map(function(a){return a['sunlight']});
                tempinfo = self.vue.day_avgs[i].map(function(a){return a['temperature']});
                moistureInfoinfo = self.vue.day_avgs[i].map(function(a){return a['moisture']});
            }
        }
        console.log(humInfo);
        for(var i=0; i<humInfo.length;i++){
            labelArray[i] = i;
        }
        if(self.vue.active_tab == 'humid'){
            new Chartist.Line('.ct-chart-humid', {
                  labels: labelArray,
                  series: [
                        humInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'solar'){
            new Chartist.Line('.ct-chart-solar', {
                  labels: labelArray,
                  series: [
                        sunInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'temp'){
            new Chartist.Line('.ct-chart-temp', {
                  labels: labelArray,
                  series: [
                        tempInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }else if(self.vue.active_tab == 'moist'){
            new Chartist.Line('.ct-chart-moist', {
                  labels: labelArray,
                  series: [
                        moistureInfo
                  ]
                }, {
                  fullWidth: true,
                  chartPadding: {
                    right: 40
                  }
            });
        }
    };


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            'day_avgs': [],
            'histSenList': [],
            'sensors': [],
            'sensorInfo': [],
            'humid': 0,
            'humid_old': 0,
            'humid_animating': 0,
            'solar': 0,
            'solar_old': 0,
            'solar_animating': 0,
            'temp': 0,
            'temp_old': 0,
            'temp_animating': 0,
            'moist': 0,
            'moist_old': 0,
            'moist_animating': 0,
            'heat': 0,
            'active_tab': 'heat',
            'selected_node': 0,
            'humidThresholdMin': 20,
            'humidThresholdMax': 40,
            'sunlightThresholdMin': 40,
            'sunlightThresholdMax': 100,
            'temperatureThreshold': 12,
            'moistureThresholdMin': 20,
            'moistureThresholdMax': 50,
        },
        methods: {
            change_tab: self.change_tab,
            tab_name: self.tab_name,
            change_sensor: self.change_sensor,
        },
    });

    self.get_values();
    //var get_value_id = setInterval(self.get_values, 2);

    $("#vue-div").show();
    self.vue.loading = "";
    return self;
};




var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function() {
    APP = app();
    console.log('APP returned');

});



/*

    get(this.humid, this.sunlight, this.moisture, this.temperature) value of the sensor and place them in separate variables
        if(humidValue < humidThreshValue || sunlighValue < sunlightThreshValue || moistureValue < moistureThreshValue || temperature < temperatureThreshValue){
            $("square-outer").css('background-color', '#2ecc71');
        }else{
            $("square-outer").css('background-color', '#FF5733');
        }

*/

/*

*/

/*window.onload = function(){
   // alert("here");

    /*var EventListenerTest = document.getElementById( "grid" );

    EventListenerTest.addEventListener( "click", function() {
        console.log("got that elelemtn");
        alert("Wussgood?");
    });







var fullGrid = document.getElementById("grid"),
  style = window.getComputedStyle(fullGrid),
  widthOfGrid = parseInt(style.getPropertyValue('width'),10);
  console.log("widthOfGrid: " +widthOfGrid);
  console.log(style.getPropertyValue('width'));
var sensors = 2,
  squaresColumn = Math.ceil(Math.sqrt(sensors)),
  squaresRow = Math.round(Math.sqrt(sensors)),
  spacing = widthOfGrid/(3*squaresColumn+squaresColumn+1),
  square = 3*spacing;

// create the svg
var svg = d3.select('#grid').append('svg')
  .attr({
    width: widthOfGrid,
    height: widthOfGrid
  });

// loop over number of columns
_.times(squaresColumn, function(n) {
  // create each set of rows
  var rows = svg.selectAll('rect' + ' .row-' + (n + 1))
    .data(d3.range(squaresRow))
    .enter().append('rect');
    rows.filter(function(d,i) {return (i*squaresColumn + n < sensors);})
    .attr({
      class: function(d, i) {
        return 'square row-' + (n + 1) + ' ' + 'col-' + (i + 1);
      },
      id: function(d, i) {
        return 's-' + (n + 1) + (i + 1);
      },
      width: square,
      height: square,
      x: function(d, i) {
        //console.log("i: " +i);
        //console.log("n: " +n);
        return (n * square) + (n * spacing);
      },
      y: function(d,i){
        return i * square + i * spacing;
      },
      fill: '#fff',
      stroke: '#FDBB30'
    })
});


    var testElements = document.getElementsByTagName('rect');
    console.log(testElements);

    for( var i=0; i<testElements.length; i++){
      //  console.log("in for loop for with testElements " + testElements[i].getAttribute('id'));
        let id = testElements[i].getAttribute('id').substring(2);
        let split = Math.ceil(id.length/2);
        let row = id.substring(split)-1;
        let column = id.substring(0,split)-1;
        testElements[i].addEventListener('click', function(){
            //console.log("here in testAlert()");
            console.log("row: "+row + "column: "+ column);
            document.getElementById("gridHumid").innerHTML = "${sensors["+column+"]['humidity']}%"
            //   console.log(testElements[i].getAttribute('id'));
            //alert("this is the rect element property values: " + testElements[i].value);
        });
    }


   /* var test = rows.on('mouseover', function (d, i) {
              console.log("slap");
      d3.select('#grid-ref').text(function () {
              console.log("me");
        return 'row: ' + (n + 1) + ' | ' + 'column: ' + (i + 1);
              console.log("SJDFNDSIJFnbsdijfbsdij");
      });
      d3.selectAll('.square').attr('fill', 'white');
      console.log("SJDFNDSIJFnbsdijfbsdij");
      d3.select(this).attr('fill', '#7AC143');
      console.log("SJDFNDSIJFnbsdijfbsdij");
    });




}*/
