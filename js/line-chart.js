document.addEventListener("DOMContentLoaded", () => {
    // Get the section for the chart and layout
    const migrationSection = document.getElementById("migration-chart-section");

    // smaller box for instructions
    const instructionContainer = document.createElement("div");
    instructionContainer.className = "info-container";
    instructionContainer.innerHTML = `<p style="text-align: center; margin: 0;">Click on a region to view its routes, then select a route to explore migrant deaths over time.</p>`;
    migrationSection.insertBefore(instructionContainer, migrationSection.querySelector("#chart-container"));

    const regions = {
        "North America": ["US-Mexico border crossing", "Caribbean to US", "Caribbean to Central America"],
        "Europe": ["Eastern Mediterranean", "Western Mediterranean", "Central Mediterranean", "English Channel to the UK"],
        "Africa": ["Sahara Desert crossing", "Western Africa / Atlantic route to the Canary Islands", "Horn of Africa Route", "Route to Southern Africa"],
        "Asia": ["Afghanistan to Iran", "Iran to Türkiye", "Northern Route from EHOA"],
    };

    const data = {}; // To store route-specific data
    let activeRoute = null; // Track selected route
    let activeRegion = null; // Track which region is expanded

    // main layout container
    const layout = document.createElement("div");
    layout.className = "layout";
    migrationSection.appendChild(layout);

    // top container for regions (horizontal layout)
    const regionsContainer = document.createElement("div");
    regionsContainer.className = "regions-container";
    layout.appendChild(regionsContainer);

    // center content for chart and summary side by side
    const centerContent = document.createElement("div");
    centerContent.className = "center-content";
    layout.appendChild(centerContent);

    // Move the existing chart-container inside centerContent
    const chartContainer = migrationSection.querySelector("#chart-container");
    chartContainer.className = "chart-container";
    centerContent.appendChild(chartContainer);

    // summary Box
    const summaryBox = document.createElement("div");
    summaryBox.className = "box summary-box";
    centerContent.appendChild(summaryBox);

    const summaryTitle = document.createElement("h3");
    summaryTitle.textContent = "Route Summary";
    summaryBox.appendChild(summaryTitle);

    const summaryContent = document.createElement("p");
    summaryContent.id = "summary-text";
    summaryContent.textContent = "No summary available for this route.";
    summaryBox.appendChild(summaryContent);

    // populate top-level region buttons
    Object.entries(regions).forEach(([regionName, routeArr]) => {
        const regionButton = document.createElement("button");
        regionButton.className = "region-button";
        regionButton.textContent = regionName;
        regionsContainer.appendChild(regionButton);

        // Create route list container
        const routeList = document.createElement("div");
        routeList.className = "route-list";

        routeArr.forEach(route => {
            const routeItem = document.createElement("div");
            routeItem.className = "route-item";
            routeItem.textContent = route;
            routeItem.addEventListener("click", () => {
                document.querySelectorAll(".route-item").forEach((item) => {
                    item.style.backgroundColor = ""; // Reset all items
                    item.style.color = "";
                });
                routeItem.style.backgroundColor = "#58a6ff";
                routeItem.style.color = "#1e1e2f";
                activeRoute = route;
                updateChart(route);
                updateSummary(route);
            });
            routeList.appendChild(routeItem);
        });

        // Toggle region logic
        regionButton.addEventListener("click", () => {
            if (activeRegion === regionName) {
                // If clicking the same region again, revert to showing all regions
                removeRouteLists();
                activeRegion = null;
                showAllRegions();
            } else {
                // Show only this region and its routes
                removeRouteLists();
                hideOtherRegions(regionName);
                regionsContainer.appendChild(routeList);
                activeRegion = regionName;
            }
        });
    });

    function showAllRegions() {
        // Show all region buttons again
        Array.from(regionsContainer.querySelectorAll(".region-button")).forEach(btn => {
            btn.style.display = "inline-block";
        });
    }

    function hideOtherRegions(selectedRegion) {
        Array.from(regionsContainer.querySelectorAll(".region-button")).forEach(btn => {
            if (btn.textContent !== selectedRegion) {
                btn.style.display = "none";
            }
        });
    }

    function removeRouteLists() {
        // Remove any currently displayed route lists
        const displayedLists = regionsContainer.querySelectorAll(".route-list");
        displayedLists.forEach(list => list.remove());

        // Show all regions again if needed
        showAllRegions();
    }

    // D3 Chart Setup
    const svg = d3.select("#migration-chart");
    const margin = { top: 20, right: 20, bottom: 80, left: 80 };
    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleLinear().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const xAxisGroup = chartGroup.append("g")
        .attr("transform", `translate(0,${height})`);
    const yAxisGroup = chartGroup.append("g");

    const line = d3.line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.deaths))
        .curve(d3.curveCardinal);

    const chartPath = chartGroup.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#58a6ff")
        .attr("stroke-width", 2);

    // x-axis label
    if (svg.select(".x-axis-label").empty()) {
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", margin.left + width / 2)
            .attr("y", margin.top + height + 50)
            .text("Year");
    }

    // y-axis label
    if (svg.select(".y-axis-label").empty()) {
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("x", -(margin.top + height / 2))
            .attr("y", 20)
            .attr("transform", "rotate(-90)")
            .text("Number of Dead or Missing");
    }

    function updateChart(route) {
        const routeData = data[route];
        if (!routeData || !routeData.length) {
            chartPath.attr("d", null);
            xAxisGroup.call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
            yAxisGroup.call(d3.axisLeft(yScale));
            return;
        }

        xScale.domain(d3.extent(routeData, (d) => d.year));
        yScale.domain([0, d3.max(routeData, (d) => d.deaths) * 1.1]);

        chartPath.datum(routeData)
            .transition()
            .duration(750)
            .attr("d", line);

        xAxisGroup.transition().duration(750)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
        yAxisGroup.transition().duration(750)
            .call(d3.axisLeft(yScale));
    }

    function updateSummary(route) {
        const summaries = {
            "US-Mexico border crossing": "Approximately 5,300 deaths were recorded from 2014 to 2024, averaging 530 deaths per year.",
            "Eastern Mediterranean": "Approximately 10,000 deaths were recorded from 2014 to 2024, averaging 1,000 deaths per year.",
            "English Channel to the UK": "Approximately 300 deaths were recorded from 2014 to 2024, averaging 30 deaths per year.",
            "Caribbean to US": "Approximately 2,300 deaths were recorded from 2014 to 2024, averaging 230 deaths per year.",
            "Western Mediterranean": "Approximately 1,600 deaths were recorded from 2014 to 2024, averaging 160 deaths per year.",
            "Central Mediterranean": "Approximately 15,000 deaths were recorded from 2014 to 2024, averaging 1,500 deaths per year.",
            "Haiti to Dominican Republic": "Approximately 250 deaths were recorded from 2014 to 2024, averaging 25 deaths per year.",
            "Eastern Route to/from EHOA": "Approximately 4,500 deaths were recorded from 2014 to 2024, averaging 450 deaths per year.",
            "Route to Southern Africa": "Approximately 700 deaths were recorded from 2014 to 2024, averaging 70 deaths per year.",
            "Sahara Desert crossing": "Approximately 5,400 deaths were recorded from 2014 to 2024, averaging 540 deaths per year.",
            "Western Africa / Atlantic route to the Canary Islands": "Approximately 3,200 deaths were recorded from 2014 to 2024, averaging 320 deaths per year.",
            "Syria to Türkiye": "Approximately 400 deaths were recorded from 2014 to 2024, averaging 40 deaths per year.",
            "Western Balkans": "Approximately 450 deaths were recorded from 2014 to 2024, averaging 45 deaths per year.",
            "Türkiye-Europe land route": "Approximately 650 deaths were recorded from 2015 to 2024, averaging 65 deaths per year.",
            "Dominican Republic to Puerto Rico": "Approximately 200 deaths were recorded from 2015 to 2024, averaging 20 deaths per year.",
            "Northern Route from EHOA": "Approximately 150 deaths were recorded from 2015 to 2024, averaging 30 deaths per year.",
            "Sea crossings to Mayotte": "Approximately 450 deaths were recorded from 2015 to 2024, averaging 45 deaths per year.",
            "Darien": "Approximately 1,200 deaths were recorded from 2015 to 2024, averaging 120 deaths per year.",
            "Afghanistan to Iran": "Approximately 2,100 deaths were recorded from 2015 to 2024, averaging 210 deaths per year.",
            "Venezuela to Caribbean": "Approximately 70 deaths were recorded from 2015 to 2022, averaging 10 deaths per year.",
            "Horn of Africa Route": "Approximately 90 deaths were recorded from 2016 to 2022, averaging 15 deaths per year.",
            "Iran to Türkiye": "Approximately 350 deaths were recorded from 2016 to 2024, averaging 40 deaths per year.",
            "Italy to France": "Approximately 50 deaths were recorded from 2016 to 2024, averaging 6 deaths per year.",
            "DRC to Uganda": "Approximately 5 deaths were recorded in 2018, averaging 5 deaths for that year.",
            "Belarus-EU border": "Approximately 100 deaths were recorded from 2021 to 2024, averaging 25 deaths per year.",
            "Ukraine to Europe": "Approximately 20 deaths were recorded from 2022 to 2024, averaging 10 deaths per year.",
            "Caribbean to Central America": "Approximately 2 deaths were recorded from 2022 to 2024, averaging 1 death per year.",
        };
        summaryContent.textContent = summaries[route] || "No summary available for this route.";
    }

    // Load and process data
    d3.csv("data/Missing_Migrants_Global_Figures_allData.csv").then((rawData) => {
        rawData.forEach((d) => {
            const route = d["Migration Route"];
            const year = +d["Incident Year"];
            const deaths = +d["Number of Dead"];
            if (!data[route]) data[route] = {};
            if (!data[route][year]) data[route][year] = 0;
            data[route][year] += deaths;
        });

        Object.keys(data).forEach((route) => {
            data[route] = Object.entries(data[route]).map(([year, deaths]) => ({
                year: +year,
                deaths,
            }));
        });

        activeRoute = Object.keys(data)[0];
        updateChart(activeRoute);
        updateSummary(activeRoute);
    });
});
