// Utility functions for state abbreviations
var state_abbr = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming" };
var abbrOf = function(state) {
    for (var abbr in state_abbr) {
        if (state_abbr[abbr] == state) {
            return abbr;
        }
    }
    return "Other";
};

// Extract the given year's data from a rolled-up data object
var get_year_data = function(target_year, state_data) {
    var annual_data = [];
    for (var state in state_data) {
        for (var y in state_data[state]) {
            if (state_data[state][y].year == target_year) {
                state_data[state][y].state_id = state;
                annual_data.push(state_data[state][y]);
            }
        }
    }
    return annual_data;
};

// Define variables to control which vis function we call
var vis_function_list = {
    "map": buildMap,
    "scatter": buildScatter,
    "line": buildLineChart,
    "bars": buildBarCharts
};

function combine_data(mode, vis_function_args) {

    return function(error, raw_school_data, raw_state_data) {
        var school_data = [],
            state_data = [];

        this.test = raw_school_data;

        // Select the fields we want from school data
        raw_school_data.forEach(function(d) {
            school_data.push({
                college: d.college_name,
                state: d.state,
                college_type: d.type_des,
                campus_type: d.campus_des,
                median_income: +d.median_family_income,
                mean_price: +d.avg_net_price,
                median_earnings: +d.median_earnings,
                completion_rate: +d.completion_rate,
                mean_debt_withdrawn: +d.debt_withdrew,
                mean_debt_graduated: +d.debt_graduated,
                repayment_rate: +d.repayment_rate
            });
        });

        // Filter out schools in territories, not states
        school_data = school_data.filter(function(d) {
            return d.state in state_abbr;
        });
        // Filter out school records with non-number values in numerical fields
        school_data = school_data.filter(function(d) {
            var number_fields =
                ["median_income", "mean_price", "median_earnings",
                "completion_rate", "mean_debt_graduated",
                "mean_debt_withdrawn", "repayment_rate"];

            for (var i=0; i < number_fields.length; i++) {
                var property_value = d[number_fields[i]];
                if (isNaN(property_value) || property_value <= 0) {
                    return false;
                }
            }
            return true;
        });

        // Scatterplot only needs school data, so draw it now
        if (mode == "scatter") {
            vis_function_args.push(school_data);
            return this.vis_function_list[mode]
                .apply(this, vis_function_args);
        }

        // Select the fields we want from state data
        raw_state_data.forEach(function(d) {
            state_data.push({
                state: d.State,
                year: d.FiscalYear,
                inflation: 1/(+d.InflationDenom),
                cost_of_living: +d.CostOfLiving,
                state_funding: +d.StateSupport,
                ft_students: +d.FTEnrollment,
                funding_per_student: +d.StateSupport / +d.FTEnrollment
            });
        });

        // Filter out state records with non-number values in numerical fields
        state_data = state_data.filter(function(d) {
            var number_fields =
                ["inflation", "cost_of_living",
                 "state_funding", "ft_students"];

            for (var i=0; i < number_fields.length; i++) {
                var property_value = d[number_fields[i]];
                if (isNaN(property_value) || property_value <= 0) {
                    return false;
                }
            }
            return true;
        });

        // Group state data by state then year
        var nested_state_data = d3v4.nest()
            .key(function(d) { return abbrOf(d.state); })
                .sortKeys(d3v4.ascending)
            .key(function(d) { return d.year; })
                .sortKeys(d3v4.ascending)
            .entries(state_data);

        // Pull aggregate data from school file
        var aggregate_data = d3v4.nest()
            .key(function(d) { return d.state; }).sortKeys(d3v4.ascending)
            .rollup(function(states) {
                return {
                    median_earnings: d3v4.median(states,
                        function(d) { return d.median_earnings; }),
                    mean_debt: d3v4.mean(states,
                        function(d) { return d.mean_debt_graduated; }),
                    mean_price: d3v4.mean(states,
                        function(d) { return d.mean_price; }),
                    repayment_rate: d3v4.mean(states,
                        function(d) { return d.repayment_rate; }),
                    completion_rate: d3v4.mean(states,
                        function(d) { return d.completion_rate; })
                };
            }).entries(school_data);

        // Add aggregated school data to state data
        for (var i=0; i < aggregate_data.length; i++) {
            var last = nested_state_data[i].values.length - 1;
            for (var property in aggregate_data[i].value) {
                nested_state_data[i].values[last].values[0][property] =
                aggregate_data[i].value[property];
            }
        }

        // Simplify nested data structure
        var annual_state_data = {};
        for (var j=0; j < nested_state_data.length; j++) {
            var state = nested_state_data[j];
            annual_state_data[state.key] = [];
            for (var k=0; k < state.values.length; k++) {
                var year = state.values[k];
                annual_state_data[state.key].push(year.values[0]);
            }
        }

        // Line chart needs annual data, so draw it now
        if (mode == "line") {
            vis_function_args.push(annual_state_data);
            return this.vis_function_list[mode]
                .apply(this, vis_function_args);
        }


        // Map needs most recent year's data, so draw it now
        else if (mode == "map") {
            vis_function_args.push(
                get_year_data("2015", annual_state_data)
            );
            return this.vis_function_list[mode]
                .apply(this, vis_function_args);
        }

        // Else we're drawing bar charts, so we need the national averages
        var state_last_year = get_year_data("2015", annual_state_data);
        var national_data = {
            median_earnings: d3v4.median(state_last_year,
                function(d) { return d.median_earnings; }),
            mean_debt: d3v4.mean(state_last_year,
                function(d) { return d.mean_debt; }),
            mean_price: d3v4.mean(state_last_year,
                function(d) { return d.mean_price; }),
            repayment_rate: d3v4.mean(state_last_year,
                function(d) { return d.repayment_rate; }),
            completion_rate: d3v4.mean(state_last_year,
                function(d) { return d.completion_rate; })
        };
        vis_function_args.push(state_last_year, national_data);
        this.vis_function_list[mode].apply(this, vis_function_args);
    };
}

function createVis (mode) {
    if (!(mode in vis_function_list)) {
        throw new Error("We don't know how to visualize a "+ mode +". Try a different vis mode?");
    } else {
        console.log("Drawing in "+ mode +" mode");
    }

    var vis_function_args = Array.prototype.slice.call(arguments, 1);

    // load data
    var institutionFile = "data/institutional-data.csv";
    var stateFile = "data/state-data.csv";

    var q = d3v4.queue()
        .defer(d3v4.csv, institutionFile)
        .defer(d3v4.csv, stateFile)
        .await(combine_data(mode, vis_function_args));

}
