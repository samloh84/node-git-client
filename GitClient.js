const git = require('isomorphic-git');
const _ = require("lodash");
const Promise = require('bluebird');

module.exports = class GitClient {
    constructor(params) {
        this._dir = _.get(params, 'dir');

        this._username = _.get(params, 'username');
        this._password = _.get(params, 'password');

        this._authorName = _.get(params, 'authorName');
        this._authorEmail = _.get(params, 'authorEmail');

        this._onAuth = _.get(params, 'onAuth');

        this._fs = _.get(params, 'fs');
        this._http = _.get(params, 'http');

    }


    _authorize(params) {
        let username = _.get(params, 'username', _.get(this, '_username'));
        let password = _.get(params, 'password', _.get(this, '_password'));
        return function () {
            return {username, password}
        };
    }


    _getGitParams(params) {
        let dir = _.get(params, 'dir', _.get(this, '_dir'));
        let onAuth = _.get(params, 'onAuth', _.get(this, '_onAuth', this._authorize(params)));
        let authorName = _.get(params, 'password', _.get(this, '_authorName'));
        let authorEmail = _.get(params, 'password', _.get(this, '_authorEmail'));
        let fs = _.get(this, '_fs', require("fs"));
        let http = _.get(this, '_http', require('isomorphic-git/http/node'));

        return {
            dir,
            onAuth,
            author: {
                name: authorName,
                email: authorEmail
            },
            fs,
            http
        }
    }


    clone(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.clone(gitParams));
    }

    add(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.add(gitParams));
    }

    remove(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.remove(gitParams));
    }

    listFiles(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.listFiles(gitParams));
    }

    commit(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.commit(gitParams));
    }

    push(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.push(gitParams));
    }

    pull(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.pull(gitParams));
    }

    checkout(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.checkout(gitParams));
    }

    branch(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.branch(gitParams));
    }

    status(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.status(gitParams));
    }
    isIgnored(params) {
        let gitClient = this;
        let gitParams = gitClient._getGitParams(params);
        return Promise.resolve(git.isIgnored(gitParams));
    }


}