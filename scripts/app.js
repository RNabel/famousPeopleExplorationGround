/**
 * Created by rn30 on 21/04/16.
 */
var globalData = null,
    dataSet = null,
    filteredDataset = null,
    filteredData = null,
    mapContainer = $("#country-chooser");
var geoChart = dc.geoChoroplethChart("#country-chooser"),
    fatChart = dc.lineChart("#fat-amount"),
    sugarChart = dc.lineChart("#sugar-amount");

var width = parseFloat(mapContainer.css('width').replace("px", "")),
    height = 500;

var setupWorldMap = function (countryDimension, countryGrp, world_countries) {
    var projection = d3.geo.mercator()
        // .center([-100,0])
        .scale(200)
        .translate([width / 2, height]);

    function zoomed() {
        projection
            .translate(d3.event.translate)
            .scale(d3.event.scale);
        geoChart.render();
    }

    var zoom = d3.behavior.zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([height / 2, 8 * height])
        .on("zoom", zoomed);

    var svg = d3.select("#country-chooser")
        // .attr("width", 1000)
        // .attr("height", 400)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    geoChart
        .projection(projection)
        .width(parseFloat(mapContainer.css('width').replace("px", "")))
        .height(600)
        .transitionDuration(1000)
        .dimension(countryDimension)
        .group(countryGrp)
        .colors(d3.scale.linear()
            .domain([0, 400, 10000])
            .range(["#e0f2f1", "#26a69a", "#004d40"]))
        .colorCalculator(function (d) {
            var colorToReturn;
            if (d) {
                colorToReturn = geoChart.colors()(d);
            } else {
                colorToReturn = "#F5F2F0"
            }
            return colorToReturn;
        })
        .overlayGeoJson(world_countries.features, "countries", function (d) {
            return d.properties.name;
        })
        .title(function (d) {
            return "Country: " + d.key + " " + (d.value ? d.value : 0) + " Products";
        });
};

d3.json("../data/world-countries.json", function (error, world_countries) {
    d3.csv("../data/world-food-facts/FoodFacts_filtered.csv", function (data) {
        var crsData = crossfilter(data);

        var countryDimension = crsData.dimension(function (data) {
            return data['countries_en'].split(',');
        });

        var countryGrp = countryDimension.group().reduceCount();

        setupWorldMap(countryDimension, countryGrp, world_countries);

        var sugarDimension = crsData.dimension(function (data) {
           return data.sugars_100g;
        });

        var sugarGroup = sugarDimension.group().reduceCount();

        // Set up fat and sugar line charts.
        sugarChart
            .width("100%")
            .height(300)
            .transitionDuration(1000)
            .dimension(countryDimension)
            .group(sugarGroup);

        dc.renderAll();
        console.log("Finished loading.");
    });
});
