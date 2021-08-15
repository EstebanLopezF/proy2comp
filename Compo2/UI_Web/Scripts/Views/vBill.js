function vBill() {

    this.UI_Helper = new UI_Helper();
    this.TBL_List_ID = 'TBL_Bill_List';
    this.service = 'bill';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,Description,Timestamp,SubTotal,Total,Type,UserReceptorId,UserRemitentId,Status,";

    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTableBill2(this.service, this.TBL_List_ID, false);
    }

    this.RetrieveAllUnit = function () {

        new Promise((resolve) => {
            //POST User.
            this.CTRL_Actions.FillTableAppProfits(this.service, "TBL_incomings_List", false, (res) => { resolve(res) });
        })
            .then(res => {
                this.Chart();
            })
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTableBill2(this.service, this.TBL_List_ID, true);
        this.Chart();
    }

    this.BindFields = function (data) {

        //promesa para jalar info del usuario.

        new Promise((resolve) => {
            this.CTRL_Actions.GetByIdToApi("user", data.UserReceptorId, (res) => { resolve(res) });
        })
            .then(res => {

                $('.spinner').hide();

                document.getElementById("txtBillNumber").innerHTML = data.Id;
                document.getElementById("txtClientCed").innerHTML = data.UserReceptorId;
                document.getElementById("txtClientName").innerHTML = res.Name + " " + res.LastName;
                document.getElementById("txtClientPhone").innerHTML = res.PhoneNumber;
                document.getElementById("txtClientEmail").innerHTML = res.Email;
                document.getElementById("txtDate").innerHTML = data.Timestamp;
                document.getElementById("txtDetail").innerHTML = data.Description;
                document.getElementById("txtPrice").innerHTML = data.SubTotal;
                document.getElementById("txtSubtotal").innerHTML =  data.SubTotal;
                document.getElementById("txtIva").innerHTML = "₡ " + (parseInt(data.SubTotal.replace('.', "").replace('₡', "")) * 0.13).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                document.getElementById("txtTotal").innerHTML = data.Total;
                this.UI_Helper.togglePanel('BillSection', 'panel-bills-close');

            })
            .catch(error => {
                $('.spinner').hide();
                this.CTRL_Actions.ShowMessage('E', 'Error al intentar obtener la información de la factura.!');
            })

    }

    this.Chart = function () {

        var txtSumTodayCom = parseInt(localStorage.getItem("txtSumTodayCom"));
        var txtSumTodaySub = parseInt(localStorage.getItem("txtSumTodaySub"));
        var txtSumTodayImp = parseInt(localStorage.getItem("txtSumTodayIVA"));
        var txtSumAllSunInc = parseInt(localStorage.getItem("txtSumAllSunInc"));
        var txtSumAllComInc = parseInt(localStorage.getItem("txtSumAllComInc"));
        var txtSumAllImp = parseInt(localStorage.getItem("txtSumAllIVA"));

        CanvasJS.addColorSet("appColors",
            [
                "#52D726",
                "#FF7300",
                "#007ED6"
            ]);

        var chart1 = new CanvasJS.Chart("chartContainer1", {
            colorSet: "appColors",
            legend: {
                maxWidth: 350,
                itemWidth: 120
            },
            data: [
                {
                    type: "pie",
                    showInLegend: true,
                    toolTipContent: "{y} - #percent %",
                    yValueFormatString: "₡ #######.00",

                    legendText: "{indexLabel}",
                    dataPoints: [
                        { y: txtSumTodaySub, indexLabel: "Suscripciones" },
                        { y: txtSumTodayCom, indexLabel: "Comisiones" },
                        { y: txtSumTodayImp, indexLabel: "Impuestos" }
                    ]
                }
            ],
            axisY: {
                prefix: "₡"
            }
        });
        var chart2 = new CanvasJS.Chart("chartContainer2", {
            colorSet: "appColors",

            data: [
                {
                    type: "column",
                    name: "Suscripciones",
                    yValueFormatString: "₡ #######.00",
                    showInLegend: true,
                    dataPoints: [{ label: "Ingresos", y: txtSumAllSunInc }]
                },
                {
                    type: "column",
                    name: "Comisiones",
                    yValueFormatString: "₡ #######.00",
                    showInLegend: true,
                    dataPoints: [{ label: "Ingresos", y: txtSumAllComInc }]
                },
                {
                    type: "column",
                    name: "Impuestos",
                    yValueFormatString: "₡ #######.00",
                    showInLegend: true,
                    dataPoints: [{ label: "Impuestos", y: txtSumAllImp }]
                }
            ],
            axisY: {
                prefix: "₡"
            }
        });
        chart2.render();
        chart1.render();

    }

}

function ShowTab() {

    var checkbox = document.getElementById('SwitchTabBox');
    if (checkbox.checked != true) {
        $("#tab1").addClass('d-none');
        $("#tab2").removeClass('d-none');
        $("#BillSection").addClass('d-none');
        $("#TitleTabBill").text("Detalle de Todas las Transacciones");
    } else {
        $("#tab1").removeClass('d-none');
        $("#tab2").addClass('d-none');
        $("#BillSection").addClass('d-none');
        $("#TitleTabBill").text("Detalle de Ingresos");
    }

}

//ON DOCUMENT READY
$(document).ready(function () {
    var vbill = new vBill();
    vbill.RetrieveAll();
    vbill.RetrieveAllUnit();

});

