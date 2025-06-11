/* console.log("hello"); */

//Const générale
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");
const projectSelect = document.getElementById("projectSelect");
const startStopBtn = document.getElementById("startStopBtn");
const resetSessionsBtn = document.getElementById("resetSessionsBtn");
const sortSelect = document.getElementById("sortSessions");

let timerInterval = null;
let startTime = null;
let isRunning = false;
let pieChart = null;

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

let projects = [];
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
displayWeeklyStats();
displayWeeklyStatsByProject();
displayTimeDistributionChart();
updateTopProjectsThisWeek();

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
 * function qui gére le changement d'etat du bouton Start/stop
 */
function toggleTimer() {
	const timerDisplay = document.getElementById("timerDisplay");

	if (!isRunning) {
		isRunning = true;
		startTime = Date.now();

		startStopBtn.textContent = "Arreter";
		startStopBtn.classList.remove("btn-success");
		startStopBtn.classList.add("btn-danger");

		timerInterval = setInterval(() => {
			const elapsed = Math.floor((Date.now() - startTime) / 1000);
			const hours = String(Math.floor(elapsed / 3600));
			const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(
				2,
				"0"
			);
			const secondes = String(elapsed % 60).padStart(2, "0");
			timerDisplay.textContent = `${hours}:${minutes}:${secondes}`;
		}, 1000);
	} else {
		isRunning = false;
		clearInterval(timerInterval);

		const duration = Math.floor((Date.now() - startTime) / 1000);
		const session = {
			duration: duration,
			date: new Date().toISOString(),
		};

		const project = projects.find((p) => p.name === selectedProjectName);
		if (project) {
			project.sessions.push(session);
			saveProjects();
		}
		startStopBtn.textContent = "Démarrer";
		startStopBtn.classList.remove("btn-danger");
		startStopBtn.classList.add("btn-success");
		timerDisplay.textContent = "00:00";
	}
	displayProjectHistory(selectedProjectName);
	displayWeeklyStatsByProject();
}
startStopBtn.addEventListener("click", toggleTimer);

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
	displayWeeklyStatsByProject();
});

/**
 * function qui gére le toastMessage
 */
function showToast(message, type = "info") {
	const toast = document.createElement("div");
	toast.className = `toast toast-${type}`;
	toast.textContent = message;
	document.body.appendChild(toast);

	setTimeout(() => {
		toast.classList.add("show");
	}, 10);

	setTimeout(() => {
		toast.classList.remove("show");
		setTimeout(() => {
			document.body.removeChild(toast);
		}, 300);
	}, 3000);
}

/**
 * function qui traite le trie des session par projet
 */
sortSelect.addEventListener("change", () => {
	// 1. récupérer le projet sélectionné
	const project = projects.find((p) => p.name === selectedProjectName);
	// 2. selon sortSelect.value, trier project.sessions
	if (sortSelect.value === "recent") {
		project.sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
	} else if (sortSelect.value === "oldest") {
		project.sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
	} else if (sortSelect.value === "longest") {
		project.sessions.sort((a, b) => b.duration - a.duration);
	} else if (sortSelect.value === "shortest") {
		project.sessions.sort((a, b) => a.duration - b.duration);
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

/**
 * fonction qui gére les stats hebdo par projets
 */
function getWeeklyStatsByProject() {
	const startOfWeek = new Date();
	startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // dimanche

	const stats = {};

	projects.forEach((project) => {
		let duration = 0;
		project.sessions.forEach((session) => {
			const sessionDate = new Date(session.date);
			if (sessionDate >= startOfWeek) {
				duration += session.duration;
			}
		});
		stats[project.name] = duration;
	});

	return stats;
}

function displayWeeklyStatsByProject() {
	const statsContainer = document.getElementById("projectWeeklyStats");
	statsContainer.innerHTML =
		"<h4>📊 Temps passé cette semaine par projet :</h4>";

	const startOfWeek = new Date();
	startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // dimanche

	projects.forEach((project) => {
		let totalDuration = 0;

		project.sessions.forEach((session) => {
			const sessionDate = new Date(session.date);
			if (sessionDate >= startOfWeek) {
				totalDuration += session.duration;
			}
		});

		if (totalDuration > 0) {
			const hours = Math.floor(totalDuration / 3600);
			const minutes = Math.floor((totalDuration % 3600) / 60);
			const seconds = totalDuration % 60;

			const statLine = document.createElement("p");
			statLine.textContent = `🛠️ ${project.name} : ${hours}h ${minutes}min ${seconds}sec`;
			statsContainer.appendChild(statLine);
		}
	});
}

/**
 * function qui gére le camenbere
 */
function displayTimeDistributionChart() {
	const ctx = document
		.getElementById("timeDistributionChart")
		.getContext("2d");

	const projectDurations = projects
		.map((project) => {
			const total = project.sessions.reduce(
				(acc, s) => acc + s.duration,
				0
			);
			return { name: project.name, duration: total };
		})
		.filter((p) => p.duration > 0); // Ne garde que ceux avec du temps

	const labels = projectDurations.map((p) => p.name);
	const durations = projectDurations.map((p) => p.duration);

	// Conversion secondes en heures pour affichage + lisibilité
	const durationInHours = durations.map((d) => (d / 3600).toFixed(1));

	// Détruire l’ancien graphique s’il existe
	if (pieChart) {
		pieChart.destroy();
	}

	pieChart = new Chart(ctx, {
		type: "pie",
		data: {
			labels: labels,
			datasets: [
				{
					label: "Temps total par projet (en heures)",
					data: durationInHours,
					backgroundColor: [
						"#4e73df",
						"#1cc88a",
						"#36b9cc",
						"#f6c23e",
						"#e74a3b",
						"#858796",
						"#5a5c69",
					],
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: "bottom",
				},
				tooltip: {
					callbacks: {
						label: function (context) {
							return `${context.label} : ${context.parsed} h`;
						},
					},
				},
			},
		},
	});
}

/**
 * fonction qui gére la liste des favories dans weeklyStat
 */
function updateTopProjectsThisWeek() {
	const list = document.getElementById("weekFavoriteProject");
	list.innerHTML = "";

	const projectStats = [];

	projects.forEach((project) => {
		const sessionsThisWeek = project.sessions.filter((session) => {
			const sessionDate = new Date(session.date);
			const now = new Date();
			const firstDayOfWeek = new Date(
				now.setDate(now.getDate() - now.getDay())
			);
			return sessionDate >= firstDayOfWeek;
		});
		if (sessionsThisWeek.length > 0) {
			projectStats.push({
				name: project.name,
				count: sessionsThisWeek.length,
			});
		}
	});

	projectStats
		.sort((a, b) => b.count - a.count)
		.slice(0, 3)
		.forEach((p) => {
			const li = document.createElement("li");
			li.textContent = `🔥 ${p.name} (${p.count} sessions)`;
			list.appendChild(li);
		});
}
