/**
 * function qui sauvegarde dans localstorage
 */
function saveProjects() {
	localStorage.setItem("projects", JSON.stringify(projects));
	showToast("votre session a bien etais sauvegardé", "success");
	displayWeeklyStats();
	displayTimeDistributionChart();
	updateTopProjectsThisWeek();
}

/**
 * fonction qui charge depuis le localstorage
 */
function loadProjects() {
	const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
	projects = storedProjects;

	tableProject.innerHTML = "";
	projectSelect.innerHTML = `<option selected disabled>Choisissez un projet</option>`;

	projects.forEach((proj) => {
		const newRow = document.createElement("tr"); //constante qui me crée un nouvelle ligne dans le tableau
		const nameCell = document.createElement("td"); //pareil mais pour une cellule ou il y aura le titre du projet
		nameCell.textContent = proj.name; // la cellul en question
		//ajout badge favoris
		const badgeSessions = document.createElement("span");
		const projectSessions = proj.sessions ? proj.sessions.length : 0;
		if (projectSessions >= 3 && projectSessions <= 5) {
			badgeSessions.classList.add("badge", "bg-info", "ms-2");
			badgeSessions.textContent = `✨ En lancement (${projectSessions})`;
			badgeSessions.setAttribute(
				"title",
				`${projectSessions} sessions - Lancement du projet`
			);
		} else if (projectSessions >= 6 && projectSessions <= 10) {
			badgeSessions.classList.add("badge", "bg-primary", "ms-2");
			badgeSessions.textContent = `📈 En progression (${projectSessions})`;
			badgeSessions.setAttribute(
				"title",
				`${projectSessions} sessions - Projet en progression`
			);
		} else if (projectSessions >= 11 && projectSessions <= 20) {
			badgeSessions.classList.add("badge", "bg-warning", "ms-2");
			badgeSessions.textContent = `💪 Habitude installée (${projectSessions})`;
			badgeSessions.setAttribute(
				"title",
				`${projectSessions} sessions - Habitude installée`
			);
		} else if (projectSessions >= 21) {
			badgeSessions.classList.add("badge", "bg-success", "ms-2");
			badgeSessions.textContent = `🔥 Master projet (${projectSessions})`;
			badgeSessions.setAttribute(
				"title",
				`${projectSessions} sessions - Master du projet`
			);
		}
		nameCell.appendChild(badgeSessions);
		newRow.appendChild(nameCell); //nouvelle ligne qui a le nom de la cellule

		const actionCell = document.createElement("td");
		actionCell.innerHTML = `
		<button class="button btn-warning btn-sm action-btn">Modifier</button>
		<button class="button btn-danger btn-sm action-btn">Supprimer</button>
		`;
		newRow.appendChild(actionCell);
		tableProject.appendChild(newRow); // et création de la ligne dans le tableau

		//ecouteur pou rsupprimer le projet selectionner
		const deleteBtn = actionCell.querySelector(".btn-danger");
		const projectName = nameCell.textContent;
		deleteBtn.addEventListener("click", () => {
			const confirmation = window.confirm(
				"Etes vous sur de vouloir supprimer ce projet ?"
			);
			if (confirmation) {
				deleteProject(projectName);
				showToast("le projet a bien etais supprimer", "warning");
			}
		});

		//ecouteur pour modofier le nom d'un projet
		const modifyBtn = actionCell.querySelector(".btn-warning");
		modifyBtn.addEventListener("click", () => {
			const projectName = nameCell.textContent;
			modifyProject(projectName);
		});

		const option = document.createElement("option");
		option.value = proj.name;
		option.textContent = proj.name;
		projectSelect.appendChild(option);
	});
}
loadProjects();
displayWeeklyStatsByProject();
displayTimeDistributionChart();
updateTopProjectsThisWeek();
