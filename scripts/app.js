/**
 * Created by rn30 on 21/04/16.
 */
var globalData = null,
    dataSet = null,
    filteredDataset = null,
    filteredData = null;
var geoChart = dc.geoChoroplethChart("#country-chooser");


// d3.csv("../data/world-food-facts/FoodFacts.csv", function (data) {
//     console.log("data loaded.");
//
//     globalData = data;
//     dataSet = crossfilter(data);
//     filteredDataset = data.slice();
//     filteredDataset = filteredDataset.filter(function (record) {
//         return record.fat_100g !== "";
//     });
//
//     filteredData = crossfilter(filteredDataset);
//
//     var countries = filteredData.dimension(function(d) {
//         return d['countries_en'];
//     });
//
//     var reducer = reductio().count(true);
//     var countryGroupCount = countries.group(function(d) {
//         return d.fat_100g;
//     });
//
//     mapVisual
//         .width(300)
//         .height(300)
//         .dimension(countries)
//         .group(countryGroupCount)
//         .colors(d3.scale.quantize().range(
//             ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
//         .colorDomain([0, 200])
//         .colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; })
//         .overlayGeoJson(statesJson.features, "state", function (d) {
//             return d.properties.name;
//         });
//
//     dc.renderAll();
//
//     var groupAll = dataSet.groupAll();
// });
d3.json("../data/world-countries.json", function (statesJson) {
    d3.csv("../data/world-food-facts/FoodFacts_small.csv", function (data) {
        var crsData = crossfilter(data);

        var countryDimension = crsData.dimension(function (data) {
           return data['countries'];
        });

        var countryGrp = countryDimension.group();

        var width = 960,
            height = 400;

        var projection = d3.geo.mercator()
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
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

        geoChart
            .projection(projection)
            .width(1000)
            .height(400)
            .transitionDuration(1000)
            .dimension(countryDimension)
            .group(countryGrp)
            .filterHandler(function (dimension, filter) {
                dimension.filter(function (d) {
                    return geoChart.filter() != null ? d.indexOf
                    (geoChart.filter()) >= 0 : true;
                }); // perform filtering
                return filter; // return the actual filter value
            })
            .colors(d3.scale.quantize().range(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF",
                "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
            .colorDomain([0, 200])
            .colorCalculator(function (d) {
                return d ? geoChart.colors()(d) : '#ccc';
            })
            .overlayGeoJson(statesJson.features, "state", function (d) {
                return d.id;
            })
            .title(function (d) {
                return "State: " + d.key + " " + (d.value ? d.value : 0) + " Impressions";
            });

        console.log("Finished loading.");
    });
});
