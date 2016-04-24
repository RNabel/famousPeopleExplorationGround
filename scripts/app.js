/**
 * Created by rn30 on 21/04/16.
 */
var globalCrsData = null,
    dataSet = null,
    mapContainer = $("#country-chooser");
var geoChart = dc.geoChoroplethChart("#country-chooser"),
    genderChart = dc.pieChart("#gender-chart"),
    timelineChart = dc.lineChart("#timeline-chart"),
    tableChart = dc.dataTable("#table-chart"),
    industriesChart = dc.pieChart('#industries-chart');

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
                .domain([0, 400, 4000])
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
    setupGenderChart: function (crsData) {
        var genderDimension = crsData.dimension(function (data) {
            return data.gender;
        });

        var genderGroup = genderDimension.group();

        // Set up fat and sugar line charts.
        genderChart
            .width(CHART_WIDTH)
            .height(CHART_HEIGHT)
            .transitionDuration(1000)
            .dimension(genderDimension)
            .group(genderGroup)
            .colors(d3.scale.ordinal().domain([0, 1]).range(["#4db6ac", "#009688"]));
    },

    setupTimelineChart: function (crsData) {
        var timeDimension = crsData.dimension(function (data) {
            return data.birthyear_date;
        });

        var totalGroup = timeDimension.group().reduceCount();

        timelineChart.width(990)
            .height(80)
            .margins({top: 0, right: 50, bottom: 20, left: 40})
            .dimension(timeDimension)
            .group(totalGroup)
            .x(d3.time.scale().domain([new Date(1700, 0, 1), new Date(2015, 11, 31)]))
            .round(d3.time.month.round)
            // .alwaysUseRounding(true)
            .xUnits(d3.time.months)
            .elasticY(true);
        timelineChart.ordinalColors(["#004d40"]);
    },

    // FIXME not working.
    setupDataCount: function (crsData) {
        var all = crsData.groupAll();

        dc.dataCount('.dc-data-count')
            .dimension(crsData)
            .group(all);
    },

    setupDataTable: function (crsData) {
        var dateDimension = crsData.dimension(function (d) {
            return d.birthyear_date;
        });

        tableChart
            .dimension(dateDimension)
            .group(function (d) {
                return d.birthyear_date.getFullYear()
            })
            .columns([
                "",
                "name",
                {
                    label: "Wikipedia link",
                    format: function (d) {
                        var title = d.name.replace(/ /g, "_");
                        var url = "https://en.wikipedia.org/wiki/" + title;
                        return url;
                    }
                }
            ])
            .sortBy(function (d) {
                return d.birthyear;
            })
            .order(d3.ascending)
            .on('renderlet', handlers.handleTableUpdate);
    },

    setupIndustriesChart: function (crsData) {
        var industriesDimension = crsData.dimension(function (data) {
            return data.industry;
        });

        var industriesGroup = industriesDimension.group();

        // Set up fat and sugar line charts.
        industriesChart
            .width(CHART_WIDTH)
            .height(CHART_HEIGHT)
            .transitionDuration(1000)
            .dimension(industriesDimension)
            .group(industriesGroup)
            .colors(d3.scale.category20b());
    },

    /**
     * Sets up and converts the data.
     * @param data
     * @returns {{}}
     */
    cleanData: function (data) {
        data.forEach(function (d) {
            // Convert dates.
            d.numlangs = parseInt(d.numlangs);
            d.country = d.countryCode3;
            d.birthyear = parseInt(d.birthyear);
            d.birthyear_date = new Date(d.birthyear, 0);
            d.TotalPageViews = parseInt(d.TotalPageViews);
            d.PageViewsEnglish = parseInt(d.PageViewsEnglish);
            d.PageViewsNonEnglish = parseInt(d.PageViewsNonEnglish);
        });
        return data;
    }
};

var handlers = {
    handleTableUpdate: function (table) {

        // Convert textual links to actual links.
        $(".dc-table-column._2").each(function (ind, d) {
            var el = $(d);
            // Add link.
            var insertionHTML = '<a href="' + el.text() + '" target="_blank">' + el.text() + '</a>';

            // Add button
            insertionHTML += '<a class="waves-effect waves-light btn info-button" style="float: right;">Expand</a>';

            // Add content.
            el.html(insertionHTML);
            // Add event listener to fetch more information.
            $('.info-button').unbind().click(handlers.handleInformationRequest);
        });
    },

    handleInformationRequest: function (ev) {
        var self = this;

        // Get name of the article.
        var link = $(ev.target).parent().text().replace("Expand", "");
        var linkSplit = link.split("/");
        var title = linkSplit[linkSplit.length - 1];
        title = title.replace(/_/g, " ");
        var requestUrl = "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&rvprop=content&titles=" + encodeURI(title) + "&format=json&callback=?";
        // https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Stack%20Overflow

        $.getJSON(requestUrl, function (data) {
            var insertionHTML = "<div class=\'additionalInfo\'>" + data.query.pages[Object.keys(data.query.pages)[0]].extract + "</div>";
            $(self).parent().append(insertionHTML);
        });

        // $.ajax({
        //     headers: {
        //         "Content-Type": "application/json; charset=UTF-8",
        //         "Origin": "https://wikipedia.com"
        //     },
        //     url: requestUrl,
        //     context: document.body
        // }).done(function(dat) {
        //     console.log(dat)
        // });
        console.log(title);
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
        setup.setupGenderChart(crsData);
        setup.setupTimelineChart(crsData);
        setup.setupDataCount(crsData);
        setup.setupDataTable(crsData);
        setup.setupIndustriesChart(crsData);

        dc.renderAll();
        console.log("Finished loading.");
    });
});
