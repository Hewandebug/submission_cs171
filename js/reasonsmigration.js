function createMigrationTree() {
    // Add the text box at the top
    const container = document.querySelector("#why-migrate");
    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";
    infoContainer.style.marginTop = "10px";
    infoContainer.style.padding = "10px";
    infoContainer.style.backgroundColor = "#34495e";
    infoContainer.style.color = "white";
    infoContainer.style.border = "1px solid #3498db";
    infoContainer.style.borderRadius = "5px";
    infoContainer.style.maxWidth = "600px";
    infoContainer.style.margin = "20px auto";
    infoContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";

    const textContent = `
        People migrate for countless reasons, seeking better opportunities, reuniting with loved ones, or escaping hardships. 
        From economic pursuits like higher wages and career growth to the warmth of family reunification or the safety of political stability, 
        migration is deeply personal and profoundly transformative. Environmental challenges, health needs, and the desire for a fresh start 
        also inspire people to journey toward new horizons.
    `;
    infoContainer.innerHTML = `<p style="line-height: 1.6; text-align: justify; margin: 0;">${textContent}</p>`;
    container.appendChild(infoContainer);

    // Add a smaller box for instructions
    const instructionContainer = document.createElement("div");
    instructionContainer.className = "info-container";
    instructionContainer.style.marginTop = "0px";
    instructionContainer.style.padding = "10px";
    instructionContainer.style.backgroundColor = "#2c3e50";
    instructionContainer.style.color = "white";
    instructionContainer.style.border = "1px solid #3498db";
    instructionContainer.style.borderRadius = "5px";
    instructionContainer.style.maxWidth = "400px"; // Smaller width
    instructionContainer.style.margin = "10px auto";
    instructionContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";
    instructionContainer.innerHTML = `<p style="text-align: center; margin: 0;">Click on the nodes to collapse or expand.</p>`;
    container.appendChild(instructionContainer);

    // Now on to creating tree
    const migrationData = {
        name: "Migration Reasons",
        children: [
            {
                name: "Economic Factors",
                children: [
                    { name: "Employment Opportunities" },
                    { name: "Better Wages" },
                    { name: "Business Prospects" },
                    { name: "Remittances for Families" }
                ]
            },
            {
                name: "Social Factors",
                children: [
                    {
                        name: "Family Reunification",
                        children: [
                            { name: "Marriage" },
                            { name: "Joining Diaspora Communities" }
                        ]
                    },
                    { name: "Community Support" },
                    { name: "Educational Opportunities" }
                ]
            },
            {
                name: "Political Factors",
                children: [
                    {
                        name: "Political Persecution",
                        children: [
                            { name: "Asylum Seeking" },
                            { name: "Refugee Status" }
                        ]
                    },
                    { name: "Armed Conflicts" },
                    { name: "Corruption and Instability" },
                    { name: "Seeking Freedom and Democracy" }
                ]
            },
            {
                name: "Environmental Factors",
                children: [
                    { name: "Natural Disasters" },
                    {
                        name: "Climate Change",
                        children: [
                            { name: "Rising Sea Levels" },
                            { name: "Droughts" },
                            { name: "Flooding" }
                        ]
                    },
                    { name: "Resource Scarcity" },
                    { name: "Agricultural Failures" }
                ]
            },
            {
                name: "Health and Safety",
                children: [
                    { name: "Access to Healthcare" },
                    { name: "Safety Concerns (e.g., Crime)" },
                    { name: "Epidemics and Disease" }
                ]
            },
            {
                name: "Personal Aspirations",
                children: [
                    { name: "Better Quality of Life" },
                    { name: "Desire for Change" }
                ]
            }
        ]
    };


    const margin = { top: 50, right: 400, bottom: 50, left: 400 };
    const width = 1600 - margin.left - margin.right;
    const height = 1200 - margin.top - margin.bottom;


    const svg = d3.select("#why-migrate")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-400 0 2000 1400")
        .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const treemap = d3.tree().size([height + 200, width]);    const root = d3.hierarchy(migrationData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;


    let i = 0;


    root.children.forEach(collapse);


    update(root);


    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
            d._children.forEach(collapse);
        }
    }


    function update(source) {
        const treeData = treemap(root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);


        nodes.forEach(d => (d.y = d.depth * 700));


        const node = svg.selectAll("g.node").data(nodes, d => d.id || (d.id = ++i));


        const nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .on("click", click);


        nodeEnter
            .append("circle")
            .attr("r", 1e-6)
            .style("fill", "lightblue")
            .style("stroke", d => (d._children ? "#2c7be5" : "none"))
            .style("stroke-width", d => (d._children ? "2px" : "0"))
            .attr("class", d => (d._children ? "pulsate" : "")) // Add pulsate class to expandable nodes
            .transition()
            .duration(750)
            .attr("r", 20);


        nodeEnter
            .append("text")
            .attr("class", "nodetitle")
            .attr("dy", 5)
            .attr("x", d => (d.children || d._children ? -30 : 30))
            .attr("text-anchor", d => (d.children || d._children ? "end" : "start"))
            .text(d => d.data.name)
            .style("fill", "white")
            .style("font-size", "38px");


        const nodeUpdate = nodeEnter.merge(node);


        nodeUpdate
            .transition()
            .duration(750)
            .attr("transform", d => `translate(${d.y},${d.x})`);


        nodeUpdate
            .select("circle")
            .style("fill", "#65b2d9")
            .style("stroke", d => (d._children ? "#2c7be5" : "none"))
            .style("stroke-width", d => (d._children ? "9px" : "0"))
            .attr("class", d => (d._children ? "pulsate" : ""));


        const nodeExit = node
            .exit()
            .transition()
            .duration(750)
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .remove();


        nodeExit.select("circle").attr("r", 1e-6);
        nodeExit.select("text").style("fill-opacity", 1e-6);


        const link = svg.selectAll("path.link").data(links, d => d.id);


        const linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal(o, o);
            })
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", "2px");


        const linkUpdate = linkEnter.merge(link);


        linkUpdate
            .transition()
            .duration(750)
            .attr("d", d => diagonal(d, d.parent));


        link.exit()
            .transition()
            .duration(750)
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return diagonal(o, o);
            })
            .remove();


        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });


        function diagonal(s, d) {
            return `M ${s.y} ${s.x}
         C ${(s.y + d.y) / 2} ${s.x},
           ${(s.y + d.y) / 2} ${d.x},
           ${d.y} ${d.x}`;
        }


        function click(event, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }


}


createMigrationTree();


