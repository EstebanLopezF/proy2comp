function SessionStorage() {
    this.SetSessionStorage = function (userID) {
        sessionStorage.setItem("usuarioActivo", userID);
    }

    this.SetRolStorage = function (Rol) {
        sessionStorage.setItem("rolActivo", JSON.stringify(Rol));
    }

    this.SetStatusStorage = function (Status) {
        sessionStorage.setItem("estadoActivo", JSON.stringify(Status));
    }

    this.GetSessionStorage = function () {
        return sessionStorage.getItem("usuarioActivo");
    }

    this.GetRolStorage = function () {
        return JSON.parse(sessionStorage.getItem("rolActivo"));
    }

    this.GetStatusStorage = function () {
        return JSON.parse(sessionStorage.getItem("estadoActivo"));
    }

    this.CloseSessionStorage = function () {
        sessionStorage.clear();
    }
}