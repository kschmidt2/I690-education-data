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

    var paletteScaleFunding = d3.scale.linear()
        .domain(d3v4.extent(state_data,
            function(d) { return d.funding_per_student; }))
        .range(colors.funding_per_student);

    var paletteScaleDebt = d3.scale.linear()
        .domain(d3v4.extent(state_data,
            function(d) { return d.mean_debt; }))
        .range(colors.mean_debt);

    var paletteScaleEarnings = d3.scale.linear()
        .domain(d3v4.extent(state_data,
            function(d) { return d.median_earnings; }))
        .range(colors.median_earnings);

    // Create dataset to store each state's value and color
    var dataset = {};
    state_data.forEach(function(d){
        dataset[d.state_id] = {
            numberofThings: d.funding_per_student,
            fillColor:  paletteScaleFunding(d.funding_per_student)
        };
    });

    var datasetFunding = {};
    state_data.forEach(function(d){
        datasetFunding[d.state_id] = {
            numberofThings: d.funding_per_student,
            fillColor:  paletteScaleFunding(d.funding_per_student)
        };
    });

    var datasetDebt = {};
    state_data.forEach(function(d){
        datasetDebt[d.state_id] = {
            numberofThings: d.mean_debt,
            fillColor:  paletteScaleDebt(d.mean_debt)
        };
    });

    var datasetEarnings = {};
    state_data.forEach(function(d){
        datasetEarnings[d.state_id] = {
            numberofThings: d.median_earnings,
            fillColor:  paletteScaleEarnings(d.median_earnings)
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
              $('#scattercanvas').fadeIn(500);
              $('#stateinfo').html(enterState);
              createVis("scatter", stateClass);
              $('#schoolinfo').html('');
              $('.selectpicker').fadeIn('fast');
              $('.school-list').hide();
              $('#vis_container').html('');
              $('#schoolAndStateInfo').html('');
              createVis("line", stateClass);
            });//the section below makes the line chart appear but it causes the scatter plot to disappear
            // datamap.svg.selectAll('.datamaps-subunit').on('click',function(geography){
            //   $this = this;
            //   $('.datamaps-subunit').removeClass('datamaps-subunit');
            //   document.getElementById('vis_container').innerHTML = "";
            //   document.getElementById('schoolAndStateInfo').innerHTML = "";
            //   var stateClass = $(this).attr('class');
            //   createVis("line", stateClass);
            //   });
          }
          }
        );


        $(window).on('resize', function() {
           map.resize();
        });

        $("#mean_debt").on('click', function(){
          map.updateChoropleth(datasetDebt);
        });
        $("#median_earnings").on('click', function(){
          map.updateChoropleth(datasetEarnings);
        });
        $("#state_funding").on('click', function(){
          map.updateChoropleth(datasetFunding);
        });

};


$(".attr").on('click', function(){
  $this = this;
  var dataType = $(this).attr('id');
  // $('.map').html('<div id="usmap"></div>');
  // createVis("map", dataType);
  $(".attr").removeClass('active');
  $(this).addClass('active');
});
