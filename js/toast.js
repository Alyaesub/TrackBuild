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
