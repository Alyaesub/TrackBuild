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
