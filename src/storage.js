const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const shortid = require('shortid');
const sortBy = require('lodash.sortby');

const {
    notify,
} = require('./notify.js');

const {
    now,
} = require('./utils.js');

const config = require('../config.js');

/**
 * A very rudimentary JSON file-backed database
 *  for quick prototyping. Do NOT use in environments
 *  that require robustness under scale. This WILL fail.
 */
class JSONStorage {

    constructor(db_path) {
        this.path = db_path;
        this.inMemoryCopy = {};

        this._flushRequests = [];

        // create a file there if not already exists
        // No try-catch here since the app should fail
        //  loudly if the DB doesn't exist
        if (!fs.existsSync(this.path)) {
            const dirname = path.dirname(this.path);
            mkdirp(dirname);
            fs.writeFile(this.path, '{}', 'utf8', err => {
                if (err) console.error(err);
            });
        } else {
            this.inMemoryCopy = JSON.parse(fs.readFileSync(
                this.path,
                {encoding: 'utf8'},
            ));
        }
    }

    // TODO: revise this so it's safe to call flush() multiple times
    //  in rapid succession -- it should queue up flushes and
    //  perform them in order using this._flushRequests.
    async flush() {
        try {
            const contents = JSON.stringify(this.inMemoryCopy);

            return new Promise((res, rej) => {
                try {
                    fs.writeFile(this.path, contents, 'utf8', err => {
                        if (err) console.error('Error while flushing data to database', e);

                        res();
                    });
                } catch (e) {
                    rej(e);
                }
            });
        } catch (e) {
            console.error('Error while stringifying in-memory copy of database', e);
            return Promise.reject();
        }
    }

    createCollection(label) {
        label = label.toString();
        if (!(label in this.inMemoryCopy)) {
            this.inMemoryCopy[label] = {};
        }
        this.flush();
    }

    _hasCollection(label) {
        return label in this.inMemoryCopy;
    }

    _hasId(label, id) {
        return (
            this._hasCollection(label)
            && id in this.inMemoryCopy[label]
        );
    }

    has(label, id) {
        return this._hasId(label, id);
    }

    getCollection(label) {
        if (this._hasCollection(label)) {
            return Object.values(this.inMemoryCopy[label])
        } else {
            throw new Error(`Could not find collection ${label} in database`);
        }
    }

    createInCollection(label, id, attributes) {
        if (this._hasCollection(label)) {
            if (this._hasId(label, id)) {
                throw new Error(`Object with id ${id} in collection ${label} already exists`);
            } else {
                this.inMemoryCopy[label][id] = Object.assign({}, attributes);
            }
        } else {
            throw new Error(`Could not find collection ${label} in database`);
        }
        this.flush();
    }

    deleteFromCollection(label, id) {
        if (this._hasCollection(label)) {
            if (this._hasId(label, id)) {
                delete this.inMemoryCopy[label][id];
            } else {
                throw new Error(`Object with id ${id} in collection ${label} doesn't exist`);
            }
        } else {
            throw new Error(`Could not find collection ${label} in database`);
        }
        this.flush();
    }

    updateInCollection(label, id, attributes) {
        if (this._hasCollection(label)) {
            if (this._hasId(label, id)) {
                this.inMemoryCopy[label][id] = Object.assign(
                    this.inMemoryCopy[label][id],
                    attributes
                );
            } else {
                throw new Error(`Object with id ${id} in collection ${label} doesn't exist`);
            }
        } else {
            throw new Error(`Could not find collection ${label} in database`);
        }
        this.flush();
    }

    getFromCollection(label, id) {
        if (this._hasCollection(label)) {
            if (this._hasId(label, id)) {
                return this.inMemoryCopy[label][id];
            } else {
                throw new Error(`Object with id ${id} in collection ${label} doesn't exist`);
            }
        } else {
            throw new Error(`Could not find collection ${label} in database`);
        }
    }

}

const db = new JSONStorage(config.DATABASE);

class StoredObject {

    constructor(attributes = {}) {
        this._saved = false;

        this.id = shortid.generate();
        this.attributes = Object.assign(this.constructor.defaults, attributes);
    }

    static get label() {
        throw new Error('This method should be overridden in child classes!');
        return 'storedobject';
    }

    static get schema() {
        throw new Error('This method should be overridden in child classes!');
        return {};
    }

    static all() {
        return db.getCollection(this.label).map(obj => new this(obj));
    }

    static find(id) {
        if (db.has(this.label, id)) {
            return new this(db.getFromCollection(this.label, id));
        } else {
            return undefined;
        }
    }

