/* console.log("hello"); */

//Const générale
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");

//fonction qui ajoute un nouveau projet dans le tableau en dessous le l'input
buttonAddProject.addEventListener("click", () => {
	const projectName = inputNewProject.value.trim();
	projects.push({ name: projectName, sessions: [] });
	saveProjects(projectName);
	if (projectName === "") {
		return;
	}
	const newRow = document.createElement("tr"); //constante qui me crée un nouvelle ligne dans le tableau
	const nameCell = document.createElement("td"); //pareil mais pour une cellule ou il y aura le titre du projet
	nameCell.textContent = projectName; // la cellul en question
	newRow.appendChild(nameCell); //nouvelle ligne qui a le nom de la cellule
	tableProject.appendChild(newRow); // et création de la ligne dans le tableau
	const actionCell = document.createElement("td");
	actionCell.innerHTML = `
	<button class="button btn-warning btn-sm">Modifier</button>
	<button class="button btn-danger btn-sm">Supprimer</button>
	`;
	newRow.appendChild(actionCell);
	inputNewProject.value = ""; //rest de l'input
});

let projects = [];

//function qui sauvegarde dans localstorage
function saveProjects() {
	localStorage.setItem("projects", JSON.stringify(projects));
}

//fonction qui charge depuis le localstorage
function loadProjects() {
	const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
	projects = storedProjects;
	projects.forEach((proj) => {
		const newRow = document.createElement("tr"); //constante qui me crée un nouvelle ligne dans le tableau
		const nameCell = document.createElement("td"); //pareil mais pour une cellule ou il y aura le titre du projet
		nameCell.textContent = proj.name; // la cellul en question
		newRow.appendChild(nameCell); //nouvelle ligne qui a le nom de la cellule
		tableProject.appendChild(newRow); // et création de la ligne dans le tableau
		const actionCell = document.createElement("td");
		actionCell.innerHTML = `
		<button class="button btn-warning btn-sm">Modifier</button>
		<button class="button btn-danger btn-sm">Supprimer</button>
		`;
		newRow.appendChild(actionCell);
	});
}
loadProjects();

//fonction pour supprimer un projet du localstorage
