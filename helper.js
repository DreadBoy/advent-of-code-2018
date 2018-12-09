function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function contains(self, value) {
    return self.indexOf(value) > -1;
}

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);


module.exports = {onlyUnique, contains, flatten};
