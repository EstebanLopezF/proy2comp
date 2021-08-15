function vPaymentMethod() {

    this.UI_Helper = new UI_Helper();
    this.TBL_List_ID = 'TBL_PaymentMethod_List';
    this.service = 'paymentmethodxuser';
    this.serviceToSend = 'paymentmethod' 
    this.frmData = 'frmPaymentMethodData';
    this.currentUser = sessionStorage.getItem('usuarioActivo');
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id,Type,Account,UserId,Status";

    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTableById(this.service, this.TBL_List_ID, false, this.currentUser);
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTableById(this.service, this.TBL_List_ID, true, this.currentUser);
    }

    this.Create = function () {
        var vHelper = new ValidationHelper(),
            paymentMethodData = this.CTRL_Actions.GetDataForm(this.frmData);

        paymentMethodData['Status'] = 'Activo';
        paymentMethodData['UserId'] = this.currentUser;

        if (!vHelper.validateFormValues(frmPaymentMethodData)) {

            this.CTRL_Actions.PostToAPI(this.serviceToSend, paymentMethodData, () => {
                var vpaymentmethods = new vPaymentMethod();
                vpaymentmethods.ReloadTable();
            });

        } else {
            this.CTRL_Actions.ShowMessage('E', 'Por favor, llenar todos los campos');
        }
        this.ReloadTable();
        document.getElementById("panel-paymetmethods").classList.add("d-none");
    }

    this.Update = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm(this.frmData);
        userData.Id = localStorage.getItem("PayM.id");
        userData.Status = localStorage.getItem("PayM.Status");
        userData.UserId = this.currentUser;
        userData.Type = document.getElementById("sltType").value;
        this.CTRL_Actions.PutToAPI(this.serviceToSend, userData, () => {
            var vpaymentmethods = new vPaymentMethod();
            vpaymentmethods.ReloadTable();
            document.getElementById("panel-paymetmethods").classList.add("d-none");
        });
    }

    this.Delete = function () {
        var userData = {};
        userData = this.CTRL_Actions.GetDataForm(this.frmData);
        userData.Id = localStorage.getItem("PayM.id");
        userData.UserId = this.currentUser;

        this.CTRL_Actions.DeleteToAPI(this.serviceToSend, userData, () => {
            var vpaymentmethods = new vPaymentMethod();
            vpaymentmethods.ReloadTable();
        });
    }

    this.BindFields = function (data) {
        this.UI_Helper.togglePanel('panel-paymetmethods', 'panel-paymentMethod-close');
        this.CTRL_Actions.BindFields('frmPaymentMethodData', data);
        localStorage.setItem("PayM.id", data.Id);
        localStorage.setItem("PayM.Status", data.Status);
        document.getElementById("sltType").value = data.Type;
    }
}

//ON DOCUMENT READY
$(document).ready(function () {
    var vpaymentmethod = new vPaymentMethod();
    vpaymentmethod.RetrieveAll();
});

