let currentQuestion = 0;
const questions = document.querySelectorAll('.question-container');

function showQuestion(index) {
    questions.forEach((question, i) => {
        question.classList.remove('active-question');
        if (i === index) {
            question.classList.add('active-question');
        }
    });

    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === questions.length - 1;
    
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'inline' : 'none';
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

function submitTest() {
    const answers = [];
    questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index + 1}"]:checked`);
        if (selected) {
            answers.push(`Q${index + 1}: ${selected.value}`);
        } else {
            answers.push(`Q${index + 1}: No answer selected`);
        }
    });
    alert('Your answers have been submitted!\n' + answers.join('\n'));

    questions.forEach(question => {
        const options = question.querySelectorAll('input[type="radio"]');
        options.forEach(option => option.checked = false);
    });
    currentQuestion = 0;
    showQuestion(currentQuestion);
}

showQuestion(currentQuestion);
