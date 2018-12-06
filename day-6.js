const fs = require("fs");
const contains = require("./helper").contains;
const onlyUnique = require("./helper").onlyUnique;
const input = fs.readFileSync("day-6.txt").toString();

const coordinates = input.split("\n")
    .map(line => line.replace("\r", "").split(", ").map(n => parseInt(n)))
    .map((nums, i) => {
        const [x, y] = nums;
        return {x, y, name: `_${i}_`}
    });

const bounds = {
    xMin: coordinates.sort((a, b) => a.x - b.x)[0].x,
    xMax: coordinates.sort((a, b) => b.x - a.x)[0].x,
    yMin: coordinates.sort((a, b) => a.y - b.y)[0].y,
    yMax: coordinates.sort((a, b) => b.y - a.y)[0].y,
};
const grid = [];
for (let x = bounds.xMin; x <= bounds.xMax; x++) {
    grid[x] = [];
    for (let y = bounds.yMin; y < bounds.yMax; y++) {
        const distances = coordinates
            .map(coor => ({coor, dist: Math.abs(x - coor.x) + Math.abs(y - coor.y)}))
            .sort((a, b) => a.dist - b.dist);
        if (distances[0].dist === distances[1].dist)
            grid[x][y] = ".";
        else grid[x][y] = distances[0].coor.name.replace(/_/g, "");
    }
}
const output = () => {
    let output = "";
    for (let x = bounds.xMin; x <= bounds.xMax; x++) {
        let line = "";
        for (let y = bounds.yMin; y < bounds.yMax; y++) {

            if (coordinates.filter(coor => coor.x === x && coor.y === y).length > 0)
                grid[x][y] = coordinates.filter(coor => coor.x === x && coor.y === y)[0].name;
            else if (grid[x][y] === ".")
                line += " .. ";
            else if (grid[x][y] === "x")
                line += " xx ";
            else
                line += " " + grid[x][y].padStart(2, "0") + " ";
        }
        output += line + "\n";
    }
    console.log(output);
};

let infiniteArea = [];
for (let x = bounds.xMin; x < bounds.xMax; x++) {
    infiniteArea.push(grid[x][bounds.yMin]);
    infiniteArea.push(grid[x][bounds.yMax]);
}
infiniteArea.push(grid[bounds.xMin]);
infiniteArea.push(grid[bounds.xMax]);
infiniteArea = infiniteArea.filter(cell => cell !== ".").filter(onlyUnique);

for (let x = bounds.xMin; x <= bounds.xMax; x++) {
    for (let y = bounds.yMin; y < bounds.yMax; y++) {
        if (contains(infiniteArea, grid[x][y]))
            grid[x][y] = "x";
    }
}

// output();
const sums = {};
for (let x = bounds.xMin; x <= bounds.xMax; x++) {
    for (let y = bounds.yMin; y < bounds.yMax; y++) {
        const cell = grid[x][y];
        if (!Number.isInteger(parseInt(cell)))
            continue;
        if (!sums[cell])
            sums[cell] = 0;
        sums[cell]++;
    }
}
const areas = Object.keys(sums).map(key => ({key, sum: sums[key]})).sort((a, b) => b.sum - a.sum);
const result1 = areas[0].sum;

const MaxSum = 5000;
let blanketArea = 0;
for (let x = bounds.xMax - MaxSum; x <= bounds.xMin + MaxSum; x++) {
    for (let y = bounds.yMax - MaxSum; y < bounds.yMin + MaxSum; y++) {
        const allDistances = coordinates
            .map(coor => ({coor, dist: Math.abs(x - coor.x) + Math.abs(y - coor.y)}))
            .reduce((acc, curr) => acc + curr.dist, 0);
        if (allDistances < 10000)
            blanketArea++;
    }
}
const result2 = blanketArea;
console.log(result1, result2);