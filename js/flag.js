const regionMapping = {
    "Africa": [
        "Somalia", "Kenya", "Ethiopia", "Sudan", "South Sudan", "Nigeria", "Ghana", "Libya", "Zimbabwe",
        "Chad", "Mali", "Niger", "Madagascar", "Mozambique", "Côte D'Ivoire", "Sierra Leone", "Zambia",
        "Togo", "Angola", "Comoros", "Mauritania", "Burkina Faso", "Lesotho", "Malawi", "Liberia",
        "Democratic Republic Of The Congo", "Eritrea", "Central African Republic", "Cameroon", "Gambia",
        "Senegal", "Guinea", "Guinea-Bissau", "Algeria", "Tunisia", "Morocco", "Rwanda", "Uganda"
    ],
    "Asia": [
        "Afghanistan", "Syria", "Bangladesh", "Pakistan", "Iran", "India", "Myanmar", "Nepal", "Yemen",
        "Turkey", "Philippines", "Indonesia", "Sri Lanka", "Viet Nam", "Georgia", "Uzbekistan", "Lebanon",
        "Jordan", "Laos", "Kazakhstan", "Kyrgyzstan", "Thailand", "Malaysia", "State Of Palestine", "Cambodia"
    ],
    "Europe": [
        "Ukraine", "Russia", "France", "Italy", "Turkey", "Greece", "Albania", "Hungary", "Romania",
        "United Kingdom", "Germany", "Spain", "Sweden", "Switzerland", "Norway", "Belgium"
    ],
    "Americas": [
        "Mexico", "Guatemala", "El Salvador", "Honduras", "Brazil", "Colombia", "Haiti", "Venezuela",
        "Argentina", "Chile", "Ecuador", "Bolivia", "Paraguay", "Costa Rica", "Panama", "Cuba",
        "Dominican Republic", "Canada", "United States of America", "Jamaica", "Trinidad and Tobago",
        "Guyana", "Belize", "Nicaragua", "Uruguay"
    ],

};

// Preprocess Data
function preprocessData(data) {
    const aggregatedData = {};

    data.forEach(d => {
        const countriesRaw = d["Country of Origin"];
        const migrants = +d["Total Number of Dead and Missing"] || 0;

        if (!countriesRaw || migrants === 0) return;

        const countries = countriesRaw
            .split(",")
            .map(c => c.trim());

        countries.forEach(country => {
            const region = Object.keys(regionMapping).find(r =>
                regionMapping[r].includes(country)
            );

            if (!region) return;

            if (!aggregatedData[region]) {
                aggregatedData[region] = { region, children: [] };
            }

            const countryData = aggregatedData[region].children.find(c => c.country === country);
            if (countryData) {
                countryData.migrants += migrants / countries.length; // Divide migrants evenly
            } else {
                aggregatedData[region].children.push({ country, migrants: migrants / countries.length });
            }
        });
    });

    return { children: Object.values(aggregatedData) };
}


