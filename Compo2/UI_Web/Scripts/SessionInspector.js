window.onload = function () {
    this.sessionInspactor = new SessionInspector();
    this.sessionInspactor.ValidateAccess();
}

function SessionInspector() {
    this.SessionService = new SessionStorage();
    this.Variables = new Variables();

    this.ValidateAccess = function () {
        const RelatedRoles = this.SessionService.GetRolStorage() || [],
            ActiveUser = this.SessionService.GetSessionStorage(),
            UserStatus = this.SessionService.GetStatusStorage(),
            ViewName = location.pathname.split("/")[2]

        let actionsLevel = this.Variables.NoAccess;

        if (UserStatus === this.Variables.UserBlocked) {
            if (ViewName !== "vBlockedAccount") {
                $("#userOptions").hide();
                window.location = "/Home/vBlockedAccount";
            } else {
                $("#userOptions").hide();
            }
        } else {
            switch (ViewName) {
                case "vProfileUser":
                    if (ActiveUser)
                        actionsLevel = this.Variables.FullAcess;
                    else
                        this.redirHome();
                    break;

                case "vListProperties":
                    if (ActiveUser)
                        actionsLevel = this.GetAccessRol(RelatedRoles);
                    break;

                case "vRegisterUser":
                    if (ActiveUser)
                        this.redirHome();
                    break;

                case "vActivateUser":
                    if (UserStatus != this.Variables.UserPendingPayment)
                        this.redirHome();
                    break;

                case "vListUser":
                    if (this.GetUserRole(RelatedRoles) != this.Variables.Admin)
                        this.redirHome();
                    break;

                case "vListPaymentMethod":
                    if (this.GetUserRole(RelatedRoles) != this.Variables.Prop && this.GetUserRole(RelatedRoles) != this.Variables.Client)
                        this.redirHome();
                    break;

                case "vListRegistrationRequest":
                    if (RelatedRoles.length == 0 || this.GetUserRole(RelatedRoles) != this.Variables.Admin)
                        this.redirHome();
                    break;

                case "vListBill":
                    if (RelatedRoles.length == 0 || this.GetUserRole(RelatedRoles) != this.Variables.Admin)
                        this.redirHome();
                    break;

                case "vListWorkspace":
                    if (RelatedRoles.length == 0)
                        this.redirHome();
                    break;

                case "vBlockedAccount":
                    if (RelatedRoles[0] !== this.Variables.UserBlocked)
                        this.redirHome();
            }
        }


        this.AddOptions(RelatedRoles, UserStatus);
        return actionsLevel;
    }

    this.redirHome = function () {
        window.location = "/";
    }

    this.GetUserStatus = function (RelatedRoles) {
        return RelatedRoles[0] ? RelatedRoles[0].Status : "";
    }

    this.GetUserRole = function (RelatedRoles) {
        return RelatedRoles[0] ? RelatedRoles[0].Type : "";
    }

    this.AddOptions = function (RelatedRoles, UserStatus) {
        if (RelatedRoles.find(r => r.Type == this.Variables.Admin) && UserStatus == this.Variables.UserActive) {
            document.getElementById("btnProfileUser").classList.remove("d-none");
            document.getElementById("btnListUsuer").classList.remove("d-none");
            document.getElementById("btnListBill").classList.remove("d-none");
            document.getElementById("btnListProperties").classList.remove("d-none");
            document.getElementById("btnListWorkspace").classList.remove("d-none");
            document.getElementById("btnListRegistryRequest").classList.remove("d-none");
            document.getElementById("btnListReservation").classList.remove("d-none");
        } else if (RelatedRoles.find(r => r.Type == this.Variables.Prop) && UserStatus == this.Variables.UserActive) {
            document.getElementById("btnRegisterWorkspace").classList.remove("d-none");
            document.getElementById("btnListWorkspace").classList.remove("d-none");
            document.getElementById("btnProfileUser").classList.remove("d-none");
            document.getElementById("btnRegisterProperty").classList.remove("d-none");
            document.getElementById("btnListProperties").classList.remove("d-none");
            document.getElementById("btnListPaymentMethod").classList.remove("d-none");
            document.getElementById("btnRegisterWorkspace").classList.remove("d-none");
            document.getElementById("btnListWorkspace").classList.remove("d-none");
            document.getElementById("btnListRentProfits").classList.remove("d-none");
            document.getElementById("btnListRefounds").classList.remove("d-none");
        } else if (RelatedRoles.find(r => r.Type == this.Variables.Client) && UserStatus == this.Variables.UserActive) {
            document.getElementById("btnProfileUser").classList.remove("d-none");
            document.getElementById("btnListProperties").classList.remove("d-none");
            document.getElementById("btnListWorkspace").classList.remove("d-none");
            document.getElementById("btnListPaymentMethod").classList.remove("d-none");
            document.getElementById("btnListReservation").classList.remove("d-none");
        } else if (RelatedRoles.find(r => r.Type == this.Variables.Prop)) {
            document.getElementById("btnActivateUser").classList.remove("d-none");
        }
    }

    this.GetAccessRol = function (Roles) {
        let HighestRolFound = "",
            stopChecking = false;

        Roles.forEach(each => {
            if (each.Type == this.Variables.Admin) {
                HighestRolFound = this.Variables.FullAcess;
                stopChecking = true;
            } else if (!stopChecking) {
                HighestRolFound = each.Type == this.Variables.Prop && this.Variables.PartialAccess;
            }
        });

        return HighestRolFound;
    }
}
