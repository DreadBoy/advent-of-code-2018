const input = 9;

let scores = [3, 7];
let indices = [0, 1];

function createNewScores() {
    const newScores = (scores[indices[0]] + scores[indices[1]])
        .toString()
        .split("")
        .map(c => parseInt(c));
    scores.push(...newScores);
}

function updateElves() {
    indices = indices.map((_, i) => (_ + 1 + scores[indices[i]]) % scores.length)
}

function print() {
    const brackets = (character, index) =>
        index === indices[0] ? `(${character})` :
            index === indices[1] ? `[${character}]` :
                ` ${character} `;

    if (scores.length % 1000 === 0)
        console.log(scores.length);
    console.log(scores.map(brackets).join(""));
}

do {
    createNewScores();
    updateElves();
    // print();
}
while (scores.length <= input + 9);

let match = scores.slice(input, input + 10);

const result1 = match.join("");

function compareSequence(seq1, i1, seq2, i2, length) {
    for (let i = 0; i < length; i++)
        if (seq1[i1] !== seq2[i2])
            return false;
    return true;
}

match = input.toString().split("").map(c => parseInt(c));

let result2 = 0;
for (let i = 0; i < scores.length - 10; i++) {
    if (compareSequence(scores, match, 10))
        result2 = i + 1;
}

console.log(result2);