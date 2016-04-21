/**
 * Created by rn30 on 21/04/16.
 */
var globalData = null,
    dataSet = null,
    filteredDataset = null,
    filteredData = null,
    mapContainer = $("#country-chooser");
var geoChart = dc.geoChoroplethChart("#country-chooser"),
    // fatChart = dc.lineChart("#fat-amount"),
    sugarChart = dc.lineChart("#sugar-amount");

var width = parseFloat(mapContainer.css('width').replace("px", "")),
    height = 500;

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
                return d.properties.name;
            })
            .title(function (d) {
                return "Country: " + d.key + " " + (d.value ? d.value : 0) + " Products";
            });
    },
    cleanData: function (data) {
        data.forEach(function (d) {
            if (d.countries_en == "United States") {
                d.countries_en = "United States of America"
            }
            d.no_nutriments = parseFloat(d.no_nutriments);
            d.additives_n = parseFloat(d.additives_n);
            d.ingredients_from_palm_oil_n = parseFloat(d.ingredients_from_palm_oil_n);
            d.ingredients_from_palm_oil = parseFloat(d.ingredients_from_palm_oil);
            d.ingredients_that_may_be_from_palm_oil_n = parseFloat(d.ingredients_that_may_be_from_palm_oil_n);
            d.ingredients_that_may_be_from_palm_oil = parseFloat(d.ingredients_that_may_be_from_palm_oil);
            d.nutrition_grade_uk = parseFloat(d.nutrition_grade_uk);
            d.energy_100g = parseFloat(d.energy_100g);
            d.energy_from_fat_100g = parseFloat(d.energy_from_fat_100g);
            d.fat_100g = parseFloat(d.fat_100g);
            d.saturated_fat_100g = parseFloat(d.saturated_fat_100g);
            d.butyric_acid_100g = parseFloat(d.butyric_acid_100g);
            d.caproic_acid_100g = parseFloat(d.caproic_acid_100g);
            d.caprylic_acid_100g = parseFloat(d.caprylic_acid_100g);
            d.capric_acid_100g = parseFloat(d.capric_acid_100g);
            d.lauric_acid_100g = parseFloat(d.lauric_acid_100g);
            d.myristic_acid_100g = parseFloat(d.myristic_acid_100g);
            d.palmitic_acid_100g = parseFloat(d.palmitic_acid_100g);
            d.stearic_acid_100g = parseFloat(d.stearic_acid_100g);
            d.arachidic_acid_100g = parseFloat(d.arachidic_acid_100g);
            d.behenic_acid_100g = parseFloat(d.behenic_acid_100g);
            d.lignoceric_acid_100g = parseFloat(d.lignoceric_acid_100g);
            d.cerotic_acid_100g = parseFloat(d.cerotic_acid_100g);
            d.montanic_acid_100g = parseFloat(d.montanic_acid_100g);
            d.melissic_acid_100g = parseFloat(d.melissic_acid_100g);
            d.monounsaturated_fat_100g = parseFloat(d.monounsaturated_fat_100g);
            d.polyunsaturated_fat_100g = parseFloat(d.polyunsaturated_fat_100g);
            d.omega_3_fat_100g = parseFloat(d.omega_3_fat_100g);
            d.alpha_linolenic_acid_100g = parseFloat(d.alpha_linolenic_acid_100g);
            d.eicosapentaenoic_acid_100g = parseFloat(d.eicosapentaenoic_acid_100g);
            d.docosahexaenoic_acid_100g = parseFloat(d.docosahexaenoic_acid_100g);
            d.omega_6_fat_100g = parseFloat(d.omega_6_fat_100g);
            d.linoleic_acid_100g = parseFloat(d.linoleic_acid_100g);
            d.arachidonic_acid_100g = parseFloat(d.arachidonic_acid_100g);
            d.gamma_linolenic_acid_100g = parseFloat(d.gamma_linolenic_acid_100g);
            d.dihomo_gamma_linolenic_acid_100g = parseFloat(d.dihomo_gamma_linolenic_acid_100g);
            d.omega_9_fat_100g = parseFloat(d.omega_9_fat_100g);
            d.oleic_acid_100g = parseFloat(d.oleic_acid_100g);
            d.elaidic_acid_100g = parseFloat(d.elaidic_acid_100g);
            d.gondoic_acid_100g = parseFloat(d.gondoic_acid_100g);
            d.mead_acid_100g = parseFloat(d.mead_acid_100g);
            d.erucic_acid_100g = parseFloat(d.erucic_acid_100g);
            d.nervonic_acid_100g = parseFloat(d.nervonic_acid_100g);
            d.trans_fat_100g = parseFloat(d.trans_fat_100g);
            d.cholesterol_100g = parseFloat(d.cholesterol_100g);
            d.carbohydrates_100g = parseFloat(d.carbohydrates_100g);
            d.sugars_100g = parseFloat(d.sugars_100g);
            d.sucrose_100g = parseFloat(d.sucrose_100g);
            d.glucose_100g = parseFloat(d.glucose_100g);
            d.fructose_100g = parseFloat(d.fructose_100g);
            d.lactose_100g = parseFloat(d.lactose_100g);
            d.maltose_100g = parseFloat(d.maltose_100g);
            d.maltodextrins_100g = parseFloat(d.maltodextrins_100g);
            d.starch_100g = parseFloat(d.starch_100g);
            d.polyols_100g = parseFloat(d.polyols_100g);
            d.fiber_100g = parseFloat(d.fiber_100g);
            d.proteins_100g = parseFloat(d.proteins_100g);
            d.casein_100g = parseFloat(d.casein_100g);
            d.serum_proteins_100g = parseFloat(d.serum_proteins_100g);
            d.nucleotides_100g = parseFloat(d.nucleotides_100g);
            d.salt_100g = parseFloat(d.salt_100g);
            d.sodium_100g = parseFloat(d.sodium_100g);
            d.alcohol_100g = parseFloat(d.alcohol_100g);
            d.vitamin_a_100g = parseFloat(d.vitamin_a_100g);
            d.beta_carotene_100g = parseFloat(d.beta_carotene_100g);
            d.vitamin_d_100g = parseFloat(d.vitamin_d_100g);
            d.vitamin_e_100g = parseFloat(d.vitamin_e_100g);
            d.vitamin_k_100g = parseFloat(d.vitamin_k_100g);
            d.vitamin_c_100g = parseFloat(d.vitamin_c_100g);
            d.vitamin_b1_100g = parseFloat(d.vitamin_b1_100g);
            d.vitamin_b2_100g = parseFloat(d.vitamin_b2_100g);
            d.vitamin_pp_100g = parseFloat(d.vitamin_pp_100g);
            d.vitamin_b6_100g = parseFloat(d.vitamin_b6_100g);
            d.vitamin_b9_100g = parseFloat(d.vitamin_b9_100g);
            d.vitamin_b12_100g = parseFloat(d.vitamin_b12_100g);
            d.biotin_100g = parseFloat(d.biotin_100g);
            d.pantothenic_acid_100g = parseFloat(d.pantothenic_acid_100g);
            d.silica_100g = parseFloat(d.silica_100g);
            d.bicarbonate_100g = parseFloat(d.bicarbonate_100g);
            d.potassium_100g = parseFloat(d.potassium_100g);
            d.chloride_100g = parseFloat(d.chloride_100g);
            d.calcium_100g = parseFloat(d.calcium_100g);
            d.phosphorus_100g = parseFloat(d.phosphorus_100g);
            d.iron_100g = parseFloat(d.iron_100g);
            d.magnesium_100g = parseFloat(d.magnesium_100g);
            d.zinc_100g = parseFloat(d.zinc_100g);
            d.copper_100g = parseFloat(d.copper_100g);
            d.manganese_100g = parseFloat(d.manganese_100g);
            d.fluoride_100g = parseFloat(d.fluoride_100g);
            d.selenium_100g = parseFloat(d.selenium_100g);
            d.chromium_100g = parseFloat(d.chromium_100g);
            d.molybdenum_100g = parseFloat(d.molybdenum_100g);
            d.iodine_100g = parseFloat(d.iodine_100g);
            d.caffeine_100g = parseFloat(d.caffeine_100g);
            d.taurine_100g = parseFloat(d.taurine_100g);
            d.ph_100g = parseFloat(d.ph_100g);
            d.fruits_vegetables_nuts_100g = parseFloat(d.fruits_vegetables_nuts_100g);
            d.collagen_meat_protein_ratio_100g = parseFloat(d.collagen_meat_protein_ratio_100g);
            d.cocoa_100g = parseFloat(d.cocoa_100g);
            d.chlorophyl_100g = parseFloat(d.chlorophyl_100g);
            d.carbon_footprint_100g = parseFloat(d.carbon_footprint_100g);
            d.nutrition_score_fr_100g = parseFloat(d.nutrition_score_fr_100g);
            d.nutrition_score_uk_100g = parseFloat(d.nutrition_score_uk_100g);
        });
        return data;
    }
};

d3.json("../data/world-countries.json", function (error, world_countries) {
    d3.csv("../data/world-food-facts/FoodFacts_filtered.csv", function (data) {
        data = setup.cleanData(data);
        var crsData = crossfilter(data);

        var countryDimension = crsData.dimension(function (data) {
            return data['countries_en'].split(',');
        });

        var countryGrp = countryDimension.group().reduceCount();

        setup.setupWorldMap(countryDimension, countryGrp, world_countries);

        var sugarDimension = crsData.dimension(function (data) {
           return Math.floor(data['sugars_100g'] / 10);
        });

        var sugarGroup = sugarDimension.group().reduceCount();

        // Set up fat and sugar line charts.
        sugarChart
            .width(400)
            .height(300)
            .transitionDuration(1000)
            .margins({top: 30, right: 50, bottom: 25, left: 40})
            .dimension(countryDimension)
            .x(d3.time.scale().domain([0, 10]))
            .elasticY(true)
            .group(sugarGroup);

        dc.renderAll();
        console.log("Finished loading.");
    });
});
