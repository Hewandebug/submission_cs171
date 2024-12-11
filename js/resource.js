document.addEventListener("DOMContentLoaded", () => {
    const resources = [
        {
            title: "Make a Difference",
            description: "Your contributions can save lives and support vulnerable communities. Find organizations actively addressing migration challenges.",
            links: [
                { name: "UNHCR", url: "https://donate.unhcr.org/int/en/general?_gl=1*5k4zq*_gcl_au*MjA2MDUzMjc2MC4xNzMzNzMxNDIw*_rup_ga*MTg5MjQ4OTY4Ny4xNzMzNzMxNDIw*_rup_ga_EVDQTJ4LMY*MTczMzczMTQyMC4xLjAuMTczMzczMTQyMC42MC4wLjA.*_ga*MTg5MjQ4OTY4Ny4xNzMzNzMxNDIw*_ga_X2YZPJ1XWR*MTczMzczMTQyMC4xLjAuMTczMzczMTQyMC42MC4wLjA.#_ga=2.117052034.543972218.1665392942-811713487.1644833322" },
                { name: "IRC", url: "https://www.rescue.org" },
                { name: "IOM Migration", url: "https://donate.iom.int" }
            ],
            buttonText: "Donate Now",
            icon: "fa-solid fa-hand-holding-heart"
        },
        {
            title: "Hear Their Voices",
            description: "Discover personal stories that bring the migration experience to life. Understand the resilience and challenges faced by migrants.",
            links: [
                { name: "Reuters: Surging Deaths in European Island", url: "https://www.reuters.com/world/europe/europes-new-migrant-hotspot-races-cope-with-surging-deaths-2024-12-07/" },
                { name: "A Story of Resettlement", url: "https://globalcompactrefugees.org/news-stories/interview-country-has-become-my-home-story-resettlement" },
                { name: "A Dangerous Journey atop Cargo Trains", url: "https://www.doctorswithoutborders.org/latest/dangerous-journey-central-american-migrants-risk-beast-head-north" }
            ],
            buttonText: "Read Stories",
            icon: "fa-solid fa-book-open"
        },
        {
            title: "Be Part of the Change",
            description: "Learn how you can support migrants in your community or advocate for better policies.",
            links: [
                { name: "Amnesty International Volunteer Programs", url: "https://www.amnesty.org" },
                { name: "VolunteerMatch", url: "https://www.volunteermatch.org" },
                { name: "Advocacy Resources", url: "https://www.theadvocatesforhumanrights.org/Impact" }
            ],
            buttonText: "Take Action",
            icon: "fa-solid fa-hands-helping"
        },
    ];

    const section = document.getElementById("resources");

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.justifyContent = "center";
    container.style.gap = "20px";
    container.style.marginTop = "30px";

    resources.forEach(resource => {
        const card = document.createElement("div");
        card.style.backgroundColor = "#34495e";
        card.style.color = "white";
        card.style.border = "1px solid #3498db";
        card.style.borderRadius = "8px";
        card.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.5)";
        card.style.width = "300px";
        card.style.padding = "20px";
        card.style.textAlign = "center";
        card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

        card.addEventListener("mouseover", () => {
            card.style.transform = "translateY(-10px)";
            card.style.boxShadow = "0 8px 12px rgba(0, 0, 0, 0.7)";
        });

        card.addEventListener("mouseout", () => {
            card.style.transform = "translateY(0)";
            card.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.5)";
        });

        const icon = document.createElement("i");
        icon.className = resource.icon;
        icon.style.fontSize = "40px";
        icon.style.color = "#3498db"; // Icon color
        icon.style.marginBottom = "15px";

        const title = document.createElement("h3");
        title.textContent = resource.title;
        title.style.marginBottom = "15px";
        title.style.fontSize = "20px";

        const description = document.createElement("p");
        description.textContent = resource.description;
        description.style.fontSize = "16px";
        description.style.marginBottom = "20px";

        const linkList = document.createElement("ul");
        linkList.style.listStyle = "none";
        linkList.style.padding = "0";

        resource.links.forEach(link => {
            const listItem = document.createElement("li");
            listItem.style.marginBottom = "10px";

            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.textContent = link.name;
            anchor.target = "_blank";
            anchor.style.textDecoration = "none";
            anchor.style.color = "lightblue"; // Link color
            anchor.style.fontSize = "14px";

            anchor.addEventListener("mouseover", () => {
                anchor.style.textDecoration = "underline";
            });

            anchor.addEventListener("mouseout", () => {
                anchor.style.textDecoration = "none";
            });

            listItem.appendChild(anchor);
            linkList.appendChild(listItem);
        });

        const button = document.createElement("a");
        button.href = resource.links[0].url;
        button.textContent = resource.buttonText;
        button.target = "_blank";
        button.style.display = "inline-block";
        button.style.marginTop = "10px";
        button.style.padding = "10px 15px";
        button.style.backgroundColor = "#3498db";
        button.style.color = "white";
        button.style.borderRadius = "5px";
        button.style.textDecoration = "none";

        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#3498db";
        });

        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#3498db";
        });

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(linkList);
        card.appendChild(button);

        container.appendChild(card);
    });

    section.appendChild(container);
});
