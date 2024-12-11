document.addEventListener("DOMContentLoaded", () => {
    // styling
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = `
    /* Specific styles for Missing Migrants Section */
    .missing-migrants-section {
        background-color: black;
        color: #ffffff;
        padding: 60px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
    }

    .missing-migrants-container {
        text-align: center;
        max-width: 700px;
        margin: 0 auto;
    }

    /* Counter Styling */
    .missing-migrants-counter {
        font-size: 6rem;
        font-weight: bold;
        color: #00aaff;
        margin-bottom: 0px;
    }

    /* Description Styling */
    .missing-migrants-description {
        margin-top: 20px;
        font-size: 1.5rem;
        line-height: 1.6;
    }

    /* Fading Text Styling */
    .missing-migrants-fading-text {
        font-size: 1.2rem;
        color: #ffcc00;
        margin-top: 30px;
        opacity: 0;
        transition: opacity 2s ease-in;
    }

    /* Emotive Questions Styling */
    .emotive-questions p {
        font-size: 1.3rem;
        color: #ffffff;
        line-height: 1.8;
        margin-top: 20px;
        opacity: 0;
        transition: opacity 2s ease-in, visibility 2s ease-in;
    }

    /* Asterisk Styling */
    .missing-migrants-asterisk {
        margin-top: 40px;
        font-size: 0.9rem;
        color: #888888;
        line-height: 1.4;
    }

    /* Visibility Control */
    .hidden {
        visibility: hidden;
    }

    .visible {
        visibility: visible;
        opacity: 1;
    }
    `;
    document.head.appendChild(style);

    const section = document.querySelector('.missing-migrants-section');
    const counterElement = document.getElementById("missingMigrantsCounter");
    const fadingText = document.getElementById("fadingText");
    const question1 = document.getElementById("question1");
    const question2 = document.getElementById("question2");

    const targetCount = 70591;
    const increment = Math.ceil(targetCount / 200); // Adjust speed by changing divisor
    let currentCount = 0;
    let hasStartedCounting = false; // To ensure we don't trigger the animation multiple times

    // Counter
    const updateCounter = () => {
        if (currentCount < targetCount) {
            currentCount += increment;
            if (currentCount > targetCount) currentCount = targetCount;
            counterElement.textContent = currentCount.toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            // Fade in the secondary text once counter is complete
            fadingText.style.opacity = 1;
            setTimeout(() => showQuestion(question1), 2000); // Delay for question 1
            setTimeout(() => showQuestion(question2), 4000); // Delay for question 2
        }
    };

    // function to show questions
    const showQuestion = (question) => {
        question.style.visibility = "visible"; // Ensures the element is visible
        question.style.opacity = 1; // Fades the element in
    };

    // Intersection Observer to start counting when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStartedCounting) {
                hasStartedCounting = true;
                updateCounter();
                observer.unobserve(section); // Stop observing once started
            }
        });
    }, { threshold: 0.3 }); // Adjust threshold as needed

    observer.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section:not(:first-of-type)');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
});