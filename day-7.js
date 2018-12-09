const fs = require("fs");
const contains = require("./helper").contains;
const input = fs.readFileSync("day-7.txt").toString();

const steps = {};

input
    .split("\n")
    .map(line => {
        const match = /Step (.) must be finished before step (.) can begin\./.exec(line);
        const [, from, to] = match;
        if (!steps[from])
            steps[from] = {goesTo: [], needs: [], id: from};
        if (!steps[to])
            steps[to] = {goesTo: [], needs: [], id: to};
        steps[from].goesTo.push(to);
        steps[to].needs.push(from);
    });

let canExecute = [];
let done = [];

function findAvailable() {
    return Object
        .keys(steps)
        .filter(key => !contains(done, key))
        .filter(key => steps[key].needs.filter(need => !contains(done, need)).length === 0)
        .filter(key => !contains(canExecute, key));
}

function step() {
    canExecute.push(...findAvailable());
    canExecute.sort();
    if (canExecute.length === 0)
        return;
    done.push(canExecute.shift());
    canExecute.push(...findAvailable());
    canExecute.sort();
}

do {
    step();
} while (canExecute.length > 0);

const result1 = done.join("");

// **********************************************************************************************

const workers = new Array(5).fill(0).map(_ => ({working: 0}));

canExecute = [];
done = [];
let seconds = -1;

function findAvailableParallel() {
    return Object
        .keys(steps)
        .filter(key => !contains(done, key) && !contains(canExecute, key))
        .filter(key => !contains(workers.map(w => w.step), key))
        .filter(key => steps[key].needs.filter(need => !contains(done, need)).length === 0)
}

function stepToSecond(step) {
    return 60 + step.charCodeAt(0) - 64;
}

function second() {
    seconds++;
    canExecute.push(...findAvailableParallel());
    canExecute.sort();
    for (const w of workers) {
        if (w.duration > 0)
            w.working++;
        if (w.working > 0 && w.working === w.duration) {
            done.push(w.step);
            w.working = 0;
            delete w.step;
            delete w.duration;
        }
    }

    canExecute.push(...findAvailableParallel());
    canExecute.sort();
    for (const w of workers) {
        if (w.working === 0 && canExecute.length > 0) {
            w.step = canExecute.shift();
            w.duration = stepToSecond(w.step);
            w.working = 0;
        }

    }
    console.log(`${seconds}\t${workers.map(w => w.step || '.').join("\t")}\t${done.join("")}`);
}

do {
    second();
} while (Object.keys(steps).length !== done.length);

const result2 = seconds;

console.log(result1, result2);

// 79 minutes