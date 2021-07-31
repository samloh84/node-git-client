const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const Promise = require('bluebird');
Promise.config({longStackTraces: true, warnings: true})
const {glob, stat} = require('./util');

const _ = require('lodash');


class GitClient {
    constructor(params) {
        this._username = _.get(params, 'username');
        this._password = _.get(params, 'password');

        this._author_name = _.get(params, 'author_name');
        this._author_email = _.get(params, 'author_email');


    }


    clone(params) {
        let _this = this;

        _.set(params, 'fs', fs);
        _.set(params, 'http', http);

        if (_.isNil(_.get(params, 'onAuth'))) {
            _.set(params, 'onAuth', function () {
                return {username: _this._username, password: _this._password}
            })
        }

        return Promise.resolve(git.clone(params));
    }

    add(params) {
        let filepath = _.get(params, 'filepath');

        let dir = _.get(params, 'dir');

        let pattern = path.resolve(dir, filepath);

        return glob(pattern, {dot: true})
            .then(function (files) {
                return stat(files)
                    .then(function (file_stats) {
                        let filePaths = _.map(_.filter(file_stats, function (file_stat) {
                            return file_stat.stat.isFile();
                        }), function (file_stat) {
                            return path.relative(dir, file_stat.path);
                        });

                        return Promise.map(filePaths, function (filePath) {

                            let addParams = _.assign({}, params, {
                                fs: fs,
                                filepath: filePath
                            })
                            return git.add(addParams)

                        })
                    })


            });

    }


    commit(params) {

        _.set(params, 'fs', fs);

        if (_.isEmpty(_.get(params, ['author', 'name']))) {
            _.set(params, ['author', 'name'], this._author_name);
        }

        if (_.isEmpty(_.get(params, ['author', 'email']))) {
            _.set(params, ['author', 'email'], this._author_email);
        }


        return Promise.resolve(git.commit(params));
    }

    push(params) {
        let _this = this;
        _.set(params, 'fs', fs);
        _.set(params, 'http', http);

        if (_.isNil(_.get(params, 'onAuth'))) {
            _.set(params, 'onAuth', function () {
                return {username: _this._username, password: _this._password}
            })
        }
        return Promise.resolve(git.push(params));
    }


    pull(params) {
        let _this = this;
        _.set(params, 'fs', fs);
        _.set(params, 'http', http);

        if (_.isNil(_.get(params, 'onAuth'))) {
            _.set(params, 'onAuth', function () {
                return {username: _this._username, password: _this._password}
            })
        }
        return Promise.resolve(git.pull(params));
    }

    checkout(params) {
        _.set(params, 'fs', fs);

        return Promise.resolve(git.checkout(params));
    }

    branch(params) {
        _.set(params, 'fs', fs);

        return Promise.resolve(git.branch(params));
    }

    status(params) {
        let filepath = _.get(params, 'filepath');

        let dir = _.get(params, 'dir');

        let pattern = path.resolve(dir, filepath);

        return glob(pattern, {dot: true})
            .then(function (files) {
                return stat(files)
                    .then(function (file_stats) {
                        let filePaths = _.map(_.filter(file_stats, function (file_stat) {
                            return file_stat.stat.isFile();
                        }), function (file_stat) {
                            return path.relative(dir, file_stat.path);
                        });

                        return Promise.map(filePaths, function (filePath) {

                            let statusParams = _.assign({}, params, {
                                fs: fs,
                                filepath: filePath
                            })
                            return Promise.props({
                                filePath: filePath,
                                status: git.status(statusParams)
                            });
                        })
                    })


            });
    }


}

module.exports = GitClient;
