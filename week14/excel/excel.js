
export { startExcel, refresh, numValue }
import { DataFlowVariable } from "../dataflow/dataflow.js";

const Formulae =  {
    A1: '$(B3) - $(B2)', B1: '1',              C1: '$(A1) + $(B1)',
    A2: '2',             B2: '2',              C2: '$(A2) + $(B2)',
    A3: '$(A1) + $(A2)', B3: '$(B1) + $(B2)',  C3: '$(C1) + $(C2)',
};

const DFVs = {}; // lazy cache for the backing data flow variables

const cols = ["A","B","C"];
const rows = ["1","2","3"];

function startExcel() {
    const dataContainer = document.getElementById('dataContainer');
    fillTable(dataContainer);
}

function fillTable(container) {
    rows.forEach( row => {
        let tr = document.createElement("TR");
        cols.forEach( col => {
            let td     = document.createElement("TD");
            let input  = document.createElement("INPUT");
            let cellid = "" + col + row;
            input.setAttribute("VALUE", Formulae[cellid]);
            input.setAttribute("ID", cellid);
            DFVs[cellid] = df(input);

            input.onchange = evt => {
                Formulae[cellid] = input.value;
                DFVs[cellid] = df(input);
                refresh();
            };
            input.onclick  = evt => input.value = Formulae[cellid] ;

            td.appendChild(input);
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
}

function refresh() {
    cols.forEach( col => {
        rows.forEach( row => {
            let cellid  = "" + col + row;
            let input   = document.getElementById(cellid);
            input.value = numValue(cellid);
        });
    });
}

// get the numerical value of an input element's value attribute
const numValue = cellID => DFVs[cellID]();

function df(input) {
    return DataFlowVariable ( () => {
        const formula = Formulae[input.id];
        const code = formula.replace(/\$\((.*?)\)/g, 'numValue("$1")'); // make '$' in the formula be the numValue function (mini-DSL)
        return Number( eval(code))
    } ) ;
}

// Note: module bundlers do not like the eval() method since they might rename symbols on the fly (e.g. 'n' to 'n$1' ) and
// cannot foresee how dynamically evaluated code might rely on the original name.
// Hence, we introduce a mini-dsl where '$' is a replacement for the 'numValue' function.