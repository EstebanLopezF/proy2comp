function vProfits() {

    this.UI_Helper = new UI_Helper();
    this.TBL_List_ID = 'TBL_Bill_List';
    this.service = 'bill';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,Description,Timestamp,SubTotal,Total,Type,UserReceptorId,UserRemitentId,Status,";

    this.RetrieveAll = function () {
        localStorage.setItem("passChartInc", "no");
        this.CTRL_Actions.FillTableProfits(this.service, this.TBL_List_ID, false, () => {
            this.Chart();
        });
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_List_ID, true);
    }

    this.BindFields = function (data) {

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
                document.getElementById("txtSubtotal").innerHTML = data.SubTotal;
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

        let dayValues = [];
        let invValue = [];
        let ourValue = [];

        var dayinc = JSON.parse(localStorage.getItem('dayinc'));
        var dayleft = JSON.parse(localStorage.getItem('dayleft'));

        jQuery.each(dayinc, function (i, val) { dayValues.push(i); });
        jQuery.each(dayinc, function (i, val) { invValue.push(val); });
        jQuery.each(dayleft, function (i, val) { ourValue.push(val); });

        console.log(dayValues[0].toString());

            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: "Resumen Gráfico de la Semana",
                    fontFamily: "sans-serif",
                    fontSize: 28,
                    fontcolor: "brown",
                    fontWeight: "bold",
                    margin: 40
                },

                data: [ 
                    { 
                        type: "column",
                        name: "Créditos",
                        showInLegend: true,
                        yValueFormatString: "₡ #######.00",
                        dataPoints: [
                            { label: dayValues[0], y: invValue[0] },
                            { label: dayValues[1], y: invValue[1] },
                            { label: dayValues[2] + " (Ayer)", y: invValue[2] },
                            { label: dayValues[3] + " (Hoy)", y: invValue[3] },
                            { label: dayValues[4] + " (Mañana)", y: invValue[4] },
                            { label: dayValues[5], y: invValue[5] },
                            { label: dayValues[6], y: invValue[6] }
                        ]
                    },

                    { //dataSeries - second quarter

                        type: "column",
                        name: "Débitos",
                        showInLegend: true,
                        yValueFormatString: "₡ #######.00",
                        dataPoints: [
                            { label: dayValues[0], y: ourValue[0] },
                            { label: dayValues[1], y: ourValue[1] },
                            { label: dayValues[2] + " (Ayer)", y: ourValue[2] },
                            { label: dayValues[3] + " (Hoy)", y: ourValue[3] },
                            { label: dayValues[4] + " (Mañana)", y: ourValue[4] },
                            { label: dayValues[5], y: ourValue[5] },
                            { label: dayValues[6], y: ourValue[6] }
                        ]
                    }
                ],
                /** Set axisY properties here*/
                axisY: {
                    prefix: "₡"
                }
            });
            chart.render();
    }
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vprofits = new vProfits();
    vprofits.RetrieveAll();
});

