function initializeCitationPage() {
    const container = document.querySelector("#citation-acknowledgements");
    container.innerHTML = "";

    // Heading
    const heading = document.createElement("h2");
    heading.textContent = "Citation and Acknowledgements";
    heading.className = "section-title";
    container.appendChild(heading);

    // Detailed Citation Information
    const citationDetails = document.createElement("p");
    citationDetails.innerHTML = `
        <strong>Dataset Citation:</strong><br>
        The data used in this project is sourced from the Missing Migrants Project, managed and maintained by the International Organization for Migration (IOM). The dataset comprehensively tracks incidents involving migrants, including fatalities and disappearances during migration journeys worldwide. For more details, visit the official site:
        <a href="https://missingmigrants.iom.int" target="_blank">Missing Migrants Project</a>. Accessed on October 28.2024.
    `;
    citationDetails.className = "citation-text";
    container.appendChild(citationDetails);

    // Acknowledgement to the IOM
    const acknowledgment = document.createElement("p");
    acknowledgment.innerHTML = `
        <strong>Special Thanks:</strong><br>
        We extend our deepest gratitude to the International Organization for Migration (IOM) for their unwavering commitment to providing crucial data on migration and for their ongoing efforts in advocating for the rights and safety of migrants worldwide. Their work has been indispensable to the success of this project.
    `;
    acknowledgment.className = "acknowledgment-text"; // Ensure this class is styled appropriately
    container.appendChild(acknowledgment);

}

document.addEventListener("DOMContentLoaded", initializeCitationPage);