function initializeMigrationOrigins() {
    const container = document.querySelector("#migration-origins");
    container.innerHTML = "";

    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.backgroundColor = "black";
    container.style.width = "100%";
    container.style.height = "100vh";
    container.style.padding = "20px";

    const heading = document.createElement("h2");
    heading.innerText = "Where Are Missing Migrants From?";
    heading.className = "section-title";
    container.appendChild(heading);


    // Create Dropdown
    const dropdownContainer = document.createElement("div");
    dropdownContainer.style.textAlign = "center";
    dropdownContainer.style.marginBottom = "15px";

    const dropdownLabel = document.createElement("label");
    dropdownLabel.innerText = "Filter by Region: ";
    dropdownLabel.style.color = "white";
    dropdownLabel.style.marginRight = "10px";
    dropdownLabel.style.fontSize = "14px";

    const dropdown = document.createElement("select");
    dropdown.id = "region-select";
    dropdown.style.padding = "8px";
    dropdown.style.fontSize = "14px";
    dropdown.style.backgroundColor = "#444";
    dropdown.style.color = "white";
    dropdown.style.border = "none";
    dropdown.style.borderRadius = "5px";

    dropdownContainer.appendChild(dropdownLabel);
    dropdownContainer.appendChild(dropdown);
    container.appendChild(dropdownContainer);

    // SVG Container
    const svg = d3
        .select(container)
        .append("svg")
        .attr("id", "packed-circles-svg")
        .style("flex-grow", "1")
        .attr("width", "100%")
        .attr("height", "100%");

    const g = svg.append("g").attr("id", "circle-group");

    // Tooltip
    const tooltip = d3
        .select(container)
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#444")
        .style("color", "#fff")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("opacity", 0)
        .style("pointer-events", "none")
        .style("transition", "opacity 0.3s ease");

    // Fetch Data and Render Visualization
    d3.csv("data/Missing_Migrants_Global_Figures_allData.csv").then((rawData) => {
        const processedData = preprocessData(rawData);

        const hierarchyData = d3
            .hierarchy(processedData)
            .sum((d) => d.migrants * 2);

        const pack = d3
            .pack()
            .size([window.innerWidth * 0.9, window.innerHeight * 0.9])
            .padding(10);

        const root = pack(hierarchyData);

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // lift circles up, they keep getting cut off
        const verticalOffset = 100;

        const updateTransform = (scale = 1, x = 0, y = 0) => {
            g.transition()
                .duration(1000)
                .attr("transform", `translate(${x}, ${y}) scale(${scale})`);
        };

        const resetTransform = () => {
            updateTransform(1, centerX - root.x, centerY - root.y - verticalOffset);
        };

        resetTransform();

        // Region groups
        const regionGroups = g
            .selectAll("g")
            .data(root.children)
            .join("g")
            .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

        // Region Circles
        regionGroups
            .append("circle")
            .attr("r", (d) => d.r)
            .attr("fill", "#34495e")
            .attr("stroke", "#3b8cc5")
            .attr("stroke-width", 2);

        // Country Circles and Labels
        const countryGroups = regionGroups
            .selectAll("circle.country")
            .data((d) => d.children || [])
            .join("g")
            .attr(
                "transform",
                (d) => `translate(${d.x - d.parent.x},${d.y - d.parent.y})`
            );

        countryGroups
            .append("circle")
            .attr("r", (d) => d.r)
            .attr("fill", "#65b2d9")
            .attr("stroke", "white")
            .on("mouseover", function (event, d) {
                tooltip
                    .style("opacity", 1)
                    .style("left", `${event.pageX + 5}px`)
                    .style("top", `${event.pageY - 28}px`)
                    .text(`${d.data.country}: ${Math.round(d.value)} missing migrants`);
            })
            .on("mouseout", () => tooltip.style("opacity", 0));

        countryGroups
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .style("fill", "white")
            .style("font-size", (d) => `${Math.max(10, d.r / 3)}px`)
            .text((d) => (d.r > 15 ? d.data.country : ""));

        // Dropdown logic
        const regions = ["All"].concat(root.children.map((d) => d.data.region));
        d3.select(dropdown)
            .selectAll("option")
            .data(regions)
            .join("option")
            .attr("value", (d) => d)
            .text((d) => d);

        // Filtering
        dropdown.addEventListener("change", () => {
            const selectedRegion = dropdown.value;

            if (selectedRegion === "All") {
                resetTransform();
                regionGroups.style("opacity", 1).style("display", "block");
            } else {
                const target = root.children.find((d) => d.data.region === selectedRegion);

                const scale = Math.min(
                    (window.innerWidth * 0.8) / target.r / 2,
                    (window.innerHeight * 0.8) / target.r / 2
                );

                const x = -target.x * scale + centerX;
                const y = -target.y * scale + centerY - verticalOffset;

                updateTransform(scale, x, y);

                regionGroups
                    .style("opacity", (d) =>
                        d.data.region === selectedRegion ? 1 : 0
                    )
                    .style("display", (d) =>
                        d.data.region === selectedRegion ? "block" : "none"
                    );
            }
        });
    });

    // Handle Window Resize
    window.addEventListener("resize", () => {
        svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
        resetTransform();
    });
}
document.addEventListener("DOMContentLoaded", initializeMigrationOrigins);


