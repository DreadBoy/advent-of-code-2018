const fs = require("fs");
const {flatten, eachCell} = require("./helper");
const input = fs.readFileSync("day-3.txt").toString();

const grid = [];

eachCell(1000, 1000, (x, y) => {
    if (!grid[x])
        grid[x] = [];
    grid[x][y] = {
        x,
        y,
        count: 0
    };
});

const claims = {};

input
    .split("\n")
    .map(line => {
        const parts = line.split(" ");
        return {
            id: parseInt(parts[0].replace("#", "")),
            x: parseInt(parts[2].split(",")[0]),
            y: parseInt(parts[2].split(",")[1].replace(":", "")),
            width: parseInt(parts[3].split("x")[0]),
            height: parseInt(parts[3].split("x")[1]),
        };
    })
    .forEach(claim => {
        eachCell(1000, 1000, (i, j) => {
            grid[claim.x + i][claim.y + j].claimdId = claim.id;
            grid[claim.x + i][claim.y + j].count++;
        }, claim.width, claim.height);
        claims[claim.id] = {
            size: claim.width * claim.height,
            count: 0,
        };
    });

const flattened = flatten(grid).filter(c => c.count);

const result1 = flattened.filter(cell => cell.count > 1).sort((a, b) => b.count - a.count).length;

flattened.filter(cell => cell.count === 1).forEach(cell => {
    claims[cell.claimdId].count++;
});

const result2 = Object.keys(claims).filter(key => claims[key].count === claims[key].size)[0];

console.log(result1, result2);
