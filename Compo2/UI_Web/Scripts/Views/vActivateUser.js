function vActivateUser() {

    this.service = 'user';
    this.serviceGetProperty = 'propertyxuser';
    this.CTRL_Actions = new ControlActions();
    this.UI_Helper = new UI_Helper();
    this.vHelper = new ValidationHelper();
    this.dollarPrice = 600;
    this.applicationRepresentant = 304870951;
    this.subMessage = "Pago de suscripción"

    this.RetrieveID = function () {
        var id = sessionStorage.getItem('usuarioActivo');
        this.CTRL_Actions.FillTableId(this.service, id);

        this.CTRL_Actions.FillTableId(this.serviceGetProperty, id);

        new Promise((resolve) => {
            this.CTRL_Actions.GetByIdToApi("subscription", id, (res) => { resolve(res) });
        }).then(res => {
            //assign value of res
            localStorage.setItem("defaultPrice", res.Ammount);
            document.getElementById("txtAmount").value = "₡" + Math.round(res.Ammount * 1.13).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }).catch(error => {
            document.getElementById("txtAmount").value = "5650";
        })

        document.getElementById("txtPaymentMethod").defaultValue = "PAYPAL";
        document.getElementById("txtAmount").readOnly = true;
        $('#frmUserData :input').prop('readonly', true);
        $('#frmPropertyData :input').prop('readonly', true);
    }

    this.Activate = function () {

        var requestData = {};
        requestData = this.CTRL_Actions.GetDataForm('frmRegistrationRequestData');
        var id = sessionStorage.getItem('usuarioActivo');

        new Promise((resolve) => {
            //GET user data
            this.CTRL_Actions.GetByIdToApi("user", id, (res) => { resolve(res) });
        }).then(res => {
            res['Status'] = "Activo";
            new Promise((resolve) => {
                //UPDATE user status
                this.CTRL_Actions.PutToAPI("user", res, (res1) => { resolve(res1) });
            }).then(res1 => {
                new Promise((resolve) => {
                    //GET Property data
                    this.CTRL_Actions.GetByIdToApi("propertyxuser", id, (res2) => { resolve(res2) });
                }).then(res2 => {
                    //UPDATE Property status
                    res2['Status'] = "Activo";
                    this.CTRL_Actions.PutToAPI("Property", res2, () => {

                        let rolActivo = sessionStorage.getItem("rolActivo");
                        rolActivo[0].Status = "Activo";
                        sessionStorage.setItem("rolActivo", rolActivo);

                        sessionStorage.setItem("estadoActivo", "\"Activo\"");
                        console.log(sessionStorage.getItem("estadoActivo"));

                        this.CTRL_Actions.ShowMessage('I', 'Activación realizada de manera correcta!');
                        window.location = '/Home/vProfileUser';
                    });
                })
            })
        }).catch(error => {
            this.CTRL_Actions.ShowMessage('E', 'La activación no pudo ser realizada de manera correcta!');
        })
    }

    this.Pay = function () {

        var PayMentMethodSelected = document.getElementById("txtPaymentMethod").value;

        if ((!this.vHelper.validateFormValues(frmPayData) && (PayMentMethodSelected == "SINPE")) || (PayMentMethodSelected == "PAYPAL")) {
            $('.spinner').show();

            new Promise((resolve) => {
                console.log();
                //1. POST payment method
                var paymentMethodData = JSON.parse('{}');
                paymentMethodData['Type'] = document.getElementById("txtPaymentMethod").value;

                if (PayMentMethodSelected == "PAYPAL") {
                    paymentMethodData['Account'] = localStorage.getItem('paypalAccountId');
                } else {
                    paymentMethodData['Account'] = document.getElementById("txtPhoneNumberPY").value;
                }

                paymentMethodData['UserId'] = sessionStorage.getItem('usuarioActivo');
                paymentMethodData['Status'] = "Activo";
                this.CTRL_Actions.PostToAPI("paymentmethod", paymentMethodData, (res) => { resolve(res) });

            }).then(() => {
                new Promise((resolve) => {

                    //2. POST bill
                    var billJsonObj = JSON.parse('{}');
                    var d = new Date();
                    d = new Date(d.getTime() - 3000000);
                    var currentDate = d.getFullYear().toString() + "-" + ((d.getMonth() + 1).toString().length == 2 ? (d.getMonth() + 1).toString() : "0" + (d.getMonth() + 1).toString()) + "-" + (d.getDate().toString().length == 2 ? d.getDate().toString() : "0" + d.getDate().toString()) + " " + (d.getHours().toString().length == 2 ? d.getHours().toString() : "0" + d.getHours().toString()) + ":" + ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2 ? (parseInt(d.getMinutes() / 5) * 5).toString() : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) + ":00";

                    billJsonObj['Description'] = this.subMessage;
                    billJsonObj['Timestamp'] = currentDate;
                    billJsonObj['SubTotal'] = parseInt(localStorage.getItem("defaultPrice"));
                    billJsonObj['Total'] = Math.round(parseInt(localStorage.getItem("defaultPrice")) * 1.13);
                    billJsonObj['Type'] = "Suscripción";
                    billJsonObj['UserReceptorId'] = sessionStorage.getItem('usuarioActivo');
                    billJsonObj['UserRemitentId'] = this.applicationRepresentant;
                    billJsonObj['Status'] = "Pagado";

                    this.CTRL_Actions.PostToAPI("bill", billJsonObj, (res1) => { resolve(res1) });

                }).then(() => {

                    //3. GET Payment Method.
                    var promise1 = new Promise((resolve, reject) => {
                        this.CTRL_Actions.GetByIdToApi("paymentMethodxUser", sessionStorage.getItem('usuarioActivo'), (res3) => { resolve(res3) });
                    });

                    //4. GET BILL
                    var promise2 = new Promise((resolve, reject) => {
                        this.CTRL_Actions.GetByIdToApi("billxuser", sessionStorage.getItem('usuarioActivo'), (res4) => { resolve(res4) });
                    });

                    //4.5 Send Message / optional
                    if (PayMentMethodSelected == "SINPE") {
                        
                        var today = new Date();
                        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        var dateTime = date + ' ' + time;
                        
                        var JSONSendPhone = {
                            "DestinationNumber": "+506" + document.getElementById("txtPhoneNumberPY").value,
                            "BodyMessage": "BCR le informa que se debito de su cuenta de ahorro, la suma de "
                                + document.getElementById("txtAmount").value.toString().replace('.', "").replace('₡', "") + " colones por transferencia SINPE realizada, el dia " + dateTime + "."
                        }
                        this.CTRL_Actions.PostToAPI("sms", JSONSendPhone, () => {
                            document.getElementById("btnPay").disabled = true;
                        });
                    }

                    Promise.all([promise1, promise2])
                        .then(value => {
                            new Promise((resolve) => {

                                //5. POST PAY
                                var payData = JSON.parse('{}');
                                payData['Amount'] = localStorage.getItem('paypalAccountId');
                                payData['Status'] = "Pagado";
                                payData['BillId'] = value[1][0]['Id'];
                                payData['PaymentMethodId'] = value[0][0]['Id'];
                                localStorage.setItem("billId", value[1][0]['Id']);
                                this.CTRL_Actions.PostToAPI("pay", payData, (res5) => { resolve(res5) });

                            }).then(() => {

                                //6. POST email.
                                var requestData = {};
                                requestData = this.CTRL_Actions.GetDataForm('frmUserData');
                                var today = new Date();
                                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                var emailJsonObj = JSON.parse('{}');

                                emailJsonObj['ToEmail'] = requestData['Email'];
                                emailJsonObj['BillNumber'] = localStorage.getItem("billId");
                                emailJsonObj['ClientName'] = requestData['Name'] + " " + requestData['LastName'];
                                emailJsonObj['Date'] = date;
                                emailJsonObj['Detail'] = this.subMessage;
                                emailJsonObj['Price'] = parseInt(localStorage.getItem("defaultPrice"));
                                emailJsonObj['SubTotal'] = parseInt(localStorage.getItem("defaultPrice"));
                                emailJsonObj['Iva'] = Math.round(parseInt(localStorage.getItem("defaultPrice")) * 0.13);
                                emailJsonObj['Total'] = Math.round(parseInt(localStorage.getItem("defaultPrice")) * 1.13);

                                this.CTRL_Actions.PostToAPI("emailbill", emailJsonObj, () => {

                                    document.getElementById("btnActive").style.background = '#ef7f4d';
                                    document.getElementById("btnActive").disabled = false;
                                    $("#paypal-button").hide();
                                    document.getElementById("txtPaymentMethod").disabled = true;
                                    this.CTRL_Actions.ShowMessage('I', 'Pago realizado de manera correcta!');
                                    $('.spinner').hide();
                                });
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


    this.PayPalButton = function () {

        var price = ((parseInt(localStorage.getItem("defaultPrice")) * 1.13) / this.dollarPrice).toFixed(2).toString();

        paypal.Button.render({
            // Configure environment
            env: 'sandbox',
            client: {
                sandbox: 'AY1A6s8mhBXACaR1E93Ttm3w2LzAvn8yzGjT17VgGNArirTm_Ty5oig5WgWUGyRsSnl_IS46ed91bJZ2'
            },
            // Customize button (optional)
            locale: 'es_ES',
            style: {
                size: 'medium',
                color: 'gold',
                shape: 'pill',
            },

            // Enable Pay Now checkout flow (optional)
            commit: true,

            // Set up a payment
            payment: function (data, actions) {

                return actions.payment.create({
                    transactions: [{
                        amount: {
                            total: price,
                            currency: 'USD'
                        },
                        description: 'Pago de suscripción.'
                    }]
                });
            },

            // Execute the payment
            onAuthorize: function (data, actions) {
                return actions.payment.execute().then(function () {

                    localStorage.setItem("paypalAccountId", data.payerID);
                    var vactiveuser = new vActivateUser();
                    vactiveuser.Pay();

                });
            }
        }, '#paypal-button');

    }

    this.ChangePaymentMethod = function () {
        var valueSelected = document.getElementById("txtPaymentMethod").value;
        document.getElementById("txtPhoneNumberPY").value = document.getElementById("txtPhoneNumber").value;
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
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vactiveuser = new vActivateUser();
    vactiveuser.RetrieveID();
    vactiveuser.PayPalButton();

    document.getElementById("btnActive").disabled = true;
    document.getElementById("btnActive").style.background = '#787878';
    $("#ContentPhoneNumber").addClass('d-none');
    $("#ContentPayButton").addClass('d-none');

    $("#txtPaymentMethod").change(function () {
        vactiveuser.ChangePaymentMethod();
    });

});
