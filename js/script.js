/* console.log("hello"); */

//Const générale
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");

//fonction qui ajoute un nouveau projet dans le tableau en dessous le l'input
buttonAddProject.addEventListener("click", () => {
	const projectName = inputNewProject.value.trim();
	if (projectName === "") {
		return;
	}
	const newRow = document.createElement("tr"); //constante qui me crée un nouvelle ligne dans le tableau
	const nameCell = document.createElement("td"); //pareil mais pour une cellule ou il y aura le titre du projet
	nameCell.textContent = projectName; // la cellul en question
	newRow.appendChild(nameCell); //nouvelle ligne qui a le nom de la cellule
	tableProject.appendChild(newRow); // et création de la ligne dans le tableau
	inputNewProject.value = ""; //rest de l'input
});
