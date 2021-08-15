function vReservation() {
    this.TBL_Reservation_List_ID = 'TBL_Reservation_List';
    this.columns = 'Id, IdWorkspace, ID_Owner, RatingWorkspace, RatingOwner, RatingCustomer, QR_Code, QR_URL, CodeTime';
    this.service = 'reservation';
    this.CTRL_Actions = new ControlActions();
    this.UI_Helper = new UI_Helper();
    this.columnsTimeReserve = 'TimeEntry, ExitTime, Reservation_Id'
    this.applicationRepresentant = 304870951;
    this.vHelper = new ValidationHelper();


    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_Reservation_List_ID, false);
    }

    this.BindFields = function (data) {
        this.UI_Helper.togglePanel('panel-reservation', 'panel-reservation-close');
        this.CTRL_Actions.BindFieldsImage('frmReservationData', data);
        try { document.getElementById("sltState").value = data.State; } catch { };
    }

    this.Create = function () {
        var reservationData = JSON.parse('{}')
        //Set default values 
        reservationData['IdWorkspace'] = localStorage.getItem('workspaceId');
        reservationData['ID_Owner'] = sessionStorage.getItem('usuarioActivo');
        reservationData['State'] = 'Pendiente';
        reservationData['RatingWorkspace'] = 0;
        reservationData['RatingOwner'] = 0;
        reservationData['RatingCustomer'] = 0;
        reservationData['QR_Code'] = "212";
        reservationData['QR_URL'] = "sdfghakhfk";
        var codeTime = Math.floor((Math.random() * 999999) + 1);
        reservationData['CodeTime'] = codeTime;

        this.CTRL_Actions.PostToAPI(this.service, reservationData, () => {
            var timeReservationData = JSON.parse('{}')
            timeReservationData['TimeEntry'] = localStorage.getItem('openTime');
            timeReservationData['ExitTime'] = localStorage.getItem('closeTime');
            timeReservationData['CodeTime'] = codeTime;
            this.CTRL_Actions.PostToAPI('timereserve', timeReservationData, () => {

            });
        });
    }


    this.ReloadTable = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_Reservation_List_ID, true);
    }

    this.Field = function () {
        var propertyId = localStorage.getItem('propertyId');
        new Promise((resolve) => {
            this.CTRL_Actions.GetByIdToApi("property", propertyId, (res) => { resolve(res) });
        })
            .then(res => {
                document.getElementById('txtOpenTime').value = res.OpenTime;
                document.getElementById('txtOpenTime').readOnly = true;
                document.getElementById('txtDaysAvailable').value = res.AvailableDays;
                document.getElementById('txtDaysAvailable').readOnly = true;
                document.getElementById('txtCloseTime').value = res.CloseTime;
                document.getElementById('txtCloseTime').readOnly = true;

                localStorage.setItem('openTime', res.OpenTime);
                localStorage.setItem('closeTime', res.CloseTime);

            })
            .catch(error => {
                console.log("Error en cargar los datos");
            })
    }
    this.PayPalButton = function () {

        //var price = ((parseInt(localStorage.getItem("defaultPrice")) * 1.13) / this.dollarPrice).toFixed(2).toString();
        price = 5;

        paypal.Button.render({
            env: 'sandbox',
            client: {
                sandbox: 'AY1A6s8mhBXACaR1E93Ttm3w2LzAvn8yzGjT17VgGNArirTm_Ty5oig5WgWUGyRsSnl_IS46ed91bJZ2'
            },
            locale: 'es_ES',
            style: {
                size: 'medium',
                color: 'gold',
                shape: 'pill',
            },
            commit: true,
            payment: function (data, actions) {

                return actions.payment.create({
                    transactions: [{
                        amount: {
                            total: price,
                            currency: 'USD'
                        },
                        description: 'Pago de reservación.'
                    }]
                });
            },
            onAuthorize: function (data, actions) {
                return actions.payment.execute().then(function () {
                    var vreservation = new vReservation();
                    vreservation.Pay();
                });
            }
        }, '#paypal-button');
    }


    this.Pay = function () {

        //provitional prices
        var comitionPrice = 250;
        var clientPrice = 3250;

        var PayMentMethodSelected = document.getElementById("txtPaymentMethod").value;

        if ((!this.vHelper.validateFormValues(frmPayData) && (PayMentMethodSelected == "SINPE")) || (PayMentMethodSelected == "PAYPAL")) {
            $('.spinner').show();

            new Promise((resolve) => {
                // 0 - GET USER
                this.CTRL_Actions.GetByIdToApi("property", localStorage.getItem("reservationPropertyId"), (re) => { resolve(re) });

            }).then(re => {

                // 1 - GET USER
                localStorage.setItem("Id_Owner_Payment", re.ID_Owner);
                new Promise((resolve) => {
                    this.CTRL_Actions.GetByIdToApi("user", sessionStorage.getItem('usuarioActivo'), (res) => { resolve(res) });
                }).then(res => {

                    new Promise((resolve) => {

                        //2- POST BILL
                        var billJsonObj = JSON.parse('{}');
                        var d = new Date();
                        d = new Date(d.getTime() - 3000000);
                        var currentDate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";
                        localStorage.setItem('EmailPayClient', res.Email);
                        localStorage.setItem('NamePayClient', res.Name + " " + res.LastName);

                        billJsonObj['Description'] = "Pago de reservación";
                        billJsonObj['Timestamp'] = currentDate;
                        billJsonObj['SubTotal'] = clientPrice;
                        billJsonObj['Total'] = Math.round(clientPrice * 1.13);
                        billJsonObj['Type'] = "Reservación";
                        billJsonObj['UserReceptorId'] = sessionStorage.getItem('usuarioActivo');
                        billJsonObj['UserRemitentId'] = localStorage.getItem("Id_Owner_Payment");
                        billJsonObj['Status'] = "Pagado";

                        this.CTRL_Actions.PostToAPI("bill", billJsonObj, () => { resolve() });

                    }).then(() => {

                        //POST SMS message/optional
                        if (PayMentMethodSelected == "SINPE") {

                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                            var dateTime = date + ' ' + time;

                            var JSONSendPhone = {
                                "DestinationNumber": "+506" + document.getElementById("txtPhoneNumberPY").value,
                                "BodyMessage": "BCR le informa que se debito de su cuenta de ahorro, la suma de "
                                    + clientPrice.toString() + " colones por transferencia SINPE realizada, el dia " + dateTime + "."
                            }
                            this.CTRL_Actions.PostToAPI("sms", JSONSendPhone, () => { });
                        }

                        new Promise((resolve) => {
                            //3- POST EMAIL
                            var today = new Date();
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            var emailJsonObj = JSON.parse('{}');

                            emailJsonObj['ToEmail'] = localStorage.getItem("EmailPayClient");
                            emailJsonObj['BillNumber'] = Math.random() * (10 - 20) + 10;;
                            emailJsonObj['ClientName'] = localStorage.getItem("NamePayClient");
                            emailJsonObj['Date'] = date;
                            emailJsonObj['Detail'] = "Pago de reservación";
                            emailJsonObj['Price'] = clientPrice;
                            emailJsonObj['SubTotal'] = clientPrice;
                            emailJsonObj['Iva'] = Math.round(clientPrice * 0.13);
                            emailJsonObj['Total'] = Math.round(clientPrice * 1.13);

                            this.CTRL_Actions.PostToAPI("emailbill", emailJsonObj, () => { resolve() });

                        }).then(() => {

                            new Promise((resolve) => {
                                //6 - POST BILL
                                var billJsonObj = JSON.parse('{}');
                                var d = new Date();
                                d = new Date(d.getTime() - 3000000);
                                var currentDate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";

                                billJsonObj['Description'] = "Pago de comisión por reservación";
                                billJsonObj['Timestamp'] = currentDate;
                                billJsonObj['SubTotal'] = comitionPrice;
                                billJsonObj['Total'] = Math.round(comitionPrice * 1.13);
                                billJsonObj['Type'] = "Comisión";
                                billJsonObj['UserReceptorId'] = this.applicationRepresentant;
                                billJsonObj['UserRemitentId'] = localStorage.getItem("Id_Owner_Payment");
                                billJsonObj['Status'] = "Pagado";

                                this.CTRL_Actions.PostToAPI("bill", billJsonObj, () => { resolve() });

                            }).then(() => {

                                $("#PayPalDivContent").addClass('d-none');
                                $("#ContentPhoneNumber").addClass('d-none');
                                document.getElementById("txtPaymentMethod").disabled = true;
                                document.getElementById("BTN_Create").style.background = '#eb5d1e';
                                document.getElementById("BTN_Create").disabled = false;
                                this.CTRL_Actions.ShowMessage('I', 'Pago realizado de manera correcta!');
                                $('.spinner').hide();

                            })
                        })
                    })
                })
            }).catch(error => {
                this.CTRL_Actions.ShowMessage('E', 'La aprobacion no pudo ser realizada de manera correcta!');
                $('.spinner').hide();
            })
        } else {
            this.CTRL_Actions.ShowMessage('E', 'Por favor, ingrese un número de cuenta!');
        }
    }

    this.ChangePaymentMethod = function () {
        console.log("HERE");
        var valueSelected = document.getElementById("txtPaymentMethod").value;
        //document.getElementById("txtPhoneNumberPY").value = document.getElementById("txtPhoneNumber").value;
        if (valueSelected == "SINPE") {
            $("#PayPalDivContent").addClass('d-none');
            $("#ContentPhoneNumber").removeClass('d-none');
            $("#ContentPayButton").removeClass('d-none');
        } else {
            $("#PayPalDivContent").removeClass('d-none');
            $("#ContentPhoneNumber").addClass('d-none');
            $("#ContentPayButton").addClass('d-none');
        }
    }

    this.setupPayment = function () {
        //Payment Buttons
        document.getElementById("txtAmount").value = "₡ 5.000";
        document.getElementById("txtPhoneNumberPY").value = "87343533";
        document.getElementById("txtPaymentMethod").defaultValue = "PAYPAL";
        $("#ContentPayButton").addClass('d-none');
        $("#ContentPhoneNumber").addClass('d-none');
        $('#txtAmount').prop('readonly', true);
        document.getElementById("BTN_Create").disabled = true;
        document.getElementById("BTN_Create").style.background = '#787878';
        $("#ContentPayButton").addClass('d-none');
    }

}

//ON DOCUMENT READY
$(document).ready(function () {
    var vreservation = new vReservation();
    try {
        vreservation.RetrieveAll();
    } catch {
        console.log("No table");
    }
    vreservation.Field();
    $('#txtIdWorkspace').val(localStorage.getItem('workspaceId'));
    $('#txtWorkspaceName').val(localStorage.getItem('workspaceName'));
    $('#txtRentalPrice').val(localStorage.getItem('rentalPrice'));

    document.getElementById('txtIdWorkspace').readOnly = true;
    document.getElementById('txtWorkspaceName').readOnly = true;
    document.getElementById('txtRentalPrice').readOnly = true;

    if (location.pathname.split("/")[2] == "vRegisterReservation") {
        document.getElementById('txtIdWorkspace').readOnly = true;
        document.getElementById('txtWorkspaceName').readOnly = true;
        vreservation.PayPalButton();
        vreservation.setupPayment();
        $("#txtPaymentMethod").change(function () {
            vreservation.ChangePaymentMethod();
        });
    }
});