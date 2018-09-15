const fs = require("fs");
const glob = require("glob");
const Logger = require("./log");

function getId(path) {
    return path.match(/\/([^/]+\/[^/]+)\.[^.]+$/).pop();
}

function resolve(Handlebars, partialsGlob) {
    let partials = [];

    if (partialsGlob == null) {
        return {};
    }

    partialsGlob.forEach((partialGlob) => {
        partials = partials.concat(glob.sync(partialGlob));
    });

    const partialMap = {};
    partials.forEach((path) => {
        partialMap[getId(path)] = path;
    });

    return partialMap;
}

function addMap(Handlebars, partialMap) {
    Object.keys(partialMap).forEach((partialId) => {
        Logger.log(`+ partial '${partialId}'`);
        Handlebars.registerPartial(partialId, fs.readFileSync(partialMap[partialId], "utf8"));
    });
}


module.exports = {
    getId,
    resolve,
    addMap
};
