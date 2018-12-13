function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function contains(self, value) {
    return self.indexOf(value) > -1;
}

Object.defineProperty(Array.prototype, 'contains', {
    value: function (value) {
        return this.indexOf(value) > -1
    },
});

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const eachCell = (width, height, callback) => {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            callback(x, y);
        }
    }
};

module.exports = {onlyUnique, contains, flatten, eachCell};
