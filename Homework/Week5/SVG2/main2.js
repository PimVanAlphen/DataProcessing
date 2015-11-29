/* use this to test out your function */
window.onload = function() {
 	changeColor("gb", "#ff00ff");
  changeColor("es", "#ffff00");
  changeColor("cy", "#00ffff");
  changeColor("se", "#aaaaaa");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    document.getElementById(id).style.fill = color
}
