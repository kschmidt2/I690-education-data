
// // Build Map
// // attribute is which of the aggregate attributes to graph
// // (This should match one of the variable names in the state data)
// // state_data is the aggregated data for each state
// var buildMap = function(attribute, state_data) {

//     // margins
//     var margin = {top: 20, right: 80, bottom: 290, left: 100},
//         width = 865 - margin.left - margin.right,
//         height = 670 - margin.top - margin.bottom;

//     // create responsive svg
//     var svg = d3.select("#canvas1")
//         .append("div")
//             .classed("svg-container-line-svg", true) //container class to make it responsive
//             .append("svg")
//             //responsive SVG needs these 2 attributes and no width and height attr
//                 .attr("preserveAspectRatio", "xMinYMin meet")
//                 .attr("viewBox", "0 0 800 700")
//             //class to make it responsive
//                 .classed("svg-content-responsive", true)
//             .append("g")
//                 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // Add map code here
//     // If data join is .data(state_data), then
//     // State abbreviations -> d.state_id
//     // State properties -> d[attribute]
//     // The console line here provides an example:
//     for (var i=0; i<state_data.length; i++) {
//         var d = state_data[i];
//         console.log(d.state_id +" has an average "+ attribute +" of "+ d[attribute]);
//     }
// };



var buildMap = function (AttrID, state_data){
    
        var series = data;
        var state_data = {};
        
        var colors = {state_funding: ["#d2d9da","#1f3f48"], cost_of_living: ["#ebbaba", "#c73838"], ft_students: ["#c1c3da", "#4e5394"] };

        var onlyValues = series.map(function(d){ return d[AttrID]; });
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        var paletteScale = d3.scale.linear()
            .domain([minValue,maxValue])
            .range([colors[AttrID][0], colors[AttrID][1]]);
        
        
        series.forEach(function(d){     
            var st=abbrOf(d.state);
            value = d[AttrID];
            if (d.year=="2014"){
                state_data[st]={numberofThings: value, fillColor:  paletteScale(value)}}});

        
        
        console.log(state_data);
        var SelectedAttr=AttrID;
        console.log(AttrID)
        
//        if (SelectedAttr == "state_funding"){
            var map = new Datamap({
            
            element: document.getElementById('usmap'),
            scope: 'usa',
            fills: { defaultFill: '#9999FF'},
            data: state_data,
            responsive: true,
            geographyConfig: {
              highlightBorderWidth: 0,
                highlightFillColor:  colors[AttrID][1],
////                // show desired information in tooltip
                popupTemplate: function(geo, data) {
//                    // don't show tooltip if country don't present in dataset
                    if (!data) { return ; }
//                    // tooltip content
                    return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>', 
                        '<br>Amount: <strong>$', data.numberofThings.toLocaleString(), '</strong>',
                        '</div>'].join('');;

                }
        }
        }
            );
        
        $(window).on('resize', function() {
           map.resize();
        });
        
          };


$(".attr").on('click', function(){
  $this = this 
  var Data_type = $(this).attr('id');
  $('.map').html('<div id="usmap"></div>');
    createVis("map", Data_type);

});

