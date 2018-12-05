const fs = require("fs");
const input = fs.readFileSync("day-5.txt").toString();

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function findPair(polymer) {
    let removed = false;
    for (let i = 0; i < polymer.length - 1; i++) {
        if (polymer[i] !== polymer[i + 1] && polymer[i].toUpperCase() === polymer[i + 1].toUpperCase()) {
            polymer = polymer.slice(0, i) + polymer.slice(i + 2);
            i -= 1;
            removed = true;
        }
    }
    return {removed, input: polymer};
}

function react(polymer) {
    let done = false;
    while (!done) {
        const res = findPair(polymer);
        done = !res.removed;
        polymer = res.input;
    }
    return polymer;
}

const result1 = react(input).length;

const characters = input.toLowerCase().split("").filter(onlyUnique);
const reducedPolymers = characters.map(character => {
    let reducedPolymer = input.split("").filter(c => c.toLowerCase() !== character).join("");
    const reacted = react(reducedPolymer);
    return {reacted, length: reacted.length};
});
const result2 = reducedPolymers.sort((a, b) => a.length - b.length)[0].length;


console.log(result1, result2);