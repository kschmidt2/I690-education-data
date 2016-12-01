function buildMap(selected_attr) {

  var map_data = get_year_data("2015", this.state_data);

    // Normalize state funding by number of students
    if (selected_attr == "state_funding") {
        selected_attr = "funding_per_student";
    }

    // Define color scale
    var colors = {median_earnings: ["#faeed9","#ffa500"], funding_per_student: ["#daf0fc", "#47b4f2"], mean_debt: ["#eff3d3", "#AFC436"] };

    var paletteScaleFunding = d3.scale.linear()
        .domain(d3v4.extent(map_data,
            function(d) { return d.funding_per_student; }))
        .range(colors.funding_per_student);

    var paletteScaleDebt = d3.scale.linear()
        .domain(d3v4.extent(map_data,
            function(d) { return d.mean_debt; }))
        .range(colors.mean_debt);

    var paletteScaleEarnings = d3.scale.linear()
        .domain(d3v4.extent(map_data,
            function(d) { return d.median_earnings; }))
        .range(colors.median_earnings);

    // Create dataset to store each state's value and color
    var dataset = {};
    map_data.forEach(function(d){
        dataset[d.state_id] = {
            numberofThings: d.funding_per_student,
            fillColor:  paletteScaleFunding(d.funding_per_student)
        };
    });

    var datasetFunding = {};
    map_data.forEach(function(d){
        datasetFunding[d.state_id] = {
            numberofThings: d.funding_per_student,
            fillColor:  paletteScaleFunding(d.funding_per_student)
        };
    });

    var datasetDebt = {};
    map_data.forEach(function(d){
        datasetDebt[d.state_id] = {
            numberofThings: d.mean_debt,
            fillColor:  paletteScaleDebt(d.mean_debt)
        };
    });

    var datasetEarnings = {};
    map_data.forEach(function(d){
        datasetEarnings[d.state_id] = {
            numberofThings: d.median_earnings,
            fillColor:  paletteScaleEarnings(d.median_earnings)
        };
    });

    function infoBox(selectState) {
      map_data.forEach(function(d){
        if (d.state_id == selectState) {
          var stateDetails = "<h3>" + d.state + "</h3>";
<<<<<<< Updated upstream
          stateDetails += "<span class='category funding'>State funding per student (2015):</span> $" + d.funding_per_student.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
          stateDetails += "</br><span class='category debt'>Average debt per student (2014)</span>: $" + d.mean_debt.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
          stateDetails += "</br><span class='category earnings'>Median earnings per student (2012)</span>: $" + d.median_earnings.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
=======
          stateDetails += "<span class='category'>State funding:</span> $" + d.funding_per_student.toLocaleString();
          stateDetails += "</br><span class='category'>Median earnings</span>: $" + d.mean_debt.toLocaleString();
          stateDetails += "</br><span class='category'>Median earnings</span>: $" + d.median_earnings.toLocaleString();
>>>>>>> Stashed changes
          $("#state-info").html(stateDetails);
        }
      })
    }



    // Create the map!
    var map = new Datamap({
        element: document.getElementById('usmap'),
        scope: 'usa',
        data: dataset,
        responsive: true,
            done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography){
              $this = this;
              $(this).removeClass('datamaps-subunit');
              var stateClass = $(this).attr('class');
              var enterState = '<div class="sf sf-' + stateClass.toLowerCase() + '"></div> <h2>' + geography.properties.name + '</h2>';
              $('.bottom-row').fadeIn('fast');
              $('#scattercanvas').html('').fadeIn('fast');
              $('#stateinfo').html(enterState);
              $('.school-list').hide();
              $('.school-list'+stateClass).show();
              buildScatterplot(stateClass);
              $('#schoolinfo').html('');
              $('.selectpicker').fadeIn('fast');
              $('.school-list').hide();
              $('.school-list'+stateClass).first().show();
              $('#vis_container').html('');
              buildLineChart(stateClass);
              infoBox(stateClass);
            }).on('mouseover', function(){
              $this = this;
              $(this).removeClass('datamaps-subunit');
              $(this).css('opacity', '0.2');
              var stateClass = $(this).attr('class');
              $('#vis_container').html('');
              buildLineChart(stateClass);
              infoBox(stateClass);
            }).on('mouseleave', function(){
              $('.datamaps-subunits').children().css('opacity', '1.0');
              $('#vis_container').html('');
              $('#state-info').html('');
            });
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

}


$(".attr").on('click', function(){
  $this = this;
  var dataType = $(this).attr('id');
  $(".attr").removeClass('active');
  $(this).addClass('active');
});
