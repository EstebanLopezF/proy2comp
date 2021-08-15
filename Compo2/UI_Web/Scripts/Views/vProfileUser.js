function vProfileUser() {

    this.TBL_Users_List_ID = 'TBL_User_Id';
    this.service = 'user';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,Name,LastName,Email,PhoneNumber,Status,ElectronicWalletAmount,UrlImage";

    this.RetrieveID = function () {
        var id = sessionStorage.getItem('usuarioActivo');

        new Promise((resolve) => {
            this.CTRL_Actions.GetByIdToApi("rolxuser", id, (res) => { resolve(res) });
        })
            .then(res => {
                var rols = "";

                this.CTRL_Actions.FillTableId(this.service, id);

                res.forEach(element => {

                    if (rols == "") {
                        rols = element.Type;
                    } else {
                        rols = rols + ", " + element.Type;
                    }
                });
                console.log(rols);
                document.getElementById("txtRol").value = rols;
            })

        document.getElementById("txtId").readOnly = true;
        document.getElementById("txtElectronicWalletAmount").readOnly = true;
        document.getElementById("txtStatus").readOnly = true;
        document.getElementById("txtRol").readOnly = true;
    }

    this.Update = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm('frmUserData');
        this.CTRL_Actions.PutToAPI(this.service, userData);
        this.ReloadTable();
    }

    this.BindFields = function (data) {
        this.CTRL_Actions.BindFieldsImage('frmUserData', data);
    }
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vprofileuser = new vProfileUser();
    try {
        vprofileuser.RetrieveID();
    } catch {
        console.log("No Table");
    }
});
