const API_KEY = "_QTX1lbo-s34PQOJF4pRR8vZApQ";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
	document.getElementById("resultsModal")
);

document
	.getElementById("status")
	.addEventListener("click", (e) => getStatus(e));

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

//console.log(new FormData(document.getElementById("checksform")).entries());

function processOptions(form) {
	let optArray = [];

	for (let entry of form.entries()) {
		if (entry[0] === "options") {
			optArray.push(entry[1]);
		}
	}
	form.delete("options");
	form.append("options", optArray.join());

	return form;
}

function displayException(exep) {
	let resultsModalTitle = document.getElementById("resultsModalTitle");
	let resultsModalContent = document.getElementById("results-content");

	let heading = `An Exception Occured`;
	let contentStatus = `<div class="status-code">The API returned status code ${exep.status_code}</div>`;
	let contentErrNum = `<div class="error-num">Error number: ${exep.error_no}</div>`;
	let contentErrText = `<div class="error-text">Error text: <strong>${exep.error}</strong>`;

	resultsModalTitle.innerText = heading;
	resultsModalContent.innerHTML = contentStatus;
	resultsModalContent.innerHTML += contentErrNum;
	resultsModalContent.innerHTML += contentErrText;
	resultsModal.show();
}

async function postForm(e) {
	const form = processOptions(
		new FormData(document.getElementById("checksform"))
	);

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			Authorization: API_KEY,
		},
		body: form,
	});

	const data = await response.json();

	if (response.ok) {
		displayErrors(data);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

function displayErrors(data) {
	let resultsModalTitle = document.getElementById("resultsModalTitle");
	let resultsModalContent = document.getElementById("results-content");
	let heading = `JSHint results for ${data.file}`;

	if (data.total_errors === 0) {
		results = `<div class="no-errors">No errors reported!</div>`;
	} else {
		results = `<div>Total Errors: <span class="error-count">${data.total_errors}</span></div>`;
		for (let error of data.error_list) {
			results += `<div>At line <span class="line">${error.line}</span>, `;
			results += `colum <span class="line">${error.col}</span></div>`;
			results += `<div class="error">${error.error}</div>`;
		}
	}

	resultsModalTitle.innerText = heading;
	resultsModalContent.innerHTML = results;
	resultsModal.show();
}

async function getStatus(e) {
	const queryString = `${API_URL}?api_key=${API_KEY}`;

	const response = await fetch(queryString);

	const data = await response.json();

	if (response.ok) {
		displayStatus(data);
	} else {
		displayException(data);
		throw new Error(data.error);
	}
}

function displayStatus(data) {
	let resultsModalTitle = document.getElementById("resultsModalTitle");
	let resultsModalContent = document.getElementById("results-content");

	resultsModalTitle.innerText = "API Key Status";
	resultsModalContent.innerText = `Your key is valid until \n${data.expiry}`;

	resultsModal.show();
}
