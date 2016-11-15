var buildMap = function (selected_attr, state_data) {
    // Debugging statements: log arguments
    // console.log(selected_attr);
    console.log(state_data);

    // Normalize state funding by number of students
    if (selected_attr == "state_funding") {
        selected_attr = "funding_per_student";
    }

    // Define color scale
    var colors = {funding_per_student: ["#d2d9da","#1f3f48"], mean_debt: ["#daf0fc", "#47b4f2"], median_earnings: ["#eff3d3", "#AFC436"] };

    var paletteScale = d3.scale.linear()
        .domain(d3v4.extent(state_data,
            function(d) { return d[selected_attr]; }))
        .range(colors[selected_attr]);

    // Create dataset to store each state's value and color
    var dataset = {};
    state_data.forEach(function(d){
        dataset[d.state_id] = {
            numberofThings: d[selected_attr],
            fillColor:  paletteScale(d[selected_attr])
        };
    });


    // Create the map!
    var map = new Datamap({
        element: document.getElementById('usmap'),
        scope: 'usa',
        data: dataset,
        responsive: true,
        geographyConfig: {
            highlightBorderWidth: 0,
            highlightFillColor:  '#ECEDEB',
            popupTemplate: function(geo, data) {
                // don't show tooltip if country not present in dataset
                if (!data) { return ; }
                // tooltip content
                return ['<div class="hoverinfo">',
                        '<strong>', geo.properties.name, '</strong>',
                        '<br>Amount: <strong>$', Math.round(data.numberofThings).toLocaleString(), '</strong>',
                        '</div>'].join('');
            }
        },
            done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography){
              $this = this;
              $('.datamaps-subunit').removeClass('datamaps-subunit');
              var stateClass = $(this).attr('class');
              var enterState = '<div class="sf sf-' + stateClass.toLowerCase() + '"></div> <h2>' + geography.properties.name + '</h2>';
              $('.scatter').html('<div id="scattercanvas"></div>').fadeIn('fast');
              $('#stateinfo').html(enterState);
              createVis("scatter", stateClass);
              document.getElementById('schoolinfo').innerHTML = "";
              $('.selectpicker').fadeIn('fast');
            });
        }
        }
            );

        $(window).on('resize', function() {
           map.resize();
        });

          };


$(".attr").on('click', function(){
  $this = this;
  var Data_type = $(this).attr('id');
  $('.map').html('<div id="usmap"></div>');
  createVis("map", Data_type);
  $(".attr").removeClass('active');
  $(this).addClass('active');
});
