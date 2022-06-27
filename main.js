
function detailForVersion(version) {
	var x = document.getElementById(version);
	if (x.style.display === "none") {
	x.style.display = "block";
	} else {
	x.style.display = "none";
	}
	console.log(version);
}