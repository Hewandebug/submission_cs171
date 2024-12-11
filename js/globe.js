document.addEventListener("DOMContentLoaded", () => {
    const width = 800;
    const height = 800;


    const container = d3.select("#globe-container")
        .style("position", "relative")
        .style("width", width + "px")
        .style("margin", "0 auto");


    const svg = container
        .append("svg")
        .attr("id", "globe-svg")
        .attr("width", width)
        .attr("height", height)
        .style("display", "block");


    // Enhanced card-style tooltip
    const tooltip_globe = container
        .append("div")
        .attr("id", "tooltip_globe")
        .style("position", "absolute")
        .style("width", "300px")
        .style("padding", "20px")
        .style("border-radius", "10px")
        .style("background", "#2b2b2b")
        .style("color", "#ffffff")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "18px")
        .style("line-height", "1.5em")
        .style("box-shadow", "0 6px 12px rgba(0,0,0,0.4)")
        .style("visibility", "hidden")
        .style("top", "60px")
        .style("left", (width + 50) + "px") // To the right, adjust as needed
        .style("border", "2px solid #ff0000");


    const projection = d3
        .geoOrthographic()
        .scale(300)
        .translate([width / 2, height / 2])
        .clipAngle(90);


    const path = d3.geoPath(projection);


    let rotation = projection.rotate();
    let isDragging = false;


    function isVisible(coord) {
        const [longitude, latitude] = coord;
        const coords = projection([longitude, latitude]);
        if (!coords) return false;
        const [x, y] = coords;
        if (x < 0 || x > width || y < 0 || y > height) return false;
        const r = projection.rotate();
        const c = [-r[0], -r[1]];
        const distance = d3.geoDistance([longitude, latitude], c);
        return distance <= Math.PI / 2;
    }


    svg
        .append("path")
        .datum({ type: "Sphere" })
        .attr("class", "sphere")
        .attr("d", path)
        .style("fill", "black");


    const graticule = d3.geoGraticule();


    svg
        .append("path")
        .datum(graticule())
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", "#505050")
        .style("stroke-width", 0.5)
        .style("opacity", 0.7);


    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
        d3.csv("data/Missing_Migrants_Global_Figures_allData.csv")
    ]).then(([world, migrationData]) => {
        const countries = svg
            .selectAll(".country")
            .data(world.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", "#333");


        // Mapping from country name to centroid
        const countryCentroids = {};
        world.features.forEach(feature => {
            const countryName = feature.properties.name;
            const centroid = d3.geoCentroid(feature);
            countryCentroids[countryName] = centroid;
        });


        // Aggregate migration data
        const migrationCounts = {};
        migrationData.forEach(d => {
            const origin = d['Country of Origin'];
            const destination = d['Country of Incident'];
            if (origin && destination && origin !== 'Unknown' && destination !== 'Unknown') {
                if (!migrationCounts[origin]) {
                    migrationCounts[origin] = {};
                }
                if (!migrationCounts[origin][destination]) {
                    migrationCounts[origin][destination] = 0;
                }
                migrationCounts[origin][destination]++;
            }
        });


        // Determine top incident destinations for each origin
        const topDestinations = {};
        for (const origin in migrationCounts) {
            let maxCount = 0;
            let topDestination = null;
            for (const destination in migrationCounts[origin]) {
                const count = migrationCounts[origin][destination];
                if (count > maxCount) {
                    maxCount = count;
                    topDestination = destination;
                }
            }
            if (topDestination) {
                topDestinations[origin] = topDestination;
            }
        }


        // Store routes for arcs
        const routes = [];
        for (const origin in topDestinations) {
            const destination = topDestinations[origin];
            const originCentroid = countryCentroids[origin];
            const destinationCentroid = countryCentroids[destination];
            if (originCentroid && destinationCentroid) {
                routes.push({
                    origin,
                    destination,
                    originCentroid,
                    destinationCentroid
                });
            }
        }


        // Draw arcs
        const arcs = svg.selectAll(".migration-arc")
            .data(routes)
            .enter()
            .append("path")
            .attr("class", "migration-arc")
            .style("stroke", "#ff0000")
            .style("fill", "none")
            .style("opacity", 0.7)
            .style("stroke-width", 4.5)
            .on("mouseover", (event, d) => {
                tooltip_globe.style("visibility", "visible")
                    .html(`
                      <div style="font-size:22px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">Route Info</div>
                      <div><strong>Origin:</strong> ${d.origin}</div>
                      <div><strong>Incident:</strong> ${d.destination}</div>
                   `);
            })
            .on("mouseout", () => {
                tooltip_globe.style("visibility", "hidden");
            });


        // Origin circles
        const originDots = svg.selectAll(".origin-circle")
            .data(routes)
            .enter()
            .append("circle")
            .attr("class", "origin-circle")
            .attr("r", 3)
            .style("fill", "#007bff")
            .on("mouseover", (event, d) => {
                tooltip_globe.style("visibility", "visible")
                    .html(`
                      <div style="font-size:22px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">Origin Info</div>
                      <div><strong>Origin:</strong> ${d.origin}</div>
                   `);
            })
            .on("mouseout", () => {
                tooltip_globe.style("visibility", "hidden");
            });


        // Destination circles
        const destinationDots = svg.selectAll(".destination-circle")
            .data(routes)
            .enter()
            .append("circle")
            .attr("class", "destination-circle")
            .attr("r", 3)
            .style("fill", "#ff0000")
            .on("mouseover", (event, d) => {
                tooltip_globe.style("visibility", "visible")
                    .html(`
                      <div style="font-size:22px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">Destination Info</div>
                      <div><strong>Incident:</strong> ${d.destination}</div>
                   `);
            })
            .on("mouseout", () => {
                tooltip_globe.style("visibility", "hidden");
            });


        // On hover over a country, show only the top incident
        countries
            .on("mouseover", (event, d) => {
                const countryName = d.properties.name;
                // Check if we have a top destination for this origin
                if (topDestinations[countryName]) {
                    const topDest = topDestinations[countryName];
                    const count = migrationCounts[countryName][topDest];
                    tooltip_globe.style("visibility", "visible").html(`
                       <div style="font-size:22px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">${countryName}</div>
                       <div><strong>Top Incident Destination:</strong></div>
                       <div style="margin-top:5px;">${topDest}</div>
                   `);
                } else {
                    // No origin data for this country
                    tooltip_globe.style("visibility", "visible")
                        .html(`
                           <div style="font-size:22px; font-weight:bold; margin-bottom:15px; text-transform:uppercase;">${countryName}</div>
                           <div>No top incident data available for this origin.</div>
                       `);
                }
            })
            .on("mouseout", () => {
                tooltip_globe.style("visibility", "hidden");
            });


        function redraw() {
            arcs.attr("d", d => {
                const interpolate = d3.geoInterpolate(d.originCentroid, d.destinationCentroid);
                const arcCoordinates = Array.from({ length: 100 }, (_, i) => interpolate(i / 99));
                const arc = {
                    type: "LineString",
                    coordinates: arcCoordinates
                };
                return path(arc);
            });


            originDots
                .attr("cx", d => isVisible(d.originCentroid) ? projection(d.originCentroid)[0] : -9999)
                .attr("cy", d => isVisible(d.originCentroid) ? projection(d.originCentroid)[1] : -9999);


            destinationDots
                .attr("cx", d => isVisible(d.destinationCentroid) ? projection(d.destinationCentroid)[0] : -9999)
                .attr("cy", d => isVisible(d.destinationCentroid) ? projection(d.destinationCentroid)[1] : -9999);


            svg.select(".sphere").attr("d", path);
            svg.select(".graticule").attr("d", path);
            countries.attr("d", path);
        }


        const drag = d3
            .drag()
            .on("start", () => {
                isDragging = true;
                rotation = projection.rotate();
            })
            .on("drag", event => {
                const sens = 0.25;
                const [dx, dy] = [event.dx * sens, event.dy * sens];
                rotation[0] += dx;
                rotation[1] -= dy;
                projection.rotate(rotation);
                redraw();
            })
            .on("end", () => {
                isDragging = false;
            });


        svg.call(drag);


        function rotateGlobe() {
            if (!isDragging) {
                rotation[0] += 0.05;
                projection.rotate(rotation);
                redraw();
            }
            requestAnimationFrame(rotateGlobe);
        }


        rotateGlobe();
    });


    // Legend
    const legend = container.append("div")
        .attr("id", "legend")
        .style("position", "absolute")
        .style("top", "20px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("box-shadow", "0 6px 12px rgba(0,0,0,0.4)")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "14px");


    const legendItems = [
        { color: "#ff0000", label: "Countries of Incident" },
        { color: "#007bff", label: "Countries of Origin" }
    ];


    legendItems.forEach(item => {
        const itemDiv = legend.append("div").style("margin-bottom", "5px");
        itemDiv.append("span")
            .style("display", "inline-block")
            .style("width", "10px")
            .style("height", "10px")
            .style("background-color", item.color)
            .style("margin-right", "5px");
        itemDiv.append("span")
            .text(item.label);
    });
});
