// requires excel.js


let tbody = document.createElement("TBODY");
tbody.setAttribute("ID","dataContainer");
let body = document.getElementsByTagName("BODY")[0];
body.appendChild(tbody);

startExcel();
refresh();
document.writeln(n(C3) === 6);

body.removeChild(tbody);
