const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const Promise = require('bluebird');
Promise.config({longStackTraces: true, warnings: true})

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

        _.set(params, 'fs', fs);

        return Promise.resolve(git.add(params));
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
        _.set(params, 'fs', fs);

        return Promise.resolve(git.status(params));
    }


}

module.exports = GitClient;
