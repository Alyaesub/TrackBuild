/* console.log("hello"); */

//Const générale
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");
const projectSelect = document.getElementById("projectSelect");

//fonction qui ajoute un nouveau projet dans le tableau en dessous le l'input
buttonAddProject.addEventListener("click", () => {
	const projectName = inputNewProject.value.trim();
	if (projectName === "") {
		alert("rentrez un nom de projet");
		return;
	}
	projects.push({ name: projectName, sessions: [] });
	saveProjects();

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

		//metttre les ecouteur ici pour chopper les boutton créé avec innerHtml
		//ecouteur pou rsupprimer le projet selectionner
		const deleteBtn = actionCell.querySelector(".btn-danger");
		const projectName = nameCell.textContent;
		deleteBtn.addEventListener("click", () => {
			deleteProject(projectName);
		});

		//ecouteur pour modofier le nom d'un projet
		const modifyBtn = actionCell.querySelector(".btn-warning");
		modifyBtn.addEventListener("click", () => {
			const projectName = nameCell.textContent;
			modifyProject(projectName);
		});
	});
}
loadProjects();
choiceProjectSelect();

//fonction pour supprimer un projet du localstorage
function deleteProject(projectName) {
	// Supprimer le projet du tableau
	projects = projects.filter((p) => p.name !== projectName);
	// utilise saveProject pour sauvegarder la nouvelle liste
	saveProjects();
	// Vider le tableau HTML
	tableProject.innerHTML = "";
	// j'utilise loadProject pour recharger depuis LocalStorage
	loadProjects();
}

//function qui permet de modifier le nom d'un projet
function modifyProject(projectName) {
	const newName = prompt("Nouveau nom du projet :", projectName);
	if (!newName || newName.trim() === "") return; // si annule ou vide

	const project = projects.find((p) => p.name === projectName);
	if (project) {
		project.name = newName.trim();
		saveProjects();
		tableProject.innerHTML = "";
		loadProjects();
	}
}

//fonction qui permet d'afficher et de choisr un projet dans le selecte "project-select"
function choiceProjectSelect() {
	projects = JSON.parse(localStorage.getItem("projects")) || [];
	(projectSelect.innerHTML =
		"<option selected disabled>Choisis un projet</option>"),
		projects.forEach((project) => {
			const option = document.createElement("option");
			option.value = project.name;
			option.textContent = project.name;
			projectSelect.appendChild(option);
		});
}

//fonction qui permet de selectionner un projet dans le select et de l'afficher dans historique de session
function displayProjectHistory(projectName) {
	//trouve le bon fichier
	const project = projects.find((p) => p.name === projectName);

	//cible les element html
	const historyList = document.getElementById("historyList");
	const historyTitle = document.getElementById("projectHistoryTitle");

	//reinitialise l'affichage
	historyList.innerHTML = "";
	historyTitle.textContent = `Historique du projet : ${projectName}`;

	//verifie la sessions du prijet selectionné
	if (!project.sessions || project.sessions.length === 0) {
		const message = document.createElement("li");
		message.textContent = "Pas encore de session pour ce projet";
		historyList.appendChild(message);
		return;
	}

	//sinon on affiche les session du projet
	project.sessions.forEach((session) => {
		const ligne = document.createElement("li");
		const hours = Math.floor(session.duration / 3600);
		const minutes = Math.floor((session.duration % 3600) / 60);
		const duree = `${hours}h ${minutes}min`;
		const date = new Date(session.date).toLocaleString();
		ligne.textContent = `session de ${duree} le ${date}`;
		historyList.appendChild(ligne);
	});
}

//l'EventListener de la fonction displayProjectHostory
projectSelect.addEventListener("change", () => {
	selectedProjectName = projectSelect.value;
	displayProjectHistory(selectedProjectName);
});
