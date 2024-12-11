// Constants for chart dimensions
const margin = { top: 40, right: 20, bottom: 40, left: 50 };
const width = 700 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// SVG setup
const svg = d3.select("#stacked-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip setup
const tooltip = d3.select("body")
    .append("div")
    .attr("id", "stacked-tooltip");

// Loading CSV and initialize dropdown
d3.csv("data/Missing_Migrants_Global_Figures_allData.csv").then(data => {
    // Preprocess the data
    data.forEach(d => {
        d["Incident Year"] = +d["Incident Year"];
        d["Number of Males"] = +d["Number of Males"] || 0;
        d["Number of Females"] = +d["Number of Females"] || 0;
        d["Total Number of Dead and Missing"] = +d["Total Number of Dead and Missing"] || 0;
    });

    const routes = [...new Set(data.map(d => d["Migration Route"]))].filter(Boolean);
    // Sort legend routes alphabetically without changing the chart data order
    const legendRoutes = [...routes].sort();

    // Populate gender filter dropdown
    d3.select("#gender-dropdown").on("change", function () {
        updateChart(this.value);
    });

    updateChart("all");

    function updateChart(selectedGender) {
        // Filter data by gender
        const filteredData = data.filter(d => {
            if (selectedGender === "male") return d["Number of Males"] > 0;
            if (selectedGender === "female") return d["Number of Females"] > 0;
            return true; // All genders
        });

        // Group data by year and calculate percentages for each route
        const groupedData = d3.group(filteredData, d => d["Incident Year"]);
        const years = Array.from(groupedData.keys()).sort();
        const stackData = years.map(year => {
            const yearData = groupedData.get(year) || [];
            const total = d3.sum(yearData, d => d["Total Number of Dead and Missing"]);
            const routePercentages = routes.reduce((acc, route) => {
                const routeTotal = d3.sum(
                    yearData.filter(d => d["Migration Route"] === route),
                    d => d["Total Number of Dead and Missing"]
                );
                acc[route] = total ? routeTotal / total : 0;
                return acc;
            }, {});
            return { year, ...routePercentages };
        });

        //  stack layout
        const stack = d3.stack().keys(routes);
        const stackedSeries = stack(stackData);

        //  scales
        const x = d3.scaleLinear().domain(d3.extent(years)).range([0, width]);
        const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        const color = d3.scaleOrdinal().domain(routes).range(d3.schemeCategory10);

        // x-axis
        const xAxis = svg.selectAll(".x-axis").data([0]);
        xAxis.enter()
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .merge(xAxis)
            .transition()
            .duration(750)
            .call(d3.axisBottom(x).ticks(years.length));

        // y-axis
        const yAxis = svg.selectAll(".y-axis").data([0]);
        yAxis.enter()
            .append("g")
            .attr("class", "y-axis")
            .merge(yAxis)
            .transition()
            .duration(750)
            .call(d3.axisLeft(y).tickFormat(d => `${Math.round(d * 100)}%`));

        //  X-axis label
        if (svg.select(".x-axis-label").empty()) {
            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 7)
                .style("fill", "#c9d1d9")
                .text("Year");
        }

        //  Y-axis label
        if (svg.select(".y-axis-label").empty()) {
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 15)
                .style("fill", "#c9d1d9")
                .text("Percentage of Dead or Missing Migrants");
        }

        // Bind the data to the layers
        const layers = svg.selectAll(".layer").data(stackedSeries, d => d.key);

        // Update existing layers
        layers.transition()
            .duration(750)
            .attr("fill", d => color(d.key))
            .attr("opacity", 0.8)
            .attr("d", d3.area()
                .x(d => x(d.data.year))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            );

        // Enter new layers
        layers.enter()
            .append("path")
            .attr("class", "layer")
            .attr("d", d3.area()
                .x(d => x(d.data.year))
                .y0(d => y(d[0]))
                .y1(d => y(d[1]))
            )
            .attr("fill", d => color(d.key))
            .attr("opacity", 0.8)
            .style("pointer-events", "all")
            .on("mouseover", (event, d) => {
                d3.selectAll(".layer").style("opacity", 0.3);
                d3.select(event.target).style("opacity", 1);

                const year = Math.round(x.invert(d3.pointer(event, svg.node())[0]));
                const yearDataPoint = d.find(pt => pt.data.year === year) || [0,0];
                const [lower, upper] = yearDataPoint;
                const percentage = (upper - lower) * 100;

                tooltip.html(
                    `<strong>Route:</strong> ${d.key}<br>
                     <strong>Year:</strong> ${year}<br>
                     <strong>Percentage:</strong> ${percentage.toFixed(2)}%`
                )
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`)
                    .style("display", "block");
            })
            .on("mousemove", (event) => {
                tooltip.style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
                d3.selectAll(".layer").style("opacity", 0.8);
                tooltip.style("display", "none");
            });

        // Exit old layers
        layers.exit().remove();

        //  reselect them to get the current set
        const updatedLayers = svg.selectAll(".layer");

        //  legend
        const legendContainer = d3.select("#route-legend").html("");
        const legendItems = legendContainer.selectAll(".legend-item")
            .data(legendRoutes)
            .enter()
            .append("div")
            .attr("class", "legend-item");

        // Append color box and add hover interaction with updatedLayers
        legendItems.append("div")
            .style("background-color", route => color(route))
            .style("width", "15px")
            .style("height", "15px")
            .style("margin-right", "5px")
            .on("mouseover", (event, route) => {
                d3.selectAll(".layer").style("opacity", 0.3);
                const targetLayer = updatedLayers.nodes().find(layer => layer.__data__.key === route);
                if (targetLayer) d3.select(targetLayer).style("opacity", 1);
            })
            .on("mouseout", () => d3.selectAll(".layer").style("opacity", 0.8));

        legendItems.append("span")
            .text(route => route);
    }

}).catch(error => console.error("Error loading data:", error));
