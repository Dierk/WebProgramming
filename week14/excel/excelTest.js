
import { startExcel, refresh, numValue } from './excel.js'
import { Suite } from "../test/test.js"

const excelSuite = Suite("excel");

excelSuite.add("normalize", assert => {

    let tbody = document.createElement("TBODY");
    tbody.setAttribute("ID","dataContainer");
    let body = document.getElementsByTagName("BODY")[0];
    body.appendChild(tbody);

    startExcel();
    refresh();
    assert.is(numValue('C3'), 6);

    body.removeChild(tbody);

});

excelSuite.run();