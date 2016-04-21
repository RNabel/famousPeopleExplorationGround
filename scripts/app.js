/**
 * Created by rn30 on 21/04/16.
 */
var globalData = null,
    dataSet = null,
    filteredDataset = null,
    filteredData = null;
var mapVisual = dc.geoChoroplethChart("#country-chooser");


d3.csv("../data/world-food-facts/FoodFacts.csv", function (data) {
    console.log("data loaded.");

    globalData = data;
    dataSet = crossfilter(data);
    filteredDataset = data.slice();
    filteredDataset = filteredDataset.filter(function (record) {
        return record.fat_100g !== "";
    });

    filteredData = crossfilter(filteredDataset);

    var countries = filteredData.dimension(function(d) {
        return d['countries_en'];
    });

    var reducer = reductio().count(true);
    var countryGroupCount = countries.group(function(d) {
        return d.fat_100g;
    });

    mapVisual
        .width(300)
        .height(300)
        .dimension(countries)
        .group(countryGroupCount)
        .colors(d3.scale.quantize().range(
            ["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"]))
        .colorDomain([0, 200])
        .colorCalculator(function (d) { return d ? usChart.colors()(d) : '#ccc'; })
        .overlayGeoJson(statesJson.features, "state", function (d) {
            return d.properties.name;
        });

    dc.renderAll();

    var groupAll = dataSet.groupAll();
});