function initializeMigrationCases() {
    const container = document.querySelector("#transportation-types");
    container.innerHTML = "";

    const heading = document.createElement("h2");
    heading.innerText = "Types of Transportation Used by Migrants";
    heading.className = "section-title";
    container.appendChild(heading);
    // my tracker, sees what's running
    let activeInterval = null;

    const migrationCases = [
        {
            title: "Walking",
            description:
                "Walking is often the mode of migration chosen by refugees and displaced individuals who lack financial resources for transportation. It is the most accessible and affordable option, especially in remote areas where roads may be impassable or non-existent. However, this journey is fraught with challenges, as migrants often traverse harsh terrains such as deserts, jungles, or mountainous regions.",
            icon: "fa-shoe-prints",
            animation: function (animationContainer) {
                animationContainer.innerHTML = "";

                if (activeInterval) clearInterval(activeInterval);

                let pos = 0;

                function createFootprint() {
                    const footprint = document.createElement("i");
                    footprint.className = "fas fa-shoe-prints";
                    footprint.style.fontSize = "70px";
                    footprint.style.color = "#000000";
                    footprint.style.position = "absolute";
                    footprint.style.left = `${pos}px`;
                    footprint.style.top = "100px";
                    animationContainer.appendChild(footprint);

                    pos += 20;
                    if (pos > 400) pos = 0;
                }

                activeInterval = setInterval(() => {
                    animationContainer.innerHTML = "";
                    createFootprint();
                }, 200);
            },
        },
        {
            title: "Vehicles",
            description:
                "Vehicles, including cars, trucks, and buses, are commonly used by migrants who can afford some level of transport or have access to smugglers. This mode is prevalent for crossing borders or covering long distances where roads are available. For many, trucks are used in clandestine operations, with migrants hidden in cargo areas under unsafe and cramped conditions.",
            icon: "fa-truck",
            animation: function (animationContainer) {
                animationContainer.innerHTML = "";

                if (activeInterval) clearInterval(activeInterval);

                const car = document.createElement("i");
                car.className = "fas fa-truck";
                car.style.fontSize = "80px";
                car.style.color = "#f1c40f";
                car.style.position = "absolute";
                car.style.top = "80px";
                car.style.left = "0px";
                animationContainer.appendChild(car);

                let pos = 0;
                activeInterval = setInterval(() => {
                    pos += 5;
                    car.style.left = `${pos}px`;
                    if (pos > 400) pos = -20;
                }, 50);
            },
        },
        {
            title: "Sea Travel",
            description:
                "Traveling by sea is often the choice for migrants escaping across water bodies, such as refugees crossing the Mediterranean. Many rely on small, overcrowded dinghies provided by smugglers, risking perilous conditions and capsizing due to poor-quality vessels.",
            icon: "fa-ship",
            animation: function (animationContainer) {
                animationContainer.innerHTML = "";

                if (activeInterval) clearInterval(activeInterval);

                const boat = document.createElement("i");
                boat.className = "fas fa-ship";
                boat.style.fontSize = "80px";
                boat.style.color = "#ADD8E6";
                boat.style.position = "absolute";
                boat.style.top = "100px";
                boat.style.left = "0px";
                animationContainer.appendChild(boat);

                let pos = 0;
                activeInterval = setInterval(() => {
                    pos += 5;
                    boat.style.left = `${pos}px`;
                    // rocking motion!! :)
                    boat.style.transform = `rotate(${Math.sin(pos / 20) * 5}deg)`;
                    if (pos > 400) pos = -50;
                }, 50);
            },
        },
        {
            title: "Airplane Travel",
            description:
                "Airplane travel is the least common method of migration, often limited to individuals with significant financial resources or those accessing official resettlement programs. It may also be used by migrants who possess valid documentation or are seeking asylum upon arrival in a new country. While offering safety and speed, this mode of migration is inaccessible to most, reflecting the stark inequalities in global migration pathways.",
            icon: "fa-plane",
            animation: function (animationContainer) {
                animationContainer.innerHTML = "";

                if (activeInterval) clearInterval(activeInterval);

                const plane = document.createElement("i");
                plane.className = "fas fa-plane";
                plane.style.fontSize = "80px";
                plane.style.color = "#808080";
                plane.style.position = "absolute";
                plane.style.top = "60px";
                plane.style.left = "0px";
                animationContainer.appendChild(plane);

                let pos = -30;
                let altitude = 60;
                let direction = 1;

                activeInterval = setInterval(() => {
                    pos += 5;
                    altitude += direction * 1.5;

                    if (altitude > 90 || altitude < 40) direction *= -1;

                    plane.style.left = `${pos}px`;
                    plane.style.top = `${altitude}px`;

                    if (pos > 400) pos = -30;
                }, 50);
            },
        },

        {
            title: "Unconventional Methods",
            description:
                "Unconventional methods include hidden compartments, tunnels, and other secretive or creative routes. These methods are often used in desperation, exposing migrants to extreme dangers and inhumane conditions.",
            icon: "fa-question-circle",
            animation: function (animationContainer) {
                animationContainer.innerHTML = "";

                if (activeInterval) clearInterval(activeInterval);

                // Tunnels Section
                const tunnelContainer = document.createElement("div");
                tunnelContainer.style.position = "absolute";
                tunnelContainer.style.width = "50%";
                tunnelContainer.style.height = "100%";
                tunnelContainer.style.left = "0";
                tunnelContainer.style.top = "0";
                tunnelContainer.style.borderRight = "1px solid #3498db";
                animationContainer.appendChild(tunnelContainer);

                const tunnel = document.createElement("div");
                tunnel.style.width = "80%";
                tunnel.style.height = "50px";
                tunnel.style.backgroundColor = "#34495e";
                tunnel.style.border = "1px solid #2ecc71";
                tunnel.style.position = "absolute";
                tunnel.style.top = "75px";
                tunnel.style.left = "10%";
                tunnelContainer.appendChild(tunnel);

                const personInTunnel = document.createElement("i");
                personInTunnel.className = "fas fa-person-walking";
                personInTunnel.style.fontSize = "30px";
                personInTunnel.style.color = "#e74c3c";
                personInTunnel.style.position = "absolute";
                personInTunnel.style.top = "85px";
                personInTunnel.style.left = "10%";
                tunnelContainer.appendChild(personInTunnel);

                let tunnelPos = 10;
                setInterval(() => {
                    tunnelPos += 1;
                    personInTunnel.style.left = `${tunnelPos}%`;
                    if (tunnelPos > 77) tunnelPos = 10;
                }, 50);

                // Hidden Compartments Section
                const hiddenCompartmentContainer = document.createElement("div");
                hiddenCompartmentContainer.style.position = "absolute";
                hiddenCompartmentContainer.style.width = "50%";
                hiddenCompartmentContainer.style.height = "100%";
                hiddenCompartmentContainer.style.left = "50%";
                hiddenCompartmentContainer.style.top = "0";
                animationContainer.appendChild(hiddenCompartmentContainer);

                const truck = document.createElement("i");
                truck.className = "fas fa-truck";
                truck.style.fontSize = "80px";
                truck.style.color = "#f1c40f";
                truck.style.position = "absolute";
                truck.style.top = "75px";
                truck.style.left = "25%";
                hiddenCompartmentContainer.appendChild(truck);

                const hiddenCompartment = document.createElement("div");
                hiddenCompartment.style.width = "30px";
                hiddenCompartment.style.height = "30px";
                hiddenCompartment.style.backgroundColor = "#34495e";
                hiddenCompartment.style.position = "absolute";
                hiddenCompartment.style.top = "85px";
                hiddenCompartment.style.left = "35%";
                hiddenCompartment.style.border = "1px solid #2ecc71";
                hiddenCompartment.style.borderRadius = "5px";
                hiddenCompartmentContainer.appendChild(hiddenCompartment);

                const personInCompartment = document.createElement("i");
                personInCompartment.className = "fas fa-person";
                personInCompartment.style.fontSize = "20px";
                personInCompartment.style.color = "#e74c3c";
                personInCompartment.style.position = "absolute";
                personInCompartment.style.top = "90px";
                personInCompartment.style.left = "36%";
                personInCompartment.style.visibility = "hidden";
                hiddenCompartmentContainer.appendChild(personInCompartment);

                let isOpen = false;
                setInterval(() => {
                    if (isOpen) {
                        hiddenCompartment.style.backgroundColor = "#34495e";
                        personInCompartment.style.visibility = "hidden";
                    } else {
                        hiddenCompartment.style.backgroundColor = "#2ecc71";
                        personInCompartment.style.visibility = "visible";
                    }
                    isOpen = !isOpen;
                }, 1000);
            },
        },
    ];

    const flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.gap = "20px";
    flexContainer.style.justifyContent = "center";
    flexContainer.style.marginTop = "20px";
    container.appendChild(flexContainer);

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";
    infoContainer.style.marginTop = "20px";
    infoContainer.style.padding = "15px";
    infoContainer.style.backgroundColor = "#34495e";
    infoContainer.style.color = "white";
    infoContainer.style.border = "1px solid #3498db";
    infoContainer.style.borderRadius = "5px";
    infoContainer.style.maxWidth = "600px";
    infoContainer.style.margin = "20px auto";
    infoContainer.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";
    container.appendChild(infoContainer);

    const animationContainer = document.createElement("div");
    animationContainer.className = "animation-container";
    animationContainer.style.position = "relative";
    animationContainer.style.width = "500px";
    animationContainer.style.height = "200px";
    animationContainer.style.margin = "20px auto";
    animationContainer.style.border = "1px solid #3498db";
    animationContainer.style.borderRadius = "5px";
    animationContainer.style.backgroundColor = "#2c3e50";
    container.appendChild(animationContainer);

    migrationCases.forEach((item) => {
        const caseDiv = document.createElement("div");
        caseDiv.className = 'button';
        caseDiv.style.width = "150px";
        caseDiv.style.height = "150px";
        caseDiv.style.backgroundColor = "#2c3e50";
        caseDiv.style.border = "2px solid #3498db";
        caseDiv.style.color = "white";
        caseDiv.style.fontSize = "16px";
        caseDiv.style.fontWeight = "bold";
        caseDiv.style.textAlign = "center";
        caseDiv.style.display = "flex";
        caseDiv.style.flexDirection = "column";
        caseDiv.style.alignItems = "center";
        caseDiv.style.justifyContent = "center";
        caseDiv.style.cursor = "pointer";
        caseDiv.style.borderRadius = "10px";
        caseDiv.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";
        caseDiv.innerHTML = `<i class="fas ${item.icon}" style="font-size: 40px; margin-bottom: 10px;"></i>${item.title}`;

        caseDiv.addEventListener("click", () => {
            infoContainer.innerText = item.description;
            animationContainer.innerHTML = ""; // Clear animation container
            item.animation(animationContainer); // Start the selected animation
        });

        flexContainer.appendChild(caseDiv);
    });

    migrationCases[0].animation(animationContainer);
    infoContainer.innerText = migrationCases[0].description;
}

document.addEventListener("DOMContentLoaded", initializeMigrationCases);