    static where(attributes) {
        const properties = Object.entries(attributes);
        const objList = db.getCollection(this.label).reduce((acc, obj) => {
            for (const [prop, val] of properties) {
                if (obj[prop] !== val) {
                    return acc;
                }
            }
            acc.push(obj);
            return acc;
        }, []);
        return objList.map(obj => new this(obj));
    }

    delete() {
        if (db.has(this.constructor.label, this.id)) {
            db.deleteFromCollection(this.constructor.label, this.id);
        }
        this._saved = true;
    }

    set(attr, value) {
        this.attributes[attr] = value;
        this._saved = false;
    }

    get(attr) {
        return this.attributes[attr];
    }

    setAttributes(attrs = {}) {
        this.attributes = Object.assign(this.attributes, attrs);
        this._saved = false;
    }

    save() {
        if (!this._saved) {
            if (db.has(this.constructor.label, this.id)) {
                db.updateInCollection(
                    this.constructor.label,
                    this.id,
                    this.attributes
                );
            } else {
                db.createInCollection(
                    this.constructor.label,
                    this.id,
                    this.attributes
                );
            }
            this._saved = true;
        }
    }

}

class User extends StoredObject {

    static get label() {
        return 'user';
    }

    static get schema() {
        return {
            name: String,
            email: String,
            availability: Object,
            google_id: String,
        }
    }

    static get defaults() {
        return {
            name: 'Anonymous',
            email: null,
            availability: {},
            google_id: '',
        }
    }

    createRequest(course, proficiency, reason) {
        const existingRequest = Request.where({
            user_id: this.id,
            course: course,
        });
        if (existingRequest.length > 0) {
            const request = existingRequest[0];
            request.setAttributes({
                proficiency,
                reason,
            });
            request.save();
        } else {
            const request = new Request({
                user_id: this.id,
                course,
                proficiency,
                reason,
            });
            request.save();
        }
    }

    notify(subject, message) {
        notify(this, subject, message);
    }

}
db.createCollection(User.label);

class Request extends StoredObject {

    static get label() {
        return 'request';
    }

    static get schema() {
        return {
            user_id: String,
            course: String,
            proficiency: Number,
            reason: String,
            closed: Boolean,
        }
    }

    static get defaults() {
        return {
            user_id: null,
            course: null,
            proficiency: 0,
            reason: '',
            closed: false,
        }
    }

    get user() {
        return User.find(this.get('user_id'));
    }

    getSortedCandidates() {
        const candidateRequests = this.constructor.where({
            course: this.course,
        });

        const sortedRequests = sortBy(candidateRequests, req => {
            return Math.abs(req.get('proficiency') - this.get('proficiency'));
        });

        return sortedRequests;
    }

    requestMatch(respondent_request, message) {
        const match = new Match({
            requester_request_id: this.id,
            respondent_request_id: respondent_request.id,
            message: message,
        });
        match.save();

        respondent_request.user.notify(
            `Studybuddy request from ${this.user.get('name')}`,
            `<p>
            Hi! I'm ${this.user.get('name')} and I'm looking for a study buddy for ${this.get('course')}. Do you want to study together?
            </p>
            <p><a href="${config.AUTH_HOST}/match/${match.id}">Respond on Studybuddy</a></p>`,
        );
    }

}
db.createCollection(Request.label);

class Match extends StoredObject {

    constructor(attributes = {}) {
        super(attributes);

        this.set('created_time', now());
    }

    static get label() {
        return 'match';
    }

    static get schema() {
        return {
            created_time: Number,
            responded_time: Number,
            accepted: Boolean,
            message: String,

            requester_request_id: String,
            respondent_request_id: String,
        }
    }

    static get defaults() {
        return {
            created_time: null,
            responded_time: null,
            accepted: null,
            message: '',

            requester_request_id: null,
            respondent_request_id: null,
        }
    }

    accept() {
        this.setAttributes({
            accepted: true,
            responded_time: now(),
        });

        const requester = Request.find(this.get('requester_request_id')).user;
        const respondent = Request.find(this.get('respondent_request_id')).user;

        requester.notify(
            `${respondent} accepted your Studybuddy request!`,
            `${respondent} accepted your Studybuddy request. Contact them by emailing ${respondent.get('email')}`
        );
    }

    reject() {
        this.setAttributes({
            accepted: false,
            responded_time: now(),
        });

        const requester = Request.find(this.get('requester_request_id')).user;
        const respondent = Request.find(this.get('respondent_request_id')).user;

        requester.notify(
            `${respondent} declined your Studybuddy request`,
            `${respondent} declined your Studybuddy request.`
        );
    }

}
db.createCollection(Match.label);

module.exports = {
    User,
    Request,
    Match,
    flush: async () => await db.flush(),
};

