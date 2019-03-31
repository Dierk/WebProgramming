// requires inheritance.js
// requires /util/test.js

( () => {
    let ok = [];

    class Person {
        constructor(name) {
            this.name = name;
            this.worklog = [];
        }
        mustDo() {
            return ""
        }
        work() {
            this.worklog.push(this.mustDo())
        }
    }

    const p = new Person("unknown");
    ok.push(p.worklog.length === 0);  // initially empty
    p.work();
    ok.push(p.worklog[0] === "");     // superclass impl

    class Student extends Person {
        mustDo() {
            return "fill quiz"
        }
    }

    const s = new Student();
    ok.push(s.worklog.length === 0);        // initially empty
    s.work();
    ok.push(s.worklog[0] === "fill quiz");  // subclass impl
    ok.push(s.name === undefined);          // super ctor not enforced

    ok.push(s instanceof Student);
    ok.push(s.__proto__ === Student.prototype);
    ok.push(Object.getPrototypeOf(s) === Student.prototype);
    ok.push(s instanceof Person);
    ok.push(s instanceof Object);
    ok.push(Student instanceof Function);

    report("inheritance-ES6", ok);
})();


( () => {
    let ok = [];

    function Person(worker) {
        const worklog  = [];
        return {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        }
    }

    const wl = Person( {work: () => ""} );
    ok.push(wl.worklog.length ===  0);  // initially empty
    wl.work();
    ok.push(wl.worklog[0] ===  "");     // superclass impl

    function Student(name) {
        return {
            name:  name,
            work:  () => name + " filled quiz"
        }
    }

    const p = Person(Student("top"));
    ok.push(p.worklog.length ===  0);  // initially empty
    p.work();
    ok.push(p.worklog[0] ===  "top filled quiz");  // subclass impl

    report("inheritance-delegate", ok);
})();

// todo: can you make the dk object an instanceof Person?
( () => {
    let ok = [];

    function Person(worker) {
        const worklog  = [];
        const result = {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        };

        // todo: here?

        return result
    }

    const dk = Person( {work: () => ""} );

    ok.push(dk instanceof Person);

    report("inheritance-setProto", ok);
})();

