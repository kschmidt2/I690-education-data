function buildMap (AttrID){
console.log(AttrID)
// load data
  var stateFile = "data/state-data.csv";
    
    //create state_data dictionary w/ abbr and color
  d3.csv(stateFile,
      function(d) {
          return {
              state: d.State,
              year: d.FiscalYear,
              inflation: 1/(+d.InflationDenom),
              cost_of_living: +d.CostOfLiving,
              state_funding: +d.StateSupport,
              ft_students: +d.FTEnrollment
          };
      },
      function(error, data) {
          if (error != null) {
              alert("Uh-oh, we can't read the state-level data file. Try again?");
          } else {
              
              createMap(data)
          }});

//              console.log(data);

    var createMap = function (data){
    
        var series = data;
        var state_data = {};
    
    //add state_abbr              
    var state_abbr= { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL":    "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
                
        var abbrOf = function(state) {
            for (abbr in state_abbr) { 
                if (state_abbr[abbr] == state) {
                    return abbr;
                    }
                }
                return "Other";
        };
              
        
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
//                state_data[st]={state: d.state, state_funding: d.state_funding, color: d3.interpolate("#ffffcc", "#800026")(Math.round(100*Math.random())/100),                                 cost_of_living: d.cost_of_living, ft_students:d.ft_students}}});
        
        
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
}


$(".attr").on('click', function(){
  $this = this;
  var attrID = $(this).attr('id');
  $('.map').html('<div id="usmap"></div>');
    
    
  buildMap(attrID);
  $('button').removeClass('active');
  $(this).addClass('active');
});

buildMap("state_funding")
$('.map').html('<div id="usmap"></div>');


//$(".attr").on('click', function(){
//  $this = this;
//  var attrID = $(this).attr('id');
//  $('.map').html('<div id="usmap"></div>');
//  createVis("map", attrID);
//});


  var enterState = '<div class=' + attrID.toLowerCase() + '"></div>';
  $('.scatter').html('<div id="scattercanvas"></div>');
  $('#stateinfo').html(enterState);
