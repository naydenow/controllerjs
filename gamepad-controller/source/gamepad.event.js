export default class Event {
    constructor(id, name, key, type, fn) {
        this.id = id;
        this.name = name;
        this.key = key;
        this.fn = fn;
        this.type = type;
    }

    play(value) {
        this.fn(value);
    }
}