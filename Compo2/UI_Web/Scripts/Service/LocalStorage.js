function LocalStorage () {
    this.set_LS = function (data, key) {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    }

    this.get_LS = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }

    this.clean_LS = function (key) {
        localStorage.removeItem(key);
    }
}