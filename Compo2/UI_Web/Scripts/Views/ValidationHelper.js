function ValidationHelper() {

    this.validateFormValues = function (form) {
        var wereErrorsFound = false;

        Array.from(form.elements).forEach(e => {
            if (e.tagName == "INPUT") {
                if (e.value) {
                    e.classList.remove('border');
                    e.classList.remove('border-danger');
                } else {
                    wereErrorsFound = true;

                    e.classList.add('border');
                    e.classList.add('border-danger');
                }
            }
            if (e.id == "txtEmail") {
                if (!this.validateEmail(e.value)) {
                    wereErrorsFound = true;

                    e.classList.add('border');
                    e.classList.add('border-danger');
                }
            }
            if (e.id == "txtId" && location.pathname.split("/")[2] == "vRegisterUser") {
                if (String(e.value).length != 9 ) {
                    wereErrorsFound = true;

                    e.classList.add('border');
                    e.classList.add('border-danger');
                }
            }
        });
        return wereErrorsFound;
    }

    this.validateEmail = function (email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}