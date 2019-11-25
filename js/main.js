queue()

    .defer(d3.json, "data/who_suicide_statistics.json")
    .defer(d3.json, "data/countries.geo.json")
    .await(function(error, suicideData, countriesJson) {

        suicideData.forEach(function(d) {
            d.suicides_100k = Math.round(d.suicides_100k);
        });

        data_cleaning_countries_name(suicideData, countriesJson);

        let data = crossfilter(suicideData);
        let all_dim = data.dimension(function(d) { return d; });

        show_year_selector(data);
        show_total_no_of_suicides(data);
        show_countries_with_highest_suicide(data);
        show_no_of_suicides_by_age_group(data);

        let parse_date = d3.time.format("%Y").parse;
        suicideData.forEach(function(d) {
            d.year = parse_date("" + d.year);
        });

        show_no_of_suicides_by_year(data);
        show_country_map(data, countriesJson);

        dc.renderAll();
    });


//Data cleaning
function data_cleaning_countries_name(suicideData, countriesJson) {
    let all_countries_in_cjson = _.uniqBy(countriesJson.features, 'properties.name');
    for (let c of all_countries_in_cjson) {
        let currentCjsonCountry = c.properties.name;
        let entry = _.filter(suicideData, function(d) {

            if (d.country.indexOf(currentCjsonCountry) != -1) {
                d.country = currentCjsonCountry;
            }
        });
    }

    let all_countries_in_sjson = _.uniqBy(suicideData, 'country');
    for (let i of all_countries_in_sjson) {
        let currentSjsonCountry = i.country;
        let entry = _.filter(countriesJson.features, function(d) {

            if (d.properties.name.indexOf(currentSjsonCountry) != -1) {
                d.properties.name = currentSjsonCountry;
            }
        });
    }
}

//Choose year
function show_year_selector(data) {
    let year_dim = data.dimension(dc.pluck('year'));
    let year_group = year_dim.group();

    dc.selectMenu("#year-selector")
        .dimension(year_dim)
        .group(year_group)
        .promptText('All Years')
        .title(function(d) {
            return 'Year: ' + d.key;
        });
}

//Total number
function show_total_no_of_suicides(data) {
    let total_no_of_suicides = data.groupAll().reduceSum(dc.pluck('suicides_100k'));

    dc.numberDisplay("#suicides-figure")
        .group(total_no_of_suicides)
        .formatNumber(d3.format("d"))
        .valueAccessor(function(d) {
            return d;
        });
}

//Row chart
function show_countries_with_highest_suicide(data) {
    let country_dim = data.dimension(dc.pluck('country'));
    let total_suicide_by_country = country_dim.group().reduceSum(dc.pluck('suicides_100k'));
    let top_countries = 10;

    dc.rowChart("#row-chart")
        .width(400)
        .height(160)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .transitionDuration(750)
        .dimension(country_dim)
        .group(total_suicide_by_country)
        .data(function(d) { return d.top(top_countries); })
        .ordinalColors(["#67001f","#810923", "#a1182b","#ba3036", "#cd4f46","#dd705b", "#e88b6f","#f4ad90", "#facab3", "#fae3d7"])
        .renderLabel(true)
        .gap(1)
        .title(function(d) { return "No. of suicides: " + d.value; })
        .elasticX(true)
        .useViewBoxResizing(true)
}

//Stacked bar chart
function show_no_of_suicides_by_age_group(data) {
    let age_dim = data.dimension(dc.pluck('age'));

    let male_suicides_per_age_group = age_dim.group().reduceSum(function(d) {
        if (d.sex == "male") {
            return d.suicides_100k;
        }
        else {
            return 0;
        }
    });

    let female_suicides_per_age_group = age_dim.group().reduceSum(function(d) {
        if (d.sex == "female") {
            return d.suicides_100k;
        }
        else {
            return 0;
        }
    });

    dc.barChart("#bar-chart")
        .width(500)
        .height(250)
        .margins({ top: 30, right: 50, bottom: 40, left: 50 })
        .dimension(age_dim)
        .group(female_suicides_per_age_group, "Female")
        .stack(male_suicides_per_age_group, "Male")
        .ordinalColors(['#f4ad90', '#67001f'])
        .elasticY(true)
        .useViewBoxResizing(true)
        .title(function(d) { return "Age Group: " + d.key + "\n No. of suicides: " + d.value; })
        .x(d3.scale.ordinal())
        .renderHorizontalGridLines(true)
        .legend(dc.legend().x(100).y(18).itemHeight(13).gap(5))
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Age Group")
        .yAxisLabel("No. of Suicides per 100k people")
        .yAxis().ticks(10);
}

//Stacked line chart
function show_no_of_suicides_by_year(data) {
    let year_dim = data.dimension(function(d) {
        return new Date(d.year);
    });

    let male_suicides_per_year = year_dim.group().reduceSum(function(d) {
        if (d.sex == "male") {
            return d.suicides_100k;
        }
        else {
            return 0;
        }
    });

    let female_suicides_per_year = year_dim.group().reduceSum(function(d) {
        if (d.sex == "female") {
            return d.suicides_100k;
        }
        else {
            return 0;
        }
    });

    let min_year = year_dim.bottom(1)[0].year;
    let max_year = year_dim.top(1)[0].year;

    dc.lineChart("#line-chart")
        .renderArea(true)
        .width(500)
        .height(250)
        .transitionDuration(1000)
        .margins({ top: 30, right: 50, bottom: 40, left: 50 })
        .dimension(year_dim)
        .group(female_suicides_per_year, "Female")
        .stack(male_suicides_per_year, "Male")
        .ordinalColors(['#f4ad90', '#67001f'])
        .elasticY(true)
        .transitionDuration(500)
        .x(d3.time.scale().domain([min_year, max_year]))
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .useViewBoxResizing(true)
        .title(function(d) { return "Year: " + d.key.getFullYear() + "\n No. of suicides: " + d.value; })
        .legend(dc.legend().x(400).y(30).itemHeight(10).gap(5))
        .brushOn(false)
        .xAxisLabel("Year")
        .yAxisLabel("No. of Suicides per 100k people")
        .yAxis().ticks(10);
}

// Map
function show_country_map(data, countriesJson) {

    let country_dim = data.dimension(dc.pluck('country'));
    let total_suicide_by_country = country_dim.group().reduceSum(dc.pluck('suicides_100k'));

    dc.geoChoroplethChart("#map-chart")
        .width(1000)
        .height(480)
        .dimension(country_dim)
        .group(total_suicide_by_country)
        .colors(["#fae3d7","#facab3","#f4ad90","#e88b6f","#dd705b","#cd4f46","#ba3036","#a1182b","#810923","#67001f"])
        .colorAccessor(function(d) { return d; })
        .colorDomain([1, 3000])
        .overlayGeoJson(countriesJson["features"], "country", function(d) {
            return d.properties.name;
        })
        .projection(d3.geo.mercator()
            .center([10, 40])
            .scale(120))
        .useViewBoxResizing(true)
        .title(function(d) {
            if (d.value == undefined) {
                return "Country: " + d.key +
                    "\n" +
                    "Data Unavailable";
            }
            else {
                return "Country: " + d.key +
                    "\n" +
                    "Total Suicides: " + d.value;
            }
        });

}
