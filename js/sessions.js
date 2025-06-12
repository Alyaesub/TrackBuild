/**
 * fonction qui permet de selectionner un projet dans le select et de l'afficher dans historique de session
 */
function displayProjectHistory(projectName) {
	//trouve le bon fichier
	const project = projects.find((p) => p.name === projectName);

	//cible les element html
	const historyList = document.getElementById("historyList");
	const historyTitle = document.getElementById("projectHistoryTitle");

	console.log("Sessions à afficher :", project.sessions);
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

	let totalDuration = 0;

	//sinon on affiche les session du projet
	project.sessions.forEach((session, index) => {
		const ligne = document.createElement("li");
		const hours = Math.floor(session.duration / 3600);
		const minutes = Math.floor((session.duration % 3600) / 60);
		const secondes = session.duration % 60;
		const duree = `${hours}h ${minutes}min ${secondes}sec`;
		const date = new Date(session.date).toLocaleString();
		ligne.textContent = `session de ${duree} le ${date}`;

		let badge = null;
		if (session.duration >= 3600 && session.duration < 7200) {
			badge = document.createElement("span");
			badge.textContent = "+1H";
			badge.classList.add("badge", "bg-success", "ms-2");
			badge.setAttribute("title", "Durée supérieure à 1 heure");
		} else if (session.duration >= 7200 && session.duration < 10800) {
			badge = document.createElement("span");
			badge.textContent = "+2H";
			badge.classList.add("badge", "bg-warning", "ms-2");
			badge.setAttribute("title", "Durée supérieure à 2 heure");
		} else if (session.duration >= 10800 && session.duration < 14400) {
			badge = document.createElement("span");
			badge.textContent = "+3H";
			badge.classList.add("badge", "bg-danger", "ms-2");
			badge.setAttribute("title", "Durée supérieure à 3 heure");
		} else if (session.duration >= 14400) {
			badge = document.createElement("span");
			badge.textContent = "+4H";
			badge.classList.add("badge", "bg-dark", "ms-2");
			badge.setAttribute("title", "Durée supérieure à 4 heure");
		}
		if (badge) {
			ligne.appendChild(badge);
		}

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "🗑️";
		deleteBtn.classList.add("btn", "btn-sm", "btn-danger", "ms-2");
		deleteBtn.setAttribute("title", "Supprimer cette session");
		ligne.appendChild(deleteBtn);
		historyList.appendChild(ligne);

		deleteBtn.addEventListener("click", () => {
			const confirmation = window.confirm(
				"Etes vous sur de vouloir supprimer cette session ?"
			);
			if (confirmation) {
				project.sessions.splice(index, 1);
				saveProjects();
				setTimeout(() => {
					displayProjectHistory(selectedProjectName);
				}, 0);
				showToast("votre session a bien étais supprimé", "info");
			}
			displayWeeklyStatsByProject();
		});

		totalDuration += session.duration;
	});
	const totalLine = document.createElement("li");
	totalLine.classList.add("list-group-item", "fw-bold", "text-end", "mt-2");

	const hours = Math.floor(totalDuration / 3600);
	const minutes = Math.floor((totalDuration % 3600) / 60);
	const seconds = totalDuration % 60;

	totalLine.textContent = `⏱️ Total : ${hours}h ${minutes}min ${seconds}sec`;
	historyList.appendChild(totalLine);
}

projectSelect.addEventListener("change", () => {
	selectedProjectName = projectSelect.value;
	displayProjectHistory(selectedProjectName);

	// Activation du bouton
	startStopBtn.disabled = false;
});

/**
 * function qui gére le reset de toutes les session d'un projet
 */
resetSessionsBtn.addEventListener("click", () => {
	const project = projects.find((p) => p.name === selectedProjectName);
	if (project) {
		const confirmation = window.confirm(
			"Etes vous sur de vouloir supprimer toutes les sessions ?"
		);
		if (confirmation) {
			project.sessions.splice(0);
			saveProjects();
			setTimeout(() => {
				displayProjectHistory(selectedProjectName);
			}, 0);
		}
	}
	showToast("les sessions ont bien etais supprimer", "warning");
	displayWeeklyStats();
});

/**
 * function qui traite le trie des session par projet
 */
sortSelect.addEventListener("change", () => {
	// 1. récupérer le projet sélectionné
	const project = projects.find((p) => p.name === selectedProjectName);
	if (!project) return;
	switch (sortSelect.value) {
		case "recent":
			project.sessions.sort(
				(a, b) => new Date(b.date) - new Date(a.date)
			);
			break;
		case "oldest":
			project.sessions.sort(
				(a, b) => new Date(a.date) - new Date(b.date)
			);
			break;
		case "longest":
			project.sessions.sort((a, b) => b.duration - a.duration);
			break;
		case "shortest":
			project.sessions.sort((a, b) => a.duration - b.duration);
			break;
	}
	// 3. réafficher avec displayProjectHistory()
	displayProjectHistory(selectedProjectName);
});

/**
 * function qui gére les session hebdomadaire
 */
function getSessionsThisWeek() {
	const now = new Date();
	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() - now.getDay() + 1);
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);

	let sessionsThisWeek = [];

	projects.forEach((project) => {
		project.sessions?.forEach((session) => {
			const sessionDate = new Date(session.date);
			if (sessionDate >= startOfWeek && sessionDate <= endOfWeek) {
				sessionsThisWeek.push(session);
			}
		});
	});

	return sessionsThisWeek;
}

function displayWeeklyStats() {
	const sessions = getSessionsThisWeek();
	const sessionCount = sessions.length;

	let totalDuration = 0;
	sessions.forEach((session) => {
		totalDuration += session.duration;
	});

	const hours = Math.floor(totalDuration / 3600);
	const minutes = Math.floor((totalDuration % 3600) / 60);
	const seconds = totalDuration % 60;

	document.getElementById(
		"weekSessionsCount"
	).textContent = `Sessions cette semaine : ${sessionCount}`;
	document.getElementById(
		"weekTotalDuration"
	).textContent = `Temps total : ${hours}h ${minutes}min ${seconds}sec`;
}
displayWeeklyStats();
