function vRefound() {

    this.UI_Helper = new UI_Helper();
    this.TBL_Users_List_ID = 'TBL_Refound_List';
    this.defaultService = 'cancelledreservationsxuser';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,State,ID_Owner,User_Name,IdWorkspace,Workspace_Name,Price";
    this.applicationRepresentant = 304870951;
    this.variables = new Variables();
    this.LS_Service = new LocalStorage();

    this.RetrieveAll = function () {

        var id = sessionStorage.getItem('usuarioActivo');

        this.CTRL_Actions.FillTableCancelations(this.defaultService, id, this.TBL_Users_List_ID, false);

        document.getElementById("txtPorcentage").value = "100";
        document.getElementById("txtPorcentage").readOnly = true;
        document.getElementById("txtAmount").readOnly = true;
        document.getElementById("txtAmountInitial").readOnly = true;
        document.getElementById("txtValueSan1").value = "₡0";
        document.getElementById("txtValueSan1").readOnly = true;
        document.getElementById("perSanc1").value = 0;
        document.getElementById("txtValueSan2").value = "₡";
        document.getElementById("txtValueSan2").readOnly = true;
        document.getElementById("perSanc2").value = 0;
    }

    this.ReloadTable = function () {

        var id = sessionStorage.getItem('usuarioActivo');

        this.CTRL_Actions.FillTableCancelations(this.defaultService, id, this.TBL_Users_List_ID, true);

        document.getElementById("txtPorcentage").value = "100";
        document.getElementById("txtPorcentage").readOnly = true;
        document.getElementById("txtAmount").readOnly = true;
        document.getElementById("txtAmountInitial").readOnly = true;
        document.getElementById("txtValueSan1").value = "₡0";
        document.getElementById("txtValueSan1").readOnly = true;
        document.getElementById("perSanc1").value = 0;
        document.getElementById("txtValueSan2").value = "₡";
        document.getElementById("txtValueSan2").readOnly = true;
        document.getElementById("perSanc2").value = 0;
    }

    this.ProceedRefound = function () {

        $('.spinner').show();
        new Promise((resolve) => {

            //1 Create Refound
            var refoundData = JSON.parse('{}');
            refoundData['Status'] = "Pagado";
            refoundData['Amount'] = parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""));
            refoundData['Reservation_Id'] = localStorage.getItem('RequestIdValue');
            this.CTRL_Actions.PostToAPI("refound", refoundData, () => { resolve() });

        }).then(() => {

            //2 Create sanctions.
            var checkbox = document.getElementById('selectNumber');
            var selected = checkbox.options[checkbox.selectedIndex].value;

            if (selected == "1") {

                var refoundData = JSON.parse('{}');
                refoundData['Status'] = "Aplicada";
                refoundData['Detail'] = document.getElementById('txtDetailSan1').value;
                refoundData['Reservation_Id'] = localStorage.getItem("RequestIdValue");
                refoundData['Percentage'] = document.getElementById('perSanc1').value;
                this.CTRL_Actions.PostToAPI("sanction", refoundData, () => { });

            } else if (selected == "2") {

                var refoundData1 = JSON.parse('{}');
                refoundData1['Status'] = "Aplicada";
                refoundData1['Detail'] = document.getElementById('txtDetailSan1').value;
                refoundData1['Reservation_Id'] = localStorage.getItem("RequestIdValue");
                refoundData1['Percentage'] = document.getElementById('perSanc1').value;
                this.CTRL_Actions.PostToAPI("sanction", refoundData1, () => { });

                var refoundData = JSON.parse('{}');
                refoundData['Status'] = "Aplicada";
                refoundData['Detail'] = document.getElementById('txtDetailSan2').value;
                refoundData['Reservation_Id'] = localStorage.getItem("RequestIdValue");
                refoundData['Percentage'] = document.getElementById('perSanc2').value;
                this.CTRL_Actions.PostToAPI("sanction", refoundData, () => { });
            }

            new Promise((resolve) => {

                //Create Bill
                var billJsonObj = JSON.parse('{}');
                var d = new Date();
                d = new Date(d.getTime() - 3000000);
                var currentDate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
                billJsonObj['Description'] = "Reembolso de dinero por cancelación de suscripción";
                billJsonObj['Timestamp'] = currentDate;
                billJsonObj['SubTotal'] = parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""));
                billJsonObj['Total'] = Math.round(parseInt(parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""))) * 1.13);
                billJsonObj['Type'] = "Reembolso";
                billJsonObj['UserReceptorId'] = localStorage.getItem('userIdClientDataId');
                billJsonObj['UserRemitentId'] = this.applicationRepresentant;
                billJsonObj['Status'] = "Pagado";
                this.CTRL_Actions.PostToAPI("bill", billJsonObj, () => { resolve() });

            }).then(() => {
                new Promise((resolve) => {

                    //GET USER
                    this.CTRL_Actions.GetByIdToApi("user", localStorage.getItem('userIdClientDataId'), (res) => { resolve(res) });
                }).then(res => {

                    //POST USER
                    localStorage.setItem('CustomerEmailPass', res.Email);
                    localStorage.setItem('CustomerNamePass', res.Name + " " + res.LastName);
                    res['ElectronicWalletAmount'] = parseInt(res['ElectronicWalletAmount']) + parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""));
                    new Promise((resolve) => {
                        this.CTRL_Actions.PutToAPI("user", res, () => { resolve() });
                    }).then(() => {

                        new Promise((resolve) => {
                            this.CTRL_Actions.GetByIdToApi("reservationid", localStorage.getItem('RequestIdValue'), (res2) => { resolve(res2) });
                        }).then(res2 => {

                            res2.State = 'Cancelada';
                            this.CTRL_Actions.PutToAPI("reservation", res2, () => {

                                //8. POST EMAIL.
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var emailJsonObj = JSON.parse('{}');

                                emailJsonObj['ToEmail'] = localStorage.getItem('CustomerEmailPass');
                                emailJsonObj['BillNumber'] = Math.floor(Math.random() * 11) + 5;
                                emailJsonObj['ClientName'] = localStorage.getItem('CustomerNamePass');
                                emailJsonObj['Date'] = date;
                                emailJsonObj['Detail'] = "Reembolso por cancelación de suscripción: " + localStorage.getItem('RequestIdValue');
                                emailJsonObj['Price'] = parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""));
                                emailJsonObj['SubTotal'] = parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""));
                                emailJsonObj['Iva'] = Math.round(parseInt(parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""))) * 0.13);
                                emailJsonObj['Total'] = Math.round(parseInt(parseInt(document.getElementById('txtAmount').value.replace('.', "").replace('₡', ""))) * 1.13);

                                this.CTRL_Actions.PostToAPI("emailbill", emailJsonObj, () => {
                                    $("#panel-Refound").addClass('d-none');
                                    this.CTRL_Actions.ShowMessage('I', 'El reembolso fue realizado de manera exitosa!');
                                    $('.spinner').hide();
                                    var vrefounds = new vRefound();
                                    vrefounds.ReloadTable();
                                });
                            });
                        })
                    })
                })
            })
        }).catch(error => {
            $('.spinner').hide();
            console.log(error);
            this.CTRL_Actions.ShowMessage('E', 'El Reembolso no pudo realizarse de manera exitosa!');
        })
    }

    this.BindFields = function (data) {

        if (data.State.toLowerCase() != "cancelada") {

            this.UI_Helper.togglePanel('panel-Refound', 'panel-users-close');
            document.getElementById("selectNumber").readOnly = false;
            document.getElementById("selectNumber").disabled = false;
            document.getElementById("perSanc1").readOnly = false;
            document.getElementById("perSanc2").readOnly = false;
            document.getElementById("txtDetailSan1").readOnly = false;
            document.getElementById("txtDetailSan2").readOnly = false;
            document.getElementById("selectNumber").value = 0;
            refoundSac();

            if (data.State.toLowerCase() == "cancelada") {
                $("#btnRefound").addClass('d-none');
            } else {
                $("#btnRefound").removeClass('d-none');
            }

            localStorage.setItem("RequestIdValue", data.Id);
            localStorage.setItem("userIdClientDataId", data.ID_Owner);
            document.getElementById("txtAmount").value = "₡" + data.Price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); //put money char
            document.getElementById("txtAmountInitial").value = "₡" + data.Price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        } else {
            //what to do with cancceled.
            document.getElementById("selectNumber").readOnly = true;
            document.getElementById("selectNumber").disabled = true;
            document.getElementById("perSanc1").readOnly = true;
            document.getElementById("perSanc2").readOnly = true;
            document.getElementById("txtDetailSan1").readOnly = true;
            document.getElementById("txtDetailSan2").readOnly = true;

            this.UI_Helper.togglePanel('panel-Refound', 'panel-users-close');
            $("#btnRefound").addClass('d-none');

            var promise1 = new Promise((resolve, reject) => {
                this.CTRL_Actions.GetByIdToApi("refoundxreservation", data.Id, (res1) => { resolve(res1) });
            });

            var promise2 = new Promise((resolve, reject) => {
                this.CTRL_Actions.GetByIdToApi("sanctionxreservation", data.Id, (res2) => { resolve(res2) });
            });

            Promise.all([promise1, promise2])
                .then(value => {

                    document.getElementById('txtAmount').value = "₡" + value[0][0].Amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                    document.getElementById('txtAmountInitial').value = "₡" + value[0][0].Amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                    console.log(value[1].length)

                    if (value[1].length == 1) {
                        document.getElementById("selectNumber").value = 1;
                        refoundSac();
                        var mon1 = Math.round((parseInt(value[1][0].Percentage) / 100) * parseInt(value[0][0].Amount));
                        var rem = parseInt(value[0][0].Amount - mon1);

                        document.getElementById("txtAmount").value = "₡" + rem.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("perSanc1").value = parseInt(value[1][0].Percentage);
                        document.getElementById("txtDetailSan1").value = value[1][0].Detail;
                        document.getElementById("txtValueSan1").value = "₡" + mon1.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                    } else if (value[1].length >= 2) {
                        document.getElementById("selectNumber").value = 2;
                        refoundSac();

                        var mon1 = Math.round((parseInt(value[1][0].Percentage) / 100) * parseInt(value[0][0].Amount));
                        var mon2 = Math.round((parseInt(value[1][1].Percentage) / 100) * parseInt(value[0][0].Amount));
                        var rem = parseInt((value[0][0].Amount - mon1) - mon2);

                        document.getElementById("txtAmount").value = "₡" + rem.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("perSanc1").value = parseInt(value[1][0].Percentage);
                        document.getElementById("txtDetailSan1").value = value[1][0].Detail;
                        document.getElementById("txtValueSan1").value = "₡" + mon1.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("perSanc2").value = parseInt(value[1][1].Percentage);
                        document.getElementById("txtDetailSan2").value = value[1][1].Detail;
                        document.getElementById("txtValueSan2").value = "₡" + mon2.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                    }
                })
        }
    }
}

