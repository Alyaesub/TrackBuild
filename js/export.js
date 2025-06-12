/**
 * function qui gére l'export en csv
 */
btnExport.addEventListener("click", () => {
	let csv = "Projet,Durée (sec),Durée (hh:mm:ss),Date\n";

	projects.forEach((project) => {
		project.sessions.forEach((session) => {
			const seconds = session.duration;
			const hours = Math.floor(seconds / 3600);
			const minutes = Math.floor((seconds % 3600) / 60);
			const secs = seconds % 60;
			const readableDuration = `${hours}h ${minutes}min ${secs}sec`;

			const date = new Date(session.date)
				.toLocaleString()
				.replace(",", "")
				.replace(/\u202F/g, " "); // supprime les espaces insécables s’il y en a

			csv += `${project.name},${seconds},${readableDuration},${date}\n`;
		});
	});

	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", "trackbuild-sessions.csv");
	link.click();
});
