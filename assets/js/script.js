const API_KEY = "_QTX1lbo-s34PQOJF4pRR8vZApQ";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
	document.getElementById("resultsModal")
);

document
	.getElementById("status")
	.addEventListener("click", (e) => getStatus(e));

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

async function postForm(e) {
	const form = new FormData(document.getElementById("checksform"));

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			Authorization: API_KEY,
		},
		body: form,
	});

	const data = await response.json();

	if (response.ok) {
		console.log(data);
	} else {
		throw new Error(data.error);
	}
}

async function getStatus(e) {
	const queryString = `${API_URL}?api_key=${API_KEY}`;

	const response = await fetch(queryString);

	const data = await response.json();

	if (response.ok) {
		displayStatus(data);
	} else {
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
