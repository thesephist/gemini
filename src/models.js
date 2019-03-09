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
    ADMINS,
} = require('./utils.js');

const secrets = require('../secrets.js');
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
            const dbContents = fs.readFileSync(
                this.path,
                {encoding: 'utf8'}
            );
            try {
                this.inMemoryCopy = JSON.parse(dbContents);
            } catch (e) {
                console.error(`Error while reading JSON database`, e);
                console.log('JSON dump:', dbContents);
                throw new Error('Please remedy any issues with the JSON database and restart the server')
            }
        }
    }

    // TODO: revise this so it's safe to call flush() multiple times
    //  in rapid succession -- it should queue up flushes and
    //  perform them in order.
    async flush() {
        return await this._flush();
    }

    async _flush() {
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

        this.id = attributes.id || shortid.generate();
        this.attributes = Object.assign(
            this.constructor.defaults,
            attributes,
            {id: this.id}
        );
    }

    static get label() {
        throw new Error('This method should be overridden in child classes!');
        return 'storedobject';
    }

    static get schema() {
        throw new Error('This method should be overridden in child classes!');
        return {};
    }

    static get writable() {
        return Object.keys(this.schema);
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

    toJSON() {
        return {
            id: this.id,
            ...this.attributes,
        };
    }

    delete() {
        if (db.has(this.constructor.label, this.id)) {
            db.deleteFromCollection(this.constructor.label, this.id);
        }
        this._saved = true;
    }

    set(attr, value) {
        if (!(attr in this.constructor.writable)) {
            this.attributes[attr] = value;
            this._saved = false;
        }
    }

    get(attr) {
        return this.attributes[attr];
    }

    setAttributes(attrs = {}) {
        for (const [attr, value] of Object.entries(attrs)) {
            this.set(attr, value);
        }
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
            id: String,
            name: String,
            email: String,
            availability: Object,
            google_id: String,
            created_time: Number,
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

    static get writable() {
        return [
            'availability',
        ];
    }

    isAdmin() {
        return ADMINS.includes(this.get('email'));
    }

    getCurrentRequests() {
        return Request.where({
            user_id: this.id,
            semester: config.SEMESTER,
        });
    }

    createRequest(course, proficiency, reason) {
        // NOTE: this is a temporary fix that disallows
        //  the creation of multiple Requests per user
        //  at the ORM level.
        // course: course,
        const existingRequest = this.getCurrentRequests();
        let request;
        if (existingRequest.length > 0) {
            request = existingRequest[0];
            // NOTE: this statement is same as above NOTE
            if (request.get('course') === course) {
                request.setAttributes({
                    proficiency,
                    reason,
                });
            }
        } else {
            request = new Request({
                user_id: this.id,
                course,
                proficiency,
                reason,
            });
        }
        request.save();
        return request;
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
            id: String,
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
            semester: config.SEMESTER, // change every semester
        }
    }

    static get writable() {
        return [
            'proficiency',
            'reason',
            'closed',
        ];
    }

    get user() {
        return User.find(this.get('user_id'));
    }

    getAcceptedMatches() {
        return Match.where({
            requester_request_id: this.id,
            accepted: true,
        }).concat(Match.where({
            respondent_request_id: this.id,
            accepted: true,
        }));
    }

    getRequestedMatches() {
        return Match.where({
            respondent_request_id: this.id,
            accepted: null,
        });
    }

    getSortedCandidates() {
        // get all requests for this course
        const candidateRequests = this.constructor.where({
            course: this.get('course'),
            closed: false,
        });

        // exclude people who already requested matches with this user
        const excludedRequestIds = [
            this.id,
            ...this.getRequestedMatches().map(m => m.get('requester_request_id')),
            ...this.getAcceptedMatches().map(m => m.get('requester_request_id')),
        ];
        const filteredRequests = candidateRequests.filter(r => {
            return !excludedRequestIds.includes(r.id);
        });

        // sort by proficiency match
        const sortedRequests = sortBy(filteredRequests, req => {
            return Math.abs(req.get('proficiency') - this.get('proficiency'));
        });

        return sortedRequests;
    }

    hasRequestedMatch(respondent_request) {
        let matches = Match.where({
            requester_request_id: this.id,
            respondent_request_id: respondent_request.id,
        });
        return matches.length > 0;
    }

    createMatch(respondent_request, message = '') {
        let matches = Match.where({
            requester_request_id: this.id,
            respondent_request_id: respondent_request.id,
        });
        let match;
        if (matches.length > 0) {
            match = matches[0]
        } else {
            match = new Match({
                requester_request_id: this.id,
                respondent_request_id: respondent_request.id,
                message: message,
            });
            match.save();

            respondent_request.user.notify(
                `Studybuddy request from ${this.user.get('name')}`,
                `
                <p>${message}</p>
                <hr/>
                <p>${this.user.get('name')} wants to work on: ${this.get('reason')}</p>
                <p><a href="${secrets.AUTH_HOST}/match/${match.id}">Click here</a> to respond on Studybuddy! (Direct responses to this email won't reach ${this.user.get('name')}.)</p>`,
            );
        }

        return match;
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
            id: String,
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

    static get writable() {
        return [
            'requester_request_id',
            'respondent_request_id',
        ];
    }

    get requesterRequest() {
        return Request.find(this.get('requester_request_id'));
    }

    get respondentRequest() {
        return Request.find(this.get('respondent_request_id'));
    }

    accept() {
        this.setAttributes({
            accepted: true,
            responded_time: now(),
        });
        this.save();

        const requester = Request.find(this.get('requester_request_id')).user;
        const respondent = Request.find(this.get('respondent_request_id')).user;

        requester.notify(
            `${respondent.get('name')} accepted your Studybuddy request!`,
            `
            <p><strong>${respondent.get('name')}</strong> accepted your Studybuddy request.</p>
            <p><a href="${secrets.AUTH_HOST}/match/${this.id}?source=accept">Click here</a> to see their email and contact them!</p>
            `
        );
    }

    reject() {
        this.setAttributes({
            accepted: false,
            responded_time: now(),
        });
        this.save();

        const requester = Request.find(this.get('requester_request_id')).user;
        const respondent = Request.find(this.get('respondent_request_id')).user;

        requester.notify(
            `${respondent.get('name')} declined your Studybuddy request`,
            `
            <p><strong>${respondent.get('name')}</strong> declined your Studybuddy request.</p>
            <p><a href="${secrets.AUTH_HOST}/dashboard?source=decline">Click here</a> to find more students.</p>
            `
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
