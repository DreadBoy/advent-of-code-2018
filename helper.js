function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function contains(self, value) {
    return self.indexOf(value) > -1;
}


module.exports = {onlyUnique, contains};
