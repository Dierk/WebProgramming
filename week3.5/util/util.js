
// report :: [Bool] -> ()

function report(origin, ok) {
// test result report
    document.write(origin + ": ")
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