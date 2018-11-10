const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const shortid = require('shortid');

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

        // create a file there if not already exists
        // No try-catch here since the app should fail
        //  loudly if the DB doesn't exist
        if (!fs.existsSync(this.path)) {
            const dirname = path.dirname(this.path);
            mkdirp(dirname);
            fs.writeFile(this.path, '', 'utf8', err => {
                if (err) console.error(err);
            });
        }
    }

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
        this.attributes = {};
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
        return db.getCollection(this.constructor.label);
    }

    static find(id) {
        if (db.has(this.constructor.label, this.id)) {
            return db.getFromCollection(this.constructor.label, this.id);
        } else {
            return undefined;
        }
    }

    static where(attributes) {
        const properties = Object.entries(attributes);
        return this.all().reduce((acc, obj) => {
            for (const [prop, val] of properties) {
                if (obj[prop] !== val) {
                    return;
                }
            }
            acc.push(obj);
        }, []);
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
                db.createCollection(
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
        }
    }

    requestMatch(respondent, matchAttrs) {
        const matchRequest = Match.where({
            requester_id: respondent.id,
            respondent_id: this.id,
        });

        if (matchRequest.length > 0) {
            this.acceptMatch(matchRequest[0]);
        } else {
            const match = new Match({
                requester_id: this.id,
                respondent_id: respondent.id,
                ...matchAttrs,
            });
        }
    }

    getMatches() {
        Match.where({
            requester_id: this.id,
        });
    }

    acceptMatch(match) {
        if (match.get('respondent_id') === this.id) {
            match.accept();
        }
    }

    rejectMatch(match) {
        if (match.get('respondent_id') === this.id) {
            match.reject();
        }
    }

    notify(message) {
        // TODO: notification logic
    }

}

class Match extends StoredObject {

    constructor(attributes = {}) {
        super();

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

            requester_id: String,
            respondent_id: String,

            class: String,
            proficiency: Number,
            reason: String,
        }
    }

    accept() {
        this.setAttributes({
            accepted: true,
            responded_time: now(),
        });
    }

    reject() {
        this.setAttributes({
            accepted: false,
            responded_time: now(),
        });
    }

}

module.exports = {
    User,
    Match,
    flush: async () => await db.flush(),
};
