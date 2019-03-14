const CurrentLocation = {
    _location: 0,

    get() {
        return this._location;
    },

    set(locationId) {
        this._location = locationId;
    }
}

export default CurrentLocation