function vProperties() {
    this.sessionInspector = new SessionInspector();
    this.UI_Helper = new UI_Helper();
    this.vHelper = new ValidationHelper();
    this.variables = new Variables();
    this.sessionService = new SessionStorage();
    this.LS_Service = new LocalStorage();
    this.tblPropertiesId = 'TBL_Properties';
    this.service = 'property';
    this.ctrlActions = new ControlActions();
    this.columns = "ID,ID_Owner,Location,LocationDetails,OpenTime,CloseTime,AvailableDays,Comission,Status,Size";

    this.GetFileName = function (fileName) {
        this.LS_Service.set_LS(`${this.variables.Files_URL}${fileName}`, this.variables.Files_LS);
    }

    this.Create = function () {
        const propertiesData = this.ctrlActions.GetDataForm('frmPropertyData');
        propertiesData['Location'] = this.LS_Service.get_LS('ubicacion_actual');
        propertiesData['Comission'] = 0;
        propertiesData['Status'] = this.variables.PropReview;
        propertiesData['Document_URL'] = this.LS_Service.get_LS(this.variables.Files_LS);
        propertiesData['ID_Owner'] = this.sessionService.GetSessionStorage();
        propertiesData["OpenTime"] = document.getElementById("lstAvailableOpenHours").value;
        propertiesData["CloseTime"] = document.getElementById("lstAvailableCloseHours").value;
        propertiesData["AvailableDays"] = this.LS_Service.get_LS("selectedDays").toString();
        this.LS_Service.clean_LS("selectedDays");

        if (propertiesData['ID_Owner'] == null)
            propertiesData['ID_Owner'] = localStorage.getItem("CedCred");

        this.LS_Service.clean_LS();

        if (!this.vHelper.validateFormValues(frmPropertyData)) {
            $('.spinner').show();

            //POST Property
            this.ctrlActions.PostToAPI(this.service, propertiesData, () => {
                $('.spinner').hide();
                if (this.sessionService.GetSessionStorage() == null) {
                    $('#divButtons').hide();
                    var cedUser = localStorage.getItem("CedCred");
                    new Promise((resolve) => {

                        //GET Property id.
                        this.ctrlActions.GetByIdToApi("propertyxuser", cedUser, (res) => { resolve(res) });
                    })
                        .then(res => {

                            //POST Registration Request.
                            var d = new Date();
                            d = new Date(d.getTime() - 3000000);
                            var currentDate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
                            var regReqData = JSON.parse('{}');
                            regReqData['IdProperty'] = res['ID'];
                            regReqData['IdUser'] = localStorage.getItem("CedCred");
                            regReqData['RegistrationDate'] = currentDate;
                            regReqData['Status'] = "Pendiente";
                            this.ctrlActions.PostToAPI("registrationrequest", regReqData, () => {

                                //POST notification email. 
                                var emailJsonObj = JSON.parse('{}');
                                emailJsonObj['ToEmail'] = localStorage.getItem("EmailCred");
                                emailJsonObj['Name'] = localStorage.getItem("NameCred");
                                emailJsonObj['Description'] = "Envío de Solicitud de Registro";
                                emailJsonObj['TextMesage'] = " La solicitud fue registrada exitosamente, nuestros administradores le estarán contactando.";
                                this.ctrlActions.PostToAPI("email", emailJsonObj, () => {



                                    new Promise((resolve) => {

                                        //Create subscription
                                        var SubsData = JSON.parse('{}');
                                        SubsData['Ammount'] = 5000;
                                        SubsData['ID_Owner'] = localStorage.getItem("userId");
                                        this.ctrlActions.PostToAPI("subscription", SubsData, () => { resolve() })
                                    })
                                        .then(() => {

                                            new Promise((resolve) => {

                                                //GET Admins
                                                this.ctrlActions.GetByIdToApi("userxrol", "1", (res) => { resolve(res) });
                                            })
                                                .then(res => {

                                                    //POST email to all Admins
                                                    res.forEach(element => {

                                                        var emailAdminJsonObj = JSON.parse('{}');
                                                        emailAdminJsonObj['ToEmail'] = element.Email;
                                                        emailAdminJsonObj['Name'] = " Administrador " + element.Name + " " + element.LastName;
                                                        emailAdminJsonObj['Description'] = "Nueva Solicitud de Registro";
                                                        emailAdminJsonObj['TextMesage'] = "Una nueva solicitud de registro fue recibida a nombre de: " + localStorage.getItem("CedCred") + " | " + localStorage.getItem("NameCred");
                                                        this.ctrlActions.PostToAPI("email", emailAdminJsonObj, () => { });
                                                    });
                                                    this.ctrlActions.ShowMessage('I', 'La solicitud fue registrada correctamente, nuestros administradores le estarán contactando!');
                                                    setTimeout(window.location = '/Home/Index', 30000);
                                                
                                        });
                                
                            });
                        });
                });

            const Files_URL = this.LS_Service.get(this.variables.Files_LS);
            console.log(Files_URL);
        })
                        .catch (error => {
            $('.spinner').hide();
            this.ctrlActions.ShowMessage('E', 'La solicitud de registro no pudo ser procesada correctamente, nuestros administradores le estarán contactando!');
        })
    }
                else {
        $('.spinner').hide();
        setTimeout(window.location = '/Home/vListProperties', 10000);
    }
});
        } else {
    this.ctrlActions.ShowMessage('E', 'Por favor, ingrese todos los valores !');
}
    }

this.RetrieveAll = function () {
    this.ctrlActions.FillTable(this.service, this.tblPropertiesId, false);
}

this.processUserAccess = function () {
    const accessRoles = this.sessionInspector.ValidateAccess();

    /*if (accessRoles == this.variables.FullAcess) {
        $("#txtOpenTime").prop("disabled", true);
        $("#txAvailableDays").prop("disabled", true);
        $("#txCloseTime").prop("disabled", true);
        $("#txSize").prop("disabled", true);
        $("#txCloseTime").prop("disabled", true);
        $("#txDetails").prop("disabled", true);

        $("#sltPropertyStatus").prop("disabled", false);
    } else if (accessRoles == this.variables.PartialAccess) {*/
    $("#txtOpenTime").prop("disabled", false);
    $("#txAvailableDays").prop("disabled", false);
    $("#txCloseTime").prop("disabled", false);
    $("#txSize").prop("disabled", false);
    $("#txCloseTime").prop("disabled", false);
    $("#txDetails").prop("disabled", false);

    /*$("#sltPropertyStatus").prop("disabled", true);
} else if (accessRoles == this.variables.NoAccess) {
    $("#txtOpenTime").prop("disabled", true);
    $("#txAvailableDays").prop("disabled", true);
    $("#txCloseTime").prop("disabled", true);
    $("#txSize").prop("disabled", true);
    $("#txCloseTime").prop("disabled", true);
    $("#txDetails").prop("disabled", true);

    $("#sltPropertyStatus").prop("disabled", true);

    $("#btnDelete").prop("disabled", true);
    $("#btnUpdate").prop("disabled", true);
}*/
}

this.ReloadTable = function () {
    this.ctrlActions.FillTable(this.service, this.tblPropertiesId, true);
}

this.BindFields = function (data) {
    if (this.sessionService.GetSessionStorage() != data.ID_Owner) {
        $("#txtId").prop("disabled", true);
        $("#txtOpenTime").prop("disabled", true);
        $("#txAvailableDays").prop("disabled", true);
        $("#txCloseTime").prop("disabled", true);
        $("#txSize").prop("disabled", true);
        $("#txCloseTime").prop("disabled", true);
        $("#txDetails").prop("disabled", true);

        $("#sltPropertyStatus").prop("disabled", true);
        /*            $("#btnDelete").prop("disabled", true);
                    $("#btnUpdate").prop("disabled", true);*/
    } else {
        $("#txtOpenTime").prop("disabled", false);
        $("#txAvailableDays").prop("disabled", false);
        $("#txCloseTime").prop("disabled", false);
        $("#txSize").prop("disabled", false);
        $("#txCloseTime").prop("disabled", false);
        $("#txDetails").prop("disabled", false);
    }

    this.UI_Helper.togglePanel('panel-propiedad', 'panel-propiedad-cerrar');

    this.LS_Service.set_LS(data, 'property');
    this.ctrlActions.BindFields('frmPropertyData', data);

    const coords = { lat: Number(data.Location.split(',')[0]), lng: Number(data.Location.split(',')[1]) },
        map = createMap(coords),
        marker = createMarker(coords, map);

    $("#btn-download").attr("href", data.Document_URL);
    $("#btn-download").attr("download", data.Document_URL);

    $("#btn-open").attr("href", data.Document_URL);
    $("#btn-open").attr("target", "_blank");

    document.getElementById("sltPropertyStatus").value = data.Status;
}

this.Update = function () {
    const propertyData = this.ctrlActions.GetDataForm('frmPropertyData'),
        defaultData = this.LS_Service.get_LS('property');

    propertyData['ID'] = defaultData.ID;
    propertyData['ID_Owner'] = defaultData.ID_Owner;
    propertyData['Location'] = defaultData.Location;
    propertyData['Document_URL'] = defaultData.Document_URL;

    propertyData['Status'] = document.getElementById("sltPropertyStatus").value;

    if (!this.vHelper.validateFormValues(frmPropertyData)) {
        $('.spinner').show();
        this.ctrlActions.PutToAPI(this.service, propertyData, () => {
            var vproperty = new vProperties();
            vproperty.ReloadTable();
            $('.spinner').hide();
        });
    } else {
        this.ctrlActions.ShowMessage('E', 'Por favor, ingrese todos los valores !');
    }
}

this.Delete = function () {
    const defaultData = this.LS_Service.get_LS('property'),
        propertyData = { ID: defaultData.ID }

    this.ctrlActions.DeleteToAPI(this.service, propertyData, () => {
        var vproperties = new vProperties();
        vproperties.ReloadTable();
    });
}
}

$(document).ready(function () {
    var vproperties = new vProperties();
    vproperties.processUserAccess();

    if (window.location.pathname.split("/")[2] === "vListProperties") {
        vproperties.RetrieveAll();
    }

    // set the open and close hour range
    const startOpenTime = new Date(),
        startCloseTime = new Date(),
        endOpenTime = new Date(),
        endCloseTime = new Date();

    startOpenTime.setHours(00, 0, 0, 0);
    startCloseTime.setHours(00, 0, 0, 0);

    endOpenTime.setHours(23, 0, 0, 0);
    endCloseTime.setHours(23, 0, 0, 0);

    vproperties.LS_Service.set_LS(`${startOpenTime}/${endOpenTime}`, "PropertyOpenTimeKey");
    vproperties.LS_Service.set_LS(`${startCloseTime}/${endCloseTime}`, "PropertyCloseTimeKey");

    // set the default available days to show
    vproperties.LS_Service.set_LS("LMKJVSD", "availableDays");
});
