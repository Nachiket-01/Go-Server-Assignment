async function processSingle() {
    const userInput = document.getElementById('arrayInput').value;
    const arrays = parseInput(userInput);

    const data = { "to_sort": arrays };
    const result = await sendRequest('http://:65.0.181.169:8000/process-single', data);
    displayResult(result);
}

async function processConcurrent() {
    const userInput = document.getElementById('arrayInput').value;
    const arrays = parseInput(userInput);

    const data = { "to_sort": arrays };
    const result = await sendRequest('http://65.0.181.169:8000/process-concurrent', data);
    displayResult(result);
}

function parseInput(input) {
    const arrayStrings = input.split(';').map(str => str.trim());
    const arrays = arrayStrings.map(str => str.split(',').map(numStr => parseInt(numStr.trim())));
    return arrays;
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p><strong>Sorted Arrays:</strong></p>`;
    result.sorted_arrays.forEach(sortedArray => {
        resultDiv.innerHTML += `<p>${JSON.stringify(sortedArray)}</p>`;
    });
    resultDiv.innerHTML += `<p><strong>Time Taken (ns):</strong> ${result.time_ns}</p>`;
}

async function sendRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

