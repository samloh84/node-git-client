const Promise = require('bluebird');
Promise.config({longStackTraces: true, warnings: true})
const _ = require('lodash');
const _glob = require('glob');
const fsPromises = require('fs/promises');

let glob = function (pattern, options) {
    return new Promise(function (resolve, reject) {

        _glob(pattern, options, function (err, files) {
            if (!_.isNil(err)) {
                return reject(err);
            }
            return resolve(files);

        })
    });
}


let stat = function (path) {
    if (_.isArray(path)) {
        return Promise.map(path, function (pathEntry) {
            return Promise.props({
                path: pathEntry,
                stat: fsPromises.stat(pathEntry)
            });
        })
    } else if (_.isObject(path)) {
        return Promise.props(_.mapValues(path, fsPromises.stat));
    } else {
        return Promise.resolve(fsPromises.stat(path));
    }
}

module.exports = {
    glob: glob,
    stat: stat
}