const Location = {
    _location: 0,

    get() {
        return this._location;
    },

    set(locationId) {
        this._location = locationId;
    }
}

export {
    Location
}