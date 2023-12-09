// sorting-assignment/frontend/script.js
async function processSingle() {
    const userInput = document.getElementById('arrayInput').value;
    const arrays = parseInput(userInput);

    const data = { "to_sort": arrays };
    const response = await fetch('http://172.31.9.51:8000/process-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
	const result = await response.json();
    console.log(result);
}

async function processConcurrent() {
    const userInput = document.getElementById('arrayInput').value;
    const arrays = parseInput(userInput);

    const data = { "to_sort": arrays };
    const response = await fetch('http://172.31.9.51:8000/process-concurrent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log(result);
}

function parseInput(input) {
    const arrayStrings = input.split(';').map(str => str.trim());
    const arrays = arrayStrings.map(str => str.split(',').map(numStr => parseInt(numStr.trim())));
    return arrays;
}

