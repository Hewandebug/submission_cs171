function questionaire() {
    // questions, answers, and correct i
    const questions = [
        [1, "How many migrants do you think are missing worldwide?"],
        [2, "Which region has the most missing migrants?"],
        [3, "Which mode of transportation is most commonly used by migrants seeking to cross borders?"],
        [4, "Which of the following is NOT a primary factor for migration?"]
    ];
    const answers = [
        ["Less than 10,000", "Between 10,000 and 30,000", "More than 50,000"],
        ["Africa", "Asia", "Americas"],
        ["Boats", "Vehicles", "Walking"],
        ["Escaping conflict and persecution", "Obtaining a better Passport", "Seeking better employment opportunities."]
    ];
    const correctAnswers = [2, 0, 1, 1];
    let responses = [];
    let score = 0;

    // first question
    function displayQuestion(index) {
        const question = questions[index];
        const answerOptions = answers[index];
        const html = `
            <div class="question-box" data-aos="fade-in">
                <h3 class="question-title">Question ${index + 1} of ${questions.length}</h3>
                <p class="question-text">${question[1]}</p>
                <form id="question-${question[0]}">
                    ${answerOptions.map((ans, idx) => `
                        <label>
                            <input type="radio" name="q${question[0]}" value="${idx}"> ${ans}
                        </label><br>
                    `).join("")}
                </form>
                <button class="next-btn" id="next-${question[0]}">Next</button>
            </div>
        `;
        document.getElementById("questions-container").innerHTML = html;

        // "Next" button click
        document.getElementById(`next-${question[0]}`).addEventListener("click", () => {
            const selected = document.querySelector(`input[name="q${question[0]}"]:checked`);
            if (selected) {
                const selectedValue = +selected.value;
                responses.push(selectedValue);

                // check correctness + update score
                if (selectedValue === correctAnswers[index]) {
                    score++;
                }

                if (index < questions.length - 1) {
                    // next question
                    displayQuestion(index + 1);
                } else {
                    //results
                    showResults();
                }
            } else {
                alert("Please select an answer before proceeding.");
            }
        });
    }

    function showResults() {
        let feedback;

        if (score === 4) {
            feedback = `
            <h5 style="text-align: center; font-size: 1.8rem;">
                <b style="color: #58a4b0;">Excellent Awareness!</b>
            </h5>
            <p style="text-align: center; font-size: 1.2rem; line-height: 1.8;">
                You have a deep understanding of the missing migrants crisis. 
                Build on this knowledge by exploring our project to uncover powerful stories, vital data, and impactful solutions.
            </p>`;
        } else if (score >= 2) {
            feedback = `
            <h5 style="text-align: center; font-size: 1.8rem;">
                <b style="color: #58a4b0;">Good Start!</b>
            </h5>
            <p style="text-align: center; font-size: 1.2rem; line-height: 1.8;">
                You have some awareness of the missing migrants crisis. 
                Dive deeper into our project to learn more about the regions, causes, and untold stories of migration.
            </p>`;
        } else {
            feedback = `
            <h5 style="text-align: center; font-size: 1.8rem;">
                <b style="color: #58a4b0;">Room to Grow!</b>
            </h5>
            <p style="text-align: center; font-size: 1.2rem; line-height: 1.8;">
                Many people are unaware of the true scale and impact of the missing migrants crisis. 
                Start your journey of discovery with our project and see how you can help make a difference.
            </p>`;
        }

        const projectIntro = `
        <div class="results-box" data-aos="fade-in">
            <h2 style="text-align: center; font-size: 2.2rem; margin-bottom: 20px;">
                <b>The Missing Migrants Project</b>
            </h2>
            <p style="text-align: left; font-size: 1.3rem; line-height: 1.8; margin-bottom: 30px;">
                Through our Missing Migrants Project, we uncover the stories, data, and solutions
                behind this global crisis. Explore the next section to begin gaining insights and see how you can contribute to change.
            </p>
            <button class="explore-btn" onclick="location.href='#numbers'">
                Explore More
            </button>
        </div>`;

        document.getElementById("questions-container").innerHTML = feedback + projectIntro;
    }


    displayQuestion(0);
}

document.addEventListener("DOMContentLoaded", () => {
    questionaire();
});

