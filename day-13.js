const fs = require("fs");
const {eachCell} = require("./helper");
const input = fs.readFileSync("day-13.txt").toString();

class Train {
    constructor(arrow, x, y) {
        this.id = Math.floor(Math.random() * 10000);
        this.direction = arrow;
        this.x = x;
        this.y = y;
        this.intersection = 'l';
    }

    move({x, y}) {
        this.x += x;
        this.y += y;
    }

    turn(arrow) {
        this.direction = arrow
    }

    nextIntersection() {
        this.intersection = intersections[(intersections.indexOf(this.intersection) + 1) % intersections.length];
    }
}

// up: 0, right: 1, down: 2, left: 3
const arrows = ['<', '>', 'v', '^'];
const bends = ['\\', '/'];
const straights = ['-', '|'];
const turns = {
    '^\\': '<',
    '>\\': 'v',
    'v\\': '>',
    '<\\': '^',
    '^/': '>',
    '>/': '^',
    'v/': '<',
    '</': 'v',

    '^+l': '<',
    '^+s': '^',
    '^+r': '>',

    '>+l': '^',
    '>+s': '>',
    '>+r': 'v',

    'v+l': '>',
    'v+s': 'v',
    'v+r': '<',

    '<+l': 'v',
    '<+s': '<',
    '<+r': '^',
};
const moves = {
    '<': {x: -1, y: 0},
    '>': {x: 1, y: 0},
    'v': {x: 0, y: 1},
    '^': {x: 0, y: -1},
};
const intersections = ['l', 's', 'r'];

let trains = [];

const grid = input.split("\n").map(line => line.split(""));
const width = grid.map(l => l.length).sort((a, b) => b - a)[0];
const height = grid.length;
eachCell(width, height, (x, y) => {
    if (arrows.contains(grid[y][x])) {
        trains.push(new Train(grid[y][x], x, y));
        if (grid[y][x] === '<' || grid[y][x] === '>')
            grid[y][x] = '-';
        if (grid[y][x] === 'v' || grid[y][x] === '^')
            grid[y][x] = '|';
    }
});

let firstCrash = null;
let ignoredTrains = [];

function tickCell(x, y) {
    const train = trains.filter(t => !ignoredTrains.contains(t)).filter(t => t.x === x && t.y === y)[0];
    if (!train)
        return ignoredTrains;
    ignoredTrains = [...ignoredTrains, train];
    train.move(moves[`${train.direction}`]);

    const anotherTrain = trains.filter(t => t.x === train.x && t.y === train.y && t !== train)[0];
    if (anotherTrain) {
        if (!firstCrash)
            firstCrash = {x: anotherTrain.x, y: anotherTrain.y};
        trains = trains.filter(t => t !== train && t !== anotherTrain);
        console.log(`Removing 2 trains, leaving ${trains.length}`);
    }

    if (bends.contains(grid[train.y][train.x]))
        train.turn(turns[`${train.direction}${grid[train.y][train.x]}`]);
    else if (grid[train.y][train.x] === '+') {
        train.turn(turns[`${train.direction}${grid[train.y][train.x]}${train.intersection}`]);
        train.nextIntersection();
    }
    return ignoredTrains;
}

function tickGrid() {
    // logGrid();
    eachCell(width, height, tickCell);
    ignoredTrains = [];
}

function logGrid() {
    const g = grid.map(l => l.slice());
    trains.forEach(t => g[t.y][t.x] = t.direction);
    console.log(g.map(l => l.join("")).join('\n'));
}

do {
    tickGrid();
} while (trains.length !== 1);

const result1 = `${firstCrash.x},${firstCrash.y}`;
const result2 = `${trains[0].x},${trains[0].y}`;

console.log(result1, result2);