function refoundSac() {

    var checkbox = document.getElementById('selectNumber');
    var selected = checkbox.options[checkbox.selectedIndex].value;
    if (selected == "0") {
        $("#panel-Sanc1").addClass('d-none');
        $("#panel-Sanc2").addClass('d-none');
        Change1Form();
    } else if (selected == "1") {
        $("#panel-Sanc1").removeClass('d-none');
        $("#panel-Sanc2").addClass('d-none');
        Change1Form();
    } else {
        $("#panel-Sanc1").removeClass('d-none');
        $("#panel-Sanc2").removeClass('d-none');
        Change1Form();
    }
}

function Change1Form() {

    var checkbox = document.getElementById('selectNumber');
    var selected = checkbox.options[checkbox.selectedIndex].value;
    var iniciatl = document.getElementById("txtAmountInitial");
    var initialValue = parseInt(document.getElementById("txtAmountInitial").value.replace('.', "").replace('₡', ""));
    var perSanc1 = document.getElementById('perSanc1');
    var perSanc2 = document.getElementById('perSanc2');
    var txtValueSan1 = document.getElementById('txtValueSan1');
    var txtValueSan2 = document.getElementById('txtValueSan2');
    var txtValueSan1 = document.getElementById('txtValueSan1');
    var txtAmount = document.getElementById('txtAmount');
    var txtPorcentage = document.getElementById("txtPorcentage");

    if (selected == "1") {
        txtValueSan1.value = "₡" + Math.round(((initialValue / 100) * parseInt(perSanc1.value))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtAmount.value = "₡" + (Math.round((initialValue - parseInt(txtValueSan1.value.replace('.', "").replace('₡', ""))))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtPorcentage.value = 100 - perSanc1.value;
    } else if (selected == "2") {
        txtValueSan1.value = "₡" + Math.round(((initialValue / 100) * parseInt(perSanc1.value))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtValueSan2.value = "₡" + Math.round(((initialValue / 100) * parseInt(perSanc2.value))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtAmount.value = "₡" + (Math.round(((initialValue - parseInt(txtValueSan1.value.replace('.', "").replace('₡', ""))) - parseInt(txtValueSan2.value.replace('.', "").replace('₡', ""))))).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtPorcentage.value = (100 - perSanc1.value) - perSanc2.value;
    } else {
        txtValueSan1.value = "₡0";
        txtValueSan2.value = "₡0";
        txtAmount.value = "₡" + initialValue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        txtPorcentage.value = 100;
    }
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vrefound = new vRefound();
    vrefound.RetrieveAll();

});

