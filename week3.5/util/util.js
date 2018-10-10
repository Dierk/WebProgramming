
// report :: [Bool] -> ()

function report(ok) {
// test result report
    if (ok.every(elem => elem)) {
        document.writeln("All " + ok.length + " tests ok.");
    } else {
        document.writeln("Not all tests ok! Details:");
        for (let i = 0; i < ok.length; i++) {
            if (ok[i]) {
                document.writeln("Test " + i + " ok");
            } else {
                document.writeln("Test " + i + " failed");
            }
        }
    }
}