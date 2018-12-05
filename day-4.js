const fs = require("fs");
const input = fs.readFileSync("day-4.txt").toString();

const data = input
    .split("\n")
    .map(line => {
        const date = new Date(line.substring(1, line.indexOf("]")).replace(" ", "T"));
        const stamp = parseInt(line.substring(line.indexOf(":") + 1, line.indexOf("]")));
        return {date, stamp, event: line.substring(line.indexOf("] ") + 2)};
    })
    .sort((a, b) => a.date - b.date);

const collated = data.reduce((acc, d) => {
    if (d.event.indexOf("#") > -1) {
        acc.onShift = parseInt(d.event.substring(d.event.indexOf("#") + 1, d.event.indexOf(" ", d.event.indexOf("#"))));
        acc.startSleeping = null;
    } else if (d.event.indexOf("falls asleep") > -1 && acc.onShift !== null)
        acc.startSleeping = d.stamp;
    else if (d.event.indexOf("wakes up") > -1 && acc.onShift !== null && acc.startSleeping !== null) {
        if (!acc.guards[acc.onShift])
            acc.guards[acc.onShift] = {acc: 0, minutes: new Array(60).fill(0), id: acc.onShift};
        acc.guards[acc.onShift].acc += (d.stamp - acc.startSleeping);
        for (let i = acc.startSleeping; i < d.stamp; i++) acc.guards[acc.onShift].minutes[i]++;
        acc.startSleeping = null;
    } else
        console.warn("something's wrong");
    return acc;
}, {onShift: null, startSleeping: null, guards: {}}).guards;

const guards = Object.keys(collated).map(id => ({
    ...collated[id],
    id: parseInt(id),
    minutes: collated[id].minutes.map((m, i) => ({minute: i, acc: m})).sort((a, b) => b.acc - a.acc)
}));

const sleeper = guards.sort((a, b) => b.acc - a.acc)[0];
const mostMinute = sleeper.minutes[0].minute;
const result1 = sleeper.id * mostMinute;

const mostCommon = guards.sort((a, b) => b.minutes[0].acc - a.minutes[0].acc)[0];
const result2 = mostCommon.id * mostCommon.minutes[0].minute;

console.log(result1, result2);