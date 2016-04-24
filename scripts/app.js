/**
 * Created by rn30 on 21/04/16.
 */
var globalCrsData = null,
    dataSet = null,
    filteredDataset = null,
    filteredData = null,
    mapContainer = $("#country-chooser");
var geoChart = dc.geoChoroplethChart("#country-chooser");
// fatChart = dc.lineChart("#fat-amount"),
// sugarChart = dc.lineChart("#sugar-amount");

var width = parseFloat(mapContainer.css('width').replace("px", "")),
    height = 500;

var CHART_HEIGHT = 300,
    CHART_WIDTH = 400;

var setup = {
    setupWorldMap: function (countryDimension, countryGrp, world_countries) {
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
                return d.id;
            })
            .title(function (d) {
                return "Country code: " + d.key + "; " + (d.value ? d.value : 0) + " famous people";
            });
    },
    // setupSugarChart: function (crsData) {
    //     var sugarDimension = crsData.dimension(function (data) {
    //         return data.sugars_group;
    //     });
    //
    //     var sugarGroup = sugarDimension.group().reduceCount();
    //
    //     // Set up fat and sugar line charts.
    //     sugarChart
    //         .width(CHART_WIDTH)
    //         .height(CHART_HEIGHT)
    //         .transitionDuration(1000)
    //         .margins({top: 30, right: 50, bottom: 35, left: 50})
    //         .dimension(sugarDimension)
    //         .x(d3.scale.linear().domain([0, 10]))
    //         .elasticY(true)
    //         .group(sugarGroup)
    //         .colors(d3.scale.ordinal().domain([0]).range(["#004d40"]));
    //
    //     // Adapt tick format.
    //     sugarChart.xAxis().tickFormat(function (d) {
    //         return (d * 10) + "%";
    //     });
    //
    //     sugarChart.xAxisLabel("Percentage of sugar")
    //         .yAxisLabel("Number of items");
    // },
    // setupFatChart: function (crsData) {
    //     var fatDimension = crsData.dimension(function (data) {
    //         return data.fat_group;
    //     });
    //
    //     var fatGroup = fatDimension.group().reduceCount();
    //
    //     // Set up fat and sugar line charts.
    //     fatChart
    //         .width(CHART_WIDTH)
    //         .height(CHART_HEIGHT)
    //         .transitionDuration(1000)
    //         .margins({top: 30, right: 50, bottom: 35, left: 50})
    //         .dimension(fatDimension)
    //         .x(d3.scale.linear().domain([0, 10]))
    //         .elasticY(true)
    //         .group(fatGroup)
    //         .colors(d3.scale.ordinal().domain([0]).range(["#004d40"]));
    //
    //     // Adapt tick format.
    //     fatChart.xAxis().tickFormat(function (d) {
    //         return (d * 10) + "%";
    //     });
    //
    //     fatChart.xAxisLabel("Percentage of fat")
    //         .yAxisLabel("Number of items");
    // },
    // setupSelector: function (data) {
    //     var keys = keys = ['no_nutriments',
    //         'additives_n',
    //         'ingredients_from_palm_oil_n',
    //         'ingredients_from_palm_oil',
    //         'ingredients_that_may_be_from_palm_oil_n',
    //         'ingredients_that_may_be_from_palm_oil',
    //         'nutrition_grade_uk',
    //         'energy_100g',
    //         'energy_from_fat_100g',
    //         'fat_100g',
    //         'saturated_fat_100g',
    //         'butyric_acid_100g',
    //         'caproic_acid_100g',
    //         'caprylic_acid_100g',
    //         'capric_acid_100g',
    //         'lauric_acid_100g',
    //         'myristic_acid_100g',
    //         'palmitic_acid_100g',
    //         'stearic_acid_100g',
    //         'arachidic_acid_100g',
    //         'behenic_acid_100g',
    //         'lignoceric_acid_100g',
    //         'cerotic_acid_100g',
    //         'montanic_acid_100g',
    //         'melissic_acid_100g',
    //         'monounsaturated_fat_100g',
    //         'polyunsaturated_fat_100g',
    //         'omega_3_fat_100g',
    //         'alpha_linolenic_acid_100g',
    //         'eicosapentaenoic_acid_100g',
    //         'docosahexaenoic_acid_100g',
    //         'omega_6_fat_100g',
    //         'linoleic_acid_100g',
    //         'arachidonic_acid_100g',
    //         'gamma_linolenic_acid_100g',
    //         'dihomo_gamma_linolenic_acid_100g',
    //         'omega_9_fat_100g',
    //         'oleic_acid_100g',
    //         'elaidic_acid_100g',
    //         'gondoic_acid_100g',
    //         'mead_acid_100g',
    //         'erucic_acid_100g',
    //         'nervonic_acid_100g',
    //         'trans_fat_100g',
    //         'cholesterol_100g',
    //         'carbohydrates_100g',
    //         'sugars_100g',
    //         'sucrose_100g',
    //         'glucose_100g',
    //         'fructose_100g',
    //         'lactose_100g',
    //         'maltose_100g',
    //         'maltodextrins_100g',
    //         'starch_100g',
    //         'polyols_100g',
    //         'fiber_100g',
    //         'proteins_100g',
    //         'casein_100g',
    //         'serum_proteins_100g',
    //         'nucleotides_100g',
    //         'salt_100g',
    //         'sodium_100g',
    //         'alcohol_100g',
    //         'vitamin_a_100g',
    //         'beta_carotene_100g',
    //         'vitamin_d_100g',
    //         'vitamin_e_100g',
    //         'vitamin_k_100g',
    //         'vitamin_c_100g',
    //         'vitamin_b1_100g',
    //         'vitamin_b2_100g',
    //         'vitamin_pp_100g',
    //         'vitamin_b6_100g',
    //         'vitamin_b9_100g',
    //         'vitamin_b12_100g',
    //         'biotin_100g',
    //         'pantothenic_acid_100g',
    //         'silica_100g',
    //         'bicarbonate_100g',
    //         'potassium_100g',
    //         'chloride_100g',
    //         'calcium_100g',
    //         'phosphorus_100g',
    //         'iron_100g',
    //         'magnesium_100g',
    //         'zinc_100g',
    //         'copper_100g',
    //         'manganese_100g',
    //         'fluoride_100g',
    //         'selenium_100g',
    //         'chromium_100g',
    //         'molybdenum_100g',
    //         'iodine_100g',
    //         'caffeine_100g',
    //         'taurine_100g',
    //         'ph_100g',
    //         'fruits_vegetables_nuts_100g',
    //         'collagen_meat_protein_ratio_100g',
    //         'cocoa_100g',
    //         'chlorophyl_100g',
    //         'carbon_footprint_100g',
    //         'nutrition_score_fr_100g',
    //         'nutrition_score_uk_100g'];
    //
    //     // Add each key to the select.
    //     var $selectEl = $('select');
    //     var count = 0;
    //     var humanKeys = keys.forEach(function (key) {
    //         var humanKey = key.replace("_100g", " per 100g").replace(/_/g, " ");
    //         humanKey = humanKey.substr(0, 1).toUpperCase() + humanKey.substr(1);
    //
    //         var option = $('<option>').attr('value', key).text(humanKey).css('text-transform', 'capitalize');
    //
    //         if (count == 4) {
    //             option.attr('selected');
    //         }
    //         count++;
    //
    //         $selectEl.append(option);
    //     });
    //
    //     $selectEl.material_select();
    // },
    // setupCustomChart: function (data) {
    //     var selector = $('#custom-chooser');
    //
    //     var customChart = dc.lineChart('#custom-quantity');
    //     var newChoice = selector.val();
    //
    //     var dimension = globalCrsData.dimension(function (data) {
    //         return data.fat_group;
    //     });
    //
    //     var group = dimension.group().reduceCount();
    //
    //     customChart
    //         .width(CHART_WIDTH)
    //         .height(CHART_HEIGHT)
    //         .transitionDuration(1000)
    //         .margins({top: 30, right: 50, bottom: 35, left: 50})
    //         .dimension(dimension)
    //         .elasticX(true)
    //         .x(d3.scale.linear().domain([0, 10]))
    //         .elasticY(true)
    //         .group(group)
    //         .colors(d3.scale.ordinal().domain([0]).range(["#004d40"]));
    //
    //     // Add event listener.
    //     $(document).on('change', '#custom-chooser', function (data) {
    //         var selected = $(data.target).val();
    //         dimension = globalCrsData.dimension(function (d) {
    //             var returnVal = d[selected];
    //             return isNaN(returnVal) ? 0 : returnVal;
    //         });
    //
    //         group = dimension.group().reduceCount();
    //         var sortedMap = dataSet.map(function (d) {
    //             return d[selected];
    //         }).sort();
    //         customChart
    //             .dimension(dimension)
    //             .group(group)
    //             .x(d3.scale.linear().domain([sortedMap[0], sortedMap[sortedMap.length-1]]));
    //         customChart.render();
    //     })
    // },
    cleanData: function (data) {
        var dateFormat = d3.time.format('%Y');
        var numberFormat = d3.format('.2f');
        data.forEach(function (d) {
            // Convert dates.
            d.numlangs = parseInt(d.numlangs);
            d.country = d.countryCode3;
            d.birthyear = parseInt(d.birthyear);
            d.TotalPageViews = parseInt(d.TotalPageViews);
            d.PageViewsEnglish = parseInt(d.PageViewsEnglish);
            d.PageViewsNonEnglish = parseInt(d.PageViewsNonEnglish);
        });
        return data;
    }
};


d3.json("../data/world-countries.json", function (error, world_countries) {
    d3.csv("../data/famousPeople.csv", function (data) {
        data = setup.cleanData(data);
        dataSet = data;
        var crsData = crossfilter(data);
        globalCrsData = crsData;

        var countryDimension = crsData.dimension(function (data) {
            return data.country;
        });

        var countryGrp = countryDimension.group().reduceCount();

        setup.setupWorldMap(countryDimension, countryGrp, world_countries);

        // setup.setupSugarChart(crsData);
        // setup.setupFatChart(crsData);
        // setup.setupSelector(data);
        //
        // setup.setupCustomChart(data);

        dc.renderAll();
        console.log("Finished loading.");
    });
});
