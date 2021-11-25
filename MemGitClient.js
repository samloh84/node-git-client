const GitClient = require('./GitClient');
const _ = require("lodash");
const Promise = require('bluebird');
const {fs: memfs} = require('memfs');

module.exports = class MemGitClient extends GitClient {
    constructor(props) {
        _.set(props, 'fs', memfs);
        super(props);
    }

}