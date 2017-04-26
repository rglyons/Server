/**
 * Created by Lin Yu An on 12/10/16.
 */


// String Extension Function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


var cleanArray = function(actual) {
    var newArray = new Array();
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            // console.log('here');
            newArray.push(actual[i]);
        }
    }
    return newArray;
};

var sumArrayElements = function(arr){
    // console.log('in sumArray');
    // console.log(arr);
    var arrays= arr, results= [],
        count= arrays[0].length, L= arrays.length,
        sum, next= 0, i;
    while(next<count){
        sum= 0, i= 0;
        while(i<L){
            sum+= Number(arrays[i++][next]);
        }
        results[next++]= sum;
    }
    // console.log('-done sumArray');
    return results;
};

// // Multiple AJAX Callbacks
// // Ex.
// var requestCallback = new MultiRequestsComplete({
//                 numRequest: 10,
//                 singleCallback: function(){ //Callback
//                     // alert('done');
//                     // $.when(callback_chart()).done(function() {
//                     //
//                     //     });
//                 }
//             });
var MultiRequestsComplete = (function() {
    var numRequestToComplete, requestsCompleted, callBacks, singleCallBack;

    return function(options) {
        if (!options) options = {};

        numRequestToComplete = options.numRequest || 0;
        requestsCompleted = options.requestsCompleted || 0;
        callBacks = [];
        var fireCallbacks = function() {
            // alert("we're all complete");
            for (var i = 0; i < callBacks.length; i++) callBacks[i]();
        };
        if (options.singleCallback) callBacks.push(options.singleCallback);

        this.addCallbackToQueue = function(isComplete, callback) {
            if (isComplete) requestsCompleted++;
            if (callback) callBacks.push(callback);
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.requestComplete = function(isComplete) {
            if (isComplete) requestsCompleted++;
            if (requestsCompleted == numRequestToComplete) fireCallbacks();
        };
        this.setCallback = function(callback) {
            callBacks.push(callBack);
        };
    };
})();


// //FLASH MESSAGE
// // Ex.  options
// $('DOM_selector').flash_message({
//     text: 'What to show',
//     how: 'append',
// });

(function($) {
    $.fn.flash_message = function(options) {
        options = $.extend({
            text: 'Done',
            time: 1000,
            how : 'before',
            class_name: 'flash-show'
        }, options);

        return $(this).each(function() {
            if( $(this).parent().find('.flash_message').get(0) )return;

            var message = $('<span />', {
                'class': 'flash_message ' + options.class_name,
                text: options.text
            }).hide().fadeIn('fast');
            $(this)[options.how](message);

            message.delay(options.time).fadeOut('slow', function() {
                $(this).remove();
            });
        });
    };
})(jQuery);