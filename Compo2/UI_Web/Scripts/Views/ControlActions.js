
function ControlActions() {

    this.URL_API = "https://localhost:44346/api/";

    this.GetUrlApiService = function (service) {
        return this.URL_API + service;
    }

    this.GetUrlApiServiceId = function (service, id) {
        return this.URL_API + service + "/" + id;
    }

    this.GetTableColumsDataName = function (tableId) {
        var val = $('#' + tableId).attr("ColumnsDataName");

        return val;
    }

    this.FillTable = function (service, tableId, refresh) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiService(service),
                    dataSrc: 'Data'
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
        }

    }

    this.FillTableById = function (service, tableId, refresh, id) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiServiceId(service, id),
                    dataSrc: 'Data'
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
        }

    }

    this.FillTableId = function (service, id) {

        var urldir = this.GetUrlApiServiceId(service, id);
        var request = new XMLHttpRequest()
        request.open('GET', urldir, true)
        request.onload = function () {

            var data = JSON.parse(this.response)

            if (request.status >= 200 && request.status < 400) {
                var obj = JSON.parse(request.response)

                $.each(obj.Data, function (k, v) {
                    try {
                        if (k === "UrlImage") {
                            document.getElementById("txt" + k).src = obj.Data[k];
                            document.getElementById("txt" + k).value = obj.Data[k];
                        } else {
                            document.getElementById("txt" + k).value = obj.Data[k];
                        }
                        if (k === "ElectronicWalletAmount") {
                            document.getElementById("txt" + k).value = "₡ " + obj.Data[k].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        }
                    }
                    catch { }
                });

            } else {
                this.ShowMessage(E, obj.ShowMessage);
            }
        }
        request.send()
    }

    this.FillTableUserRoles = function (service, tableId, refresh) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiService(service),
                    "dataSrc": function (json) {
                        var json2 = json

                        json2.Data.forEach(function (n) {
                            var roles = "";
                            var urldir = "https://localhost:44346/api/rolxuser/" + n.Id;
                            var request = new XMLHttpRequest();
                            request.open('GET', urldir, false);
                            request.send(null);

                            var rolist = JSON.parse(request.response)
                            rolist.Data.forEach(function (v) {
                                if (roles === "")
                                    roles += v.Type;
                                else
                                    roles += "," + v.Type;
                            });
                            n["Rol"] = roles;
                        });
                        return json2.Data;
                    }
                },
                "columns": arrayColumnsData
            });

        } else {
            $('#' + tableId).DataTable().ajax.reload();
        }
    }

    this.FillTableProfits = function (service, tableId, refresh, callback) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiService(service),
                    "dataSrc": function (json) {
                        var currentUser = sessionStorage.getItem('usuarioActivo');
                        var txtIncomings = 0;
                        var txtIncomingsAll = 0;
                        var txtPayedSuscriptions = 0;
                        var txtPayedComition = 0;
                        var txtReturned = 0;

                        const today = new Date().toISOString().slice(0, 10)

                        //next 3 days
                        var today1 = new Date(); today1.setDate(today1.getDate() + 1); today1 = today1.toISOString().slice(0, 10);
                        var today2 = new Date(); today2.setDate(today2.getDate() + 2); today2 = today2.toISOString().slice(0, 10);
                        var today3 = new Date(); today3.setDate(today3.getDate() + 3); today3 = today3.toISOString().slice(0, 10);

                        //last 3 days
                        var todayl1 = new Date(); todayl1.setDate(todayl1.getDate() - 1); todayl1 = todayl1.toISOString().slice(0, 10);
                        var todayl2 = new Date(); todayl2.setDate(todayl2.getDate() - 2); todayl2 = todayl2.toISOString().slice(0, 10);
                        var todayl3 = new Date(); todayl3.setDate(todayl3.getDate() - 3); todayl3 = todayl3.toISOString().slice(0, 10);

                        var dayinc = JSON.parse('{}');
                        var dayleft = JSON.parse('{}');

                        dayinc[todayl3] = 0; dayleft[todayl3] = 0;
                        dayinc[todayl2] = 0; dayleft[todayl2] = 0;
                        dayinc[todayl1] = 0; dayleft[todayl1] = 0;
                        dayinc[today] = 0; dayleft[today] = 0;
                        dayinc[today1] = 0; dayleft[today1] = 0;
                        dayinc[today2] = 0; dayleft[today2] = 0;
                        dayinc[today3] = 0; dayleft[today3] = 0;

                        var objToReturn = [];
                        json.Data.forEach(function (n) {
                            if (n.UserReceptorId == currentUser || n.UserRemitentId == currentUser) {
                                objToReturn.push(n);

                                if ((n.Type === "Suscripción") && (n.UserReceptorId == currentUser)) {
                                    txtPayedSuscriptions = txtPayedSuscriptions + n.Total;

                                    if (n.Timestamp.substring(0, 10) in dayleft) {
                                        dayleft[n.Timestamp.substring(0, 10)] = dayleft[n.Timestamp.substring(0, 10)] + n.Total;
                                    }

                                } else if ((n.Type === "Reservación") && (n.UserRemitentId == currentUser)) {
                                    txtIncomings = txtIncomings + n.SubTotal;
                                    txtIncomingsAll = txtIncomingsAll + n.Total;

                                    if (n.Timestamp.substring(0, 10) in dayinc) {
                                        dayinc[n.Timestamp.substring(0, 10)] = dayinc[n.Timestamp.substring(0, 10)] + n.SubTotal;
                                    }

                                } else if ((n.Type === "Comisión") && (n.UserReceptorId == currentUser)) {
                                    txtPayedComition = txtPayedComition + n.Total;

                                    if (n.Timestamp.substring(0, 10) in dayleft) {
                                        dayleft[n.Timestamp.substring(0, 10)] = dayleft[n.Timestamp.substring(0, 10)] + n.Total;
                                    }

                                } else if ((n.Type === "Reembolso") && (n.UserRemitentId == currentUser)) {
                                    txtReturned = txtReturned + n.Total;

                                    if (n.Timestamp.substring(0, 10) in dayleft) {
                                        dayleft[n.Timestamp.substring(0, 10)] = dayleft[n.Timestamp.substring(0, 10)] + n.Total;
                                    }
                                }
                            }
                        });

                        localStorage.setItem('dayinc', JSON.stringify(dayinc));
                        localStorage.setItem('dayleft', JSON.stringify(dayleft));

                        document.getElementById("txtIVA").innerHTML = "₡ " + (txtIncomingsAll - txtIncomings).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("txtIncomings").innerHTML = "₡ " + txtIncomings.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("txtIncomingsAll").innerHTML = "₡ " + txtIncomingsAll.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("txtPayedSuscriptions").innerHTML = "₡ " + txtPayedSuscriptions.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("txtPayedComition").innerHTML = "₡ " + txtPayedComition.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        document.getElementById("txtReturned").innerHTML = "₡ " + txtReturned.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                        objToReturn.forEach(function (n) {
                            n.Total = "₡" + n.Total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                            n.SubTotal = "₡" + n.SubTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        });

                        callback();
                        return objToReturn;
                    }
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
            callback();
        }
    }

    this.FillTableBill2 = function (service, tableId, refresh) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiService(service),
                    dataSrc: function (json) {

                        objToReturn = json.Data;

                        objToReturn.forEach(function (n) {
                            n.Total = "₡" + n.Total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                            n.SubTotal = "₡" + n.SubTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        });

                        return objToReturn;
                    }
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
        }

    }

    this.FillTableAppProfits = function (service, tableId, refresh, callback) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiService(service),
                    "dataSrc": function (json) {
                        const today = new Date().toISOString().slice(0, 10);
                        var txtSumTodaySub = 0;
                        var txtSumAllSunInc = 0;
                        var txtSumTodayCom = 0;
                        var txtSumAllComInc = 0;

                        var objToReturn = [];
                        json.Data.forEach(function (n) {

                            if (n.Type === "Suscripción") {
                                objToReturn.push(n);
                                txtSumAllSunInc = txtSumAllSunInc + n.Total;
                                if (n.Timestamp.substring(0, 10) == today) {
                                    txtSumTodaySub = txtSumTodaySub + n.Total;
                                }
                            } else if (n.Type === "Comisión") {
                                objToReturn.push(n);
                                txtSumAllComInc = txtSumAllComInc + n.Total;
                                if (n.Timestamp.substring(0, 10) == today) {
                                    txtSumTodayCom = txtSumTodayCom + n.Total;
                                }
                            }

                        });

                        localStorage.setItem("txtSumTodayCom", txtSumTodayCom);
                        localStorage.setItem("txtSumTodaySub", txtSumTodaySub);
                        localStorage.setItem("txtSumTodayIVA", Math.round((txtSumTodaySub + txtSumTodayCom) * 0.13));
                        localStorage.setItem("txtSumAllSunInc", txtSumAllSunInc);
                        localStorage.setItem("txtSumAllComInc", txtSumAllComInc);
                        localStorage.setItem("txtSumAllIVA", Math.round((txtSumAllSunInc + txtSumAllComInc) * 0.13));

                        $("#txtCTT").text("₡ " + (txtSumTodaySub + txtSumTodayCom).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtSubT").text("₡ " + txtSumTodaySub.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtComT").text("₡ " + txtSumTodayCom.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtIVAT").text("₡ " + Math.round((txtSumTodaySub + txtSumTodayCom) * 0.13).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));

                        $("#txtCTA").text("₡ " + (txtSumAllSunInc + txtSumAllComInc).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtSubA").text("₡ " + txtSumAllSunInc.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtComA").text("₡ " + txtSumAllComInc.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));
                        $("#txtIVAA").text("₡ " + Math.round((txtSumAllSunInc + txtSumAllComInc) * 0.13).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'));

                        objToReturn.forEach(function (n) {
                            n.Total = "₡"+n.Total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                            n.SubTotal = "₡"+n.SubTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
                        });

                        callback("pp");
                        return objToReturn;
                    }
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
            callback("pp");
        }
    }

    this.FillTableCancelations = function (service, userid, tableId, refresh) {
        if (!refresh) {
            columns = this.GetTableColumsDataName(tableId).split(',');
            var arrayColumnsData = [];

            $.each(columns, function (index, value) {
                var obj = {};
                obj.data = value;
                arrayColumnsData.push(obj);
            });

            $('#' + tableId).DataTable({
                "processing": true,
                "ajax": {
                    "url": this.GetUrlApiServiceId(service, userid),
                    "dataSrc": function (json) {

                        var json2 = json

                        json2.Data.forEach(function (n) {
                            var urldir = "https://localhost:44346/api/user/" + n.ID_Owner;
                            var request = new XMLHttpRequest();
                            request.open('GET', urldir, false);
                            request.send(null);
                            var userInfo = JSON.parse(request.response)
                            n["User_Name"] = userInfo.Data.Name + " " + userInfo.Data.LastName;

                            var urldir2 = "https://localhost:44346/api/workspace/" + n.IdWorkspace;
                            var request2 = new XMLHttpRequest();
                            request2.open('GET', urldir2, false);
                            request2.send(null);
                            var workspaceInfo = JSON.parse(request2.response)
                            n["Workspace_Name"] = workspaceInfo.Data.Name;
                            n["Price"] = 5650;

                        });
                        return json2.Data;
                    }
                },
                "columns": arrayColumnsData
            });
        } else {
            $('#' + tableId).DataTable().ajax.reload();
        }
    }

    this.GetSelectedRow = function () {
        var data = sessionStorage.getItem(tableId + '_selected');
        return data;
    };

    this.BindFields = function (formId, data) {
        $('#' + formId + ' *').filter(':input').each(function (input) {
            var columnDataName = $(this).attr("ColumnDataName");
            this.value = data[columnDataName];
        });
    }

    this.BindFieldsImage = function (formId, data) {
        $('#' + formId + ' *').filter(':input').each(function (input) {
            var columnDataName = $(this).attr("ColumnDataName");
            if (columnDataName === "UrlImage") {
                this.value = data[columnDataName];
                this.src = data[columnDataName];
            } else {
                this.value = data[columnDataName];
            }
        });
    }

    this.GetDataForm = function (formId) {
        var data = {};

        $('#' + formId + ' *').filter(':input').each(function (input) {
            var columnDataName = $(this).attr("ColumnDataName");
            data[columnDataName] = this.value;
        });

        return data;
    }

    this.ShowMessage = function (type, message) {
        if (type == 'E') {
            $("#alert_container").removeClass("alert alert-success alert-dismissable")
            $("#alert_container").addClass("alert alert-danger alert-dismissable");
            $("#alert_message").text(message);
            $('.spinner').hide();
        } else if (type == 'I') {
            $("#alert_container").removeClass("alert alert-danger alert-dismissable")
            $("#alert_container").addClass("alert alert-success alert-dismissable");
            $("#alert_message").text(message);
        }
        $('.alert').show();
    };

    this.PostToAPI = function (service, data, callbackFunction) {
        var jqxhr = $.post(this.GetUrlApiService(service), data, function (response) {

            var ctrlActions = new ControlActions();
            if (service != "email")
                ctrlActions.ShowMessage('I', response.Message);
            callbackFunction(callbackFunction);
        })
            .fail(function (response) {
                var data = response.responseJSON;
                var ctrlActions = new ControlActions();
                if (service != "email")
                    ctrlActions.ShowMessage('E', data.ExceptionMessage);
            })
    };

    this.PutToAPI = function (service, data, callbackFunction) {
        var jqxhr = $.put(this.GetUrlApiService(service), data, function (response) {
            var ctrlActions = new ControlActions();
            ctrlActions.ShowMessage('I', response.Message);
            callbackFunction(callbackFunction);
        })
            .fail(function (response) {
                var data = response.responseJSON;
                var ctrlActions = new ControlActions();
                ctrlActions.ShowMessage('E', data.ExceptionMessage);
            })
    };

    this.DeleteToAPI = function (service, data, callbackFunction) {
        var jqxhr = $.delete(this.GetUrlApiService(service), data, function (response) {
            var ctrlActions = new ControlActions();
            ctrlActions.ShowMessage('I', response.Message);
            callbackFunction(callbackFunction);
        })
            .fail(function (response) {
                var data = response.responseJSON;
                var ctrlActions = new ControlActions();
                ctrlActions.ShowMessage('E', data.ExceptionMessage);
            })
    };

    this.GetToApi = function (service, callbackFunction) {
        var jqxhr = $.get(this.GetUrlApiService(service), function (response) {
            callbackFunction(response.Data);
        });
    }

    this.GetByIdToApi = function (service, id, callbackFunction) {
        var jqxhr = $.get(this.GetUrlApiServiceId(service, id), function (response) {
            callbackFunction(response.Data);
        });
    }

}

$.put = function (url, data, callback) {
    if ($.isFunction(data)) {
        type = type || callback,
            callback = data,
            data = {}
    }
    return $.ajax({
        url: url,
        type: 'PUT',
        success: callback,
        data: JSON.stringify(data),
        contentType: 'application/json'
    });
}

$.delete = function (url, data, callback) {
    if ($.isFunction(data)) {
        type = type || callback,
            callback = data,
            data = {}
    }
    return $.ajax({
        url: url,
        type: 'DELETE',
        success: callback,
        data: JSON.stringify(data),
        contentType: 'application/json'
    });
}
