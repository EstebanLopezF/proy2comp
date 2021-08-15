function vUser() {

    this.servicePhone = "sms";
    this.UI_Helper = new UI_Helper();
    this.TBL_Users_List_ID = 'TBL_User_List';
    this.service = 'user';
    this.serviceRol = 'userxrol';
    this.defaultRol = '2';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,Name,LastName,Email,PhoneNumber,Status,ElectronicWalletAmount,Rol,UrlImage";
    this.serviceVerification = "verification";
    this.serviceEmail = "email";
    this.variables = new Variables();
    this.LS_Service = new LocalStorage();

    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTableUserRoles(this.service, this.TBL_Users_List_ID, false);
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_Users_List_ID, true);
    }

    this.Create = function () {
        var redirection = '';
        var isClient = localStorage.getItem("IsUserCreate");
        var vHelper = new ValidationHelper(),
            userData = this.CTRL_Actions.GetDataForm('frmUserData');
        userData['ElectronicWalletAmount'] = 0;
        userData['UrlImage'] = '/Content/Images/default_profile.png';

        if (isClient == "yes") {
            var jsonObj = JSON.parse('{"IdRol":"3"}');
            userData['Status'] = 'Activo';
        } else {
            var jsonObj = JSON.parse('{"IdRol":"2"}');
            userData['Status'] = 'Revision';
        }
        jsonObj['IdUser'] = userData.Id;

        if (!vHelper.validateFormValues(frmUserData)) {
            $('.spinner').show();

            new Promise((resolve) => {
                //POST User.
                this.CTRL_Actions.PostToAPI(this.service, userData, () => { resolve(userData) });
            })
                .then(userData => {
                    //POST default Rol.
                    this.CTRL_Actions.PostToAPI(this.serviceRol, jsonObj, () => {

                        localStorage.setItem("CedCred", userData.Id);
                        localStorage.setItem("EmailCred", userData.Email);
                        localStorage.setItem("NameCred", userData.Name + " " + userData.LastName);

                        if (isClient == "yes") {
                            localStorage.setItem("userRedirection", "yes");
                            this.CreateVerification();

                        } else {

                            //SETUP for Registration Request.
                            $('.spinner').hide();
                            this.CTRL_Actions.ShowMessage('I', 'El usuario fue creado de manera correcta!');
                            this.CreateVerification();
                        }
                    });
                })
                .catch(error => {
                    $('.spinner').hide();
                    this.CTRL_Actions.ShowMessage('E', 'El usuario no pudo ser creado correctamente!');
                })

        } else {
            this.CTRL_Actions.ShowMessage('E', 'Por favor ingrese todos los campos y revise que la información sea valida!');
        }
        this.ReloadTable();
        localStorage.setItem("IsUserCreate", "no");
    }

    this.Update = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm('frmUserData');
        userData.Status = document.getElementById("sltStatus").value;
        console.log(userData);
        this.CTRL_Actions.PutToAPI(this.service, userData, () => {
            var vuser = new vUser();
            vuser.ReloadTable();
        });
    }

    this.UpdateRol = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm('frmUserData');
        userData.Status = document.getElementById("sltStatus").value;
        var preRol = localStorage.getItem("preRol").split(",");
        var postRol = $("#sltRol option:selected").text().split(",");
        var toDelete = $(preRol).not(postRol).get();
        var toCreate = $(postRol).not(preRol).get();

        toDelete.forEach(element => {
            var rolId = this.GetRol(element);
            var jsonObj = JSON.parse('{}');
            jsonObj['IdUser'] = userData['Id'];
            jsonObj['IdRol'] = rolId;

            this.CTRL_Actions.DeleteToAPI("UserxRol", jsonObj, () => {
                var vuser = new vUser();
                vuser.ReloadTable();
            });
        }
        );

        toCreate.forEach(element => {
            var rolId = this.GetRol(element);
            var jsonObj = JSON.parse('{}');
            jsonObj['IdUser'] = userData['Id'];
            jsonObj['IdRol'] = rolId;

            this.CTRL_Actions.PostToAPI("UserxRol", jsonObj, () => {
                var vuser = new vUser();
                vuser.ReloadTable();
            });
        }
        );

        this.CTRL_Actions.PutToAPI(this.service, userData, () => {
            var vuser = new vUser();
            vuser.ReloadTable();
        });
        document.getElementById("panel-users").classList.add("d-none");
    }

    this.Delete = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm('frmUserData');
        this.CTRL_Actions.DeleteToAPI(this.service, userData);
        this.ReloadTable();
    }

    this.GetRol = function (RolString) {
        var rolId;
        switch (RolString.toLowerCase().replace(/ /g, '')) {
            case "admin":
                rolId = 1;
                break;
            case "propietario":
                rolId = 2;
                break;
            case "cliente":
                rolId = 3;
                break;
            case "admin,propietario":
                rolId = 4;
                break;
            case "admin,cliente":
                rolId = 5;
                break;
            case "propietario,cliente":
                rolId = 6;
                break;
            default:
                rolId = 7;
        }
        return rolId;
    }

    this.BindFields = function (data) {
        this.UI_Helper.togglePanel('panel-users', 'panel-users-close');
        this.CTRL_Actions.BindFieldsImage('frmUserData', data);
        localStorage.setItem("preRol", data.Rol);
        document.getElementById("sltRol").value = this.GetRol(data.Rol);
        document.getElementById("txtId").readOnly = true;
        document.getElementById("txtElectronicWalletAmount").readOnly = true;
        document.getElementById("sltStatus").value = data.Status;
    }

    this.CreateVerification = function () {
        //Set default values for verification
        var userId = document.getElementById('txtId').value;
        var state = 'Inactivo';
        //We generate the verification code
        var codeEmail = Math.floor((Math.random() * 999999) + 1);
        var codePhone = Math.floor((Math.random() * 999999) + 1);
        //Build the JSON with all the data to create the verification and the sending of the verification code
        var JSONEmailVerification =
        {
            "userId": userId,
            "state": state,
            "code": codeEmail,
            "type": "correo"
        }
        var JSONPhoneVerification = {
            "userId": userId,
            "state": state,
            "code": codePhone,
            "type": "telefono"
        }
        //We send the JSON to the controller to create the verification
        this.CTRL_Actions.PostToAPI(this.serviceVerification, JSONEmailVerification, () => {
            //User's email address and name to send the verification code
            var email = document.getElementById('txtEmail').value;
            var name = document.getElementById('txtName').value;
            var JSONSendEmail = {
                "ToEmail": email,
                "Name": name,
                "Description": "Código de verificacion",
                "TextMesage": "Con el código " + codeEmail + " puedes activar la cuenta"
            }
            this.CTRL_Actions.PostToAPI(this.serviceEmail, JSONSendEmail, () => {
                localStorage.setItem("userId", userId);
                this.CTRL_Actions.PostToAPI(this.serviceVerification, JSONPhoneVerification, () => {
                    var phone = document.getElementById('txtPhoneNumber').value;
                    var JSONSendPhone = {
                        "DestinationNumber": "+506" + phone,
                        "BodyMessage": "Con el código " + codePhone + " puedes activar la cuenta"
                    }
                    this.CTRL_Actions.PostToAPI(this.servicePhone, JSONSendPhone, () => {
                        setTimeout(window.location = '/Home/vVerification', 17000);
                        //Save the user Id in the local storage
                        setItem("userId", userId);
                    });
                });
            });
        });
            //Save the user Id in the local storage
            setItem("userId", userId);
    }

    this.changeTitle = function () {
        if (localStorage.getItem("IsUserCreate") == "yes")
            document.getElementById("IdPUserCreate").innerHTML = "Ingrese sus Datos de Usuario Cliente:";
        else
            document.getElementById("IdPUserCreate").innerHTML = "Ingrese sus Datos de Usuario Propietario:";
    }

    this.GetFileName = function (fileName) {
        this.LS_Service.set_LS(`${this.variables.Images_URL}${fileName}`, this.variables.Images_LS);
    }
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vusers = new vUser();
    try {
        vusers.RetrieveAll();
    } catch {
        console.log("no table");
    }
    try {
        vusers.changeTitle();
    } catch {
        console.log("no form");
    }
});

