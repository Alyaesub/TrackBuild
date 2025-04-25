/* console.log("hello"); */

//Const générale
const inputNewProject = document.getElementById("newProjectInput");
const buttonAddProject = document.getElementById("addProjectBtn");
const tableProject = document.getElementById("projectTableBody");

//fonction qui ajoute un nouveau projet dans le tableau en dessous le l'input
buttonAddProject.addEventListener("click", () => {
	const projectName = inputNewProject.ariaValueMax.trim();
	if (projectName === "") {
		return;
	}
});
