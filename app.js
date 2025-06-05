const buttons = document.querySelector('.buttons');
const displayQuestion = document.querySelector('.display-question');
const displayOperation = document.querySelector('.display-operation');

const keys = [
    '7', '8', '9', '/',
    '4', '5', '6', 'x',
    '1', '2', '3', '-',
    '0', '.', '+', '='
]

const reset = () => {
    displayOperation.textContent = '';
    displayQuestion.textContent = '';
}

const calculate = () => {
    const prompt = `Act like a stupid calculator for an joke app. If I ask you a easy question like 10 + 10 say something like "you're dumb asf"
      if I ask you a hard one like 2 * 13 say something like "15, maybe 37 idk". Talk in a way instagram commenters talk and keep your answers short.
      Respond to this question: "${displayOperation.textContent}"`;

    displayQuestion.textContent = displayOperation.textContent
    displayOperation.textContent = "thinking...";

    // fetch('http://localhost:3000/gemini', {
    fetch('https://succulent-celestial-wallet.glitch.me/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt })
    })
    .then(response => response.json())
    .then(data => {
        displayOperation.innerHTML = data.response.replace(/\*(.*?)\*/g, '<span class="italic">$1</span>');
    })
    .catch(error => {
        displayOperation.textContent = 'Error';
        console.error(error);
    });

}

keys.forEach(key => {
    let color = isNaN(key) ? 'pink' : 'yellow';
    if (key === '=') color = 'blue';

    const button = document.createElement('button');
    button.className = `button ${color}`;
    button.setAttribute('data-key', key);
    button.textContent = key;

    button.addEventListener('click', () => {
        const event = new KeyboardEvent('keydown', { key: key });
        document.dispatchEvent(event);
    });

    document.addEventListener('keydown', (event) => {

        let keyPressed = event.key.toLowerCase();
        if (event.key === "=") return
        if (event.key === '*') keyPressed = 'x'

        if (keyPressed === key ) {
            button.classList.add('active');
            setTimeout(() => {
                button.classList.remove('active');
            }, 100);

            if (displayQuestion.textContent !== "") reset();

            displayOperation.textContent += keyPressed;
        }
    });

    buttons.appendChild(button);
});


document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === "=") {
            console.log(event.key);
            event.preventDefault();
            displayOperation.textContent += "=";
            calculate();
            return;
    }

    if (key === 'Enter') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        if (displayQuestion.textContent !== "") reset();
        displayOperation.textContent = displayOperation.textContent.slice(0, -1);
    }
});
