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
			li.textContent = ` ${p.name} ➡️ (${p.count} sessions)`;
			list.appendChild(li);
		});
}
