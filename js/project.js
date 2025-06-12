/**
 * fonction qui ajoute un nouveau projet dans le tableau en dessous le l'input
 */
buttonAddProject.addEventListener("click", () => {
	const projectName = inputNewProject.value.trim();
	if (projectName === "") {
		alert("rentrez un nom de projet");
		return;
	}
	if (projects.some((p) => p.name === projectName)) {
		alert("Ce projet existe déjà !");
		return;
	}
	projects.push({ name: projectName, sessions: [] });
	saveProjects();
	loadProjects();
	inputNewProject.value = "";
	showToast("🚀 Projet créé avec succès", "success");
});

/**
 * fonction pour supprimer un projet du localstorage
 */
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

/**
 * function qui permet de modifier le nom d'un projet
 */
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
	showToast("le projet a bien etait modifier", "success");
}
