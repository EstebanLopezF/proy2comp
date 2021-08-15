function vRegistrationRequest() {
    this.LS_Service = new LocalStorage();
    this.UI_Helper = new UI_Helper();
    this.TBL_List_ID = 'TBL_RegistrationRequest_List';
    this.service = 'registrationrequest';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,IdProperty,IdUser,RegistrationDate,Status";
    this.variables = new Variables();

    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_List_ID, false);
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_List_ID, true);
    }

    this.BindFields = function (data) {
        this.UI_Helper.togglePanel('panel-RegistrationRequest', 'panel-RegistrationRequest-close');

        var promise1 = new Promise((resolve, reject) => {
            this.CTRL_Actions.GetByIdToApi("user", data.IdUser, (res) => { resolve(res) })
        });

        var promise2 = new Promise((resolve, reject) => {
            this.CTRL_Actions.GetByIdToApi("property", data.IdProperty, (res) => { resolve(res) })
        });

        var promise3 = new Promise(resolve => {
            this.CTRL_Actions.GetByIdToApi("subscription", data.IdUser, (res) => { resolve(res) })
        });

        Promise.all([promise1, promise2, promise3])
            .then(value => {
                data['UserId'] = value[0]['Id'];
                data['UserName'] = value[0]['Name'];
                data['UserLastName'] = value[0]['LastName'];
                data['UserEmail'] = value[0]['Email'];
                data['UserPhoneNumber'] = value[0]['PhoneNumber'];
                data['UserStatus'] = value[0]['Status'];
                data['UrlImage'] = value[0]['UrlImage'];

                data['PropertyID'] = value[1]['ID'];
                data['PropertyStatus'] = value[1]['Status'];
                data['PropertySize'] = value[1]['Size'];
                data['PropertyAvailableDays'] = value[1]['AvailableDays'];
                data['PropertyOpenTime'] = value[1]['OpenTime'];
                data['PropertyCloseTime'] = value[1]['CloseTime'];
                data['PropertyLocationDetails'] = value[1]['LocationDetails'];
                data['PropertyComission'] = value[1]['Comission'];
                data['PropertyLocation'] = value[1]['Location'];
                data['PropertyDocument_URL'] = value[1]['Document_URL'];

                data['SubscriptionAmmount'] = value[2]['Ammount'];

                if (data.Status === this.variables.RegRequestAproved) {
                    $("#btnApprove").prop("disabled", true);
                    $("#btnApprove").text("La solicitud ya esta aprobada");
                }

                this.CTRL_Actions.BindFieldsImage('frmRegistrationRequestData', data);
                console.log(data);

                this.LS_Service.set_LS(value[1], "propertyToModify");

                const coords = { lat: Number(data.PropertyLocation.split(',')[0]), lng: Number(data.PropertyLocation.split(',')[1]) },
                    map = createMap(coords),
                    marker = createMarker(coords, map);

                $("#btn-download").attr("href", data.PropertyDocument_URL);
                $("#btn-download").attr("download", data.PropertyDocument_URL);

                $("#btn-open").attr("href", data.PropertyDocument_URL);
                $("#btn-open").attr("target", "_blank");
            }).catch(reason => {
                console.log(reason);
            });
        $('#frmRegistrationRequestData :input').prop('readonly', true);
        document.getElementById("txtPropertyComission").readOnly = false;       
        document.getElementById("txtSubscriptionAmmount").readOnly = false;       
    }

    this.Approve = function () {
        var requestData = {};
        requestData = this.CTRL_Actions.GetDataForm('frmRegistrationRequestData');

        this.RegisterSubscriptionAmmount(requestData.UserId);
        const currentPropertyData = this.LS_Service.get_LS("propertyToModify");
        currentPropertyData["Comission"] = Number($("#txtPropertyComission").val());

        new Promise((resolve) => {
            //GET user data
            this.CTRL_Actions.GetByIdToApi("user", requestData.UserId, (res) => { resolve(res) });
        }).then(res => {
                res['Status'] = "PendientePago";
                new Promise((resolve) => {
                    //UPDATE user status
                    this.CTRL_Actions.PutToAPI("user", res, (res1) => { resolve(res1) });
                }).then(res1 => {
                    new Promise((resolve) => {
                         //GET registrationRequest data
                        this.CTRL_Actions.GetByIdToApi("registrationrequest", requestData.Id, (res2) => { resolve(res2) });
                    }).then(res2 => {
                        new Promise((resolve) => {
                            //UPDATE registrationRequest status
                            res2['Status'] = "Aprobada";
                            this.CTRL_Actions.PutToAPI("registrationrequest", res2, () => { resolve(res2) });

                            //Send notification email.
                            var emailJsonObj = JSON.parse('{}');
                            emailJsonObj['ToEmail'] = requestData['UserEmail'];
                            emailJsonObj['Name'] = requestData['UserName'] + " " + requestData['UserLastName'];
                            emailJsonObj['Description'] = "Aprobación de solicitud";
                            emailJsonObj['TextMesage'] = "Nos alegra informarle que su solicitud de ingreso a Work-Together fue aprobada.";
                            console.log(emailJsonObj);
                            this.CTRL_Actions.PostToAPI("email", emailJsonObj, () => {
                                //Send TEMP password on email.
                                this.CTRL_Actions.GetByIdToApi("password", document.getElementById("txtUserId").value, () => { });
                            });

                        })
                            .then(res3 => {
                                this.CTRL_Actions.PutToAPI("property", currentPropertyData, () => {
                                    this.CTRL_Actions.ShowMessage('I', 'Aprobacion realizada de manera correcta!');
                                    var vregistrationrequest = new vRegistrationRequest();
                                    vregistrationrequest.ReloadTable();
                                });
                            })
                    })
                })
            }).catch(error => {
                this.CTRL_Actions.ShowMessage('E', 'La aprobacion no pudo ser realizada de manera correcta!');
            })

        document.getElementById("panel-RegistrationRequest").classList.add("d-none");
    }

    this.RegisterSubscriptionAmmount = function (ID_Owner) {
        const request = {
            ID_Owner: ID_Owner,
            Ammount: $("#txtSubscriptionAmmount").val()
        }

        $.post(`https://localhost:44346/api/subscription`, request)
            .done(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    }
}

$(document).ready(function () {
    var vregistrationrequest = new vRegistrationRequest();
    vregistrationrequest.RetrieveAll();
});

