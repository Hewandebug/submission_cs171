document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll("#side-nav li");

    // Scroll to target section on click
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const targetId = item.dataset.target;
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to the section
                targetSection.scrollIntoView({ behavior: "smooth" });

                // Update active state
                navItems.forEach((nav) => nav.classList.remove("active"));
                item.classList.add("active");
            }
        });
    });

    // Highlight the active nav item on scroll
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const targetId = entry.target.id;

                if (entry.isIntersecting) {
                    navItems.forEach((item) => {
                        if (item.dataset.target === targetId) {
                            item.classList.add("active");
                        } else {
                            item.classList.remove("active");
                        }
                    });
                }
            });
        },
        { threshold: 0.7 } // Adjust threshold for when sections become active
    );

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));
});


