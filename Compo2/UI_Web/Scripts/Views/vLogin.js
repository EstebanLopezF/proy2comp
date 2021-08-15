function vLogin() {
    this.vHelper = new ValidationHelper();
    this.ctrlActions = new ControlActions();
    this.service = "login";
    this.sessionStorage = new SessionStorage();
    this.variables = new Variables();
    this.URL_Password = "https://localhost:44346/api/password/";
    this.URL_Login = "https://localhost:44346/api/login/";
    this.URL_ROL = "https://localhost:44346/api/rolxuser/"
    this.URL_User = "https://localhost:44346/api/user/"

    this.VerifyAccount = function () {
        var loginData = this.ctrlActions.GetDataForm('frmLoginData');

        if (!this.vHelper.validateFormValues(frmLoginData)) {
            $('.spinner').show();

            Promise.all([
                new Promise((resolve, reject) => {
                    $.post(this.URL_Login, loginData)
                        .done((res) => {
                            resolve(res);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                }),
                new Promise((resolve, reject) => {
                    $.get(`${this.URL_ROL}${loginData.ID_Owner}`)
                        .done((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                }),
                new Promise((resolve, reject) => {
                    $.get(`${this.URL_User}${loginData.ID_Owner}`)
                        .done((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
            ])
                .then(res => {
                    const RES_LoginStatus = res[0],
                        RES_RelatedRoles = res[1],
                        RES_User = res[2];

                    this.sessionStorage.SetSessionStorage(loginData.ID_Owner);
                    this.sessionStorage.SetRolStorage(RES_RelatedRoles.Data);
                    this.sessionStorage.SetStatusStorage(RES_User.Data.Status);

                    if (RES_LoginStatus.Data == this.variables.PassTemp) {
                        window.location = "/Home/vModifyPassword";
                    } else {
                        window.location = "/Home/vProfileUser";
                    }

                    $('.spinner').hide();
                })
                .catch(err => {
                    const errMessage = err.responseJSON.ExceptionMessage;
                    this.ctrlActions.ShowMessage('E', errMessage);

                    $('.spinner').hide();
                });
        } else {
            this.ctrlActions.ShowMessage('E', 'Por favor, ingrese todos los valores !');
        }
    }

    this.Logout = function () {
        $('.spinner').show();
        setTimeout(() => {
            $('.spinner').hide();
            this.sessionStorage.CloseSessionStorage();
            window.location = "/";
        }, 1000);
    }

    this.RetPass = async function () {

        if (!this.vHelper.validateFormValues(frmRetPass)) {
            $('.spinner').show();
            const ID_User = document.getElementById('txtID').value;

            new Promise((resolve, reject) => {
                $.get(`${this.URL_Password}${ID_User}`, (res) => {
                    $('.spinner').hide();

                    if (res.ClassName == "System.Exception") {
                        reject(res.Message);
                    } else {
                        resolve(res.Data);
                    }
                });
            })
                .then(res => {
                    this.ctrlActions.ShowMessage('I', res);
                })
                .catch(err => {
                    this.ctrlActions.ShowMessage('E', err);
                });
        } else {
            this.ctrlActions.ShowMessage('E', 'Por favor, ingrese todos los valores !');
        }
    };

    this.ModifyPassword = function () {
        $('.spinner').show();

        const activeUser = this.sessionStorage.GetSessionStorage(),
                currPassword = document.getElementById("txtTEM_Password").value,
                newPassword = document.getElementById("txtNEW_Password").value,
                confPassword = document.getElementById("txtCONF_Password").value;

        if (newPassword != confPassword)
            this.ctrlActions.ShowMessage("E", "Las contraseñas no coinciden");
        else {
            const passwordToQuery = {
                ID_Owner: activeUser,
                Value: currPassword
            };

            $.post(this.URL_Login, passwordToQuery)
                .done((res) => {
                    passwordToQuery.Value = newPassword;
                    $.post(this.URL_Password, passwordToQuery)
                        .done((res) => {
                            this.ctrlActions.ShowMessage("I", res.Message);
                            $('.spinner').hide();
                            window.location = "/Home/vProfileUser";
                        })
                        .fail((err) => {
                            const errMessage = err.responseJSON.ExceptionMessage;
                            this.ctrlActions.ShowMessage('E', errMessage);
                            $('.spinner').hide();
                        });

                })
                .fail((err) => {
                    const errMessage = err.responseJSON.ExceptionMessage;
                    this.ctrlActions.ShowMessage('E', errMessage);
                    $('.spinner').hide();
                });
        }

    }
}