document.addEventListener("DOMContentLoaded", () => {
    const authors = [
        {
            name: "Hewan Kidanemariam",
            bio: "Hewan, a senior at Harvard, moved to the U.S. from Ethiopia at the age of 5. ",
            class: "hewan-icon",
        },
        {
            name: "Hayat Hassan",
            bio: "Hayat, a senior at Harvard, moved to the U.S. from Kenya at the age of 4.",
            class: "hayat-icon",
        },
        {
            name: "Eden Seyoum",
            bio: "Eden, a senior at Harvard, moved to the U.S. from Ethiopia to pursue her college education. ",
            class: "eden-icon",
        },
    ];

    const authorsContainer = document.querySelector(".authors-container");
    authorsContainer.innerHTML = ""; // Clear content

    authors.forEach(author => {
        const card = document.createElement("div");
        card.classList.add("author-card");

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("author-img", author.class);

        const name = document.createElement("h2");
        name.textContent = author.name;

        const bio = document.createElement("p");
        bio.textContent = author.bio;

        card.appendChild(imgDiv);
        card.appendChild(name);
        card.appendChild(bio);

        authorsContainer.appendChild(card);
    });
});
