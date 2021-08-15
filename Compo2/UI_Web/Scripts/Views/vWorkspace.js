function vWorkspace() {
    this.TBL_Workspace_List_Id = 'TBL_Workspace_List';
    this.service = 'workspace';
    this.CTRL_Actions = new ControlActions();
    this.columns = "Id, PropetiesId, State, SizeM2";
    this.vHelper = new ValidationHelper();
    this.UI_Helper = new UI_Helper();
    this.variables = new Variables();
    this.LS_Service = new LocalStorage();

    this.Create = function () {
        var vHelper = new ValidationHelper(), workspaceData = this.CTRL_Actions.GetDataForm('frmWorkspaceData');

        //Set default values
        workspaceData['State'] = 'Revision';

        if (!vHelper.validateFormValues(frmWorkspaceData)) {
            $('.spinner').show();
            this.CTRL_Actions.PostToAPI(this.service, workspaceData, () => {
                $('.spinner').hide();
                setTimeout(window.location = '/Home/vListWorkspace', 10000);
            });
            const Images_URL = this.LS_Service.get(this.variables.Images_LS);
            console.log(Images_URL);
        } else {
            this.CTRL_Actions.ShowMessage('E', 'Por favor, ingrese todos los datos');
        }
        this.ReloadTable();
    }

    this.ReloadTable = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_Workspace_List_Id, true);
    }

    this.RetrieveAll = function () {
        this.CTRL_Actions.FillTable(this.service, this.TBL_Workspace_List_Id, false);
    }

    this.BindFields = function (data) {
        this.UI_Helper.togglePanel('panel-workspaces', 'panel-workspaces-close');
        this.CTRL_Actions.BindFieldsImage('frmWorkspaceData', data);
        document.getElementById("sltState").value = data.State;
    }

    this.Update = function () {
        var workspaceData = {};
        workspaceData = this.CTRL_Actions.GetDataForm('frmWorkspaceData');
        workspaceData.State = document.getElementById("sltState").value;
        this.CTRL_Actions.PutToAPI(this.service, workspaceData, () => {
            var vworkspace = new vWorkspace();
            vworkspace.ReloadTable();
        });
    }

    this.Delete = function () {
        var workspaceData = {};
        workspaceData = this.CTRL_Actions.GetDataForm('frmWorkspaceData');
        this.CTRL_Actions.DeleteToAPI(this.service, workspaceData, () => {
            var vworkspace = new vWorkspace();
            this.ReloadTable();
        });
    }

    this.GetFileName = function (fileName) {
        this.LS_Service.set_LS(`${this.variables.Images_URL}${fileName}`, this.variables.Images_LS);
    }

	this.Reservation = function () {
		var workspaceName = document.getElementById('txtName').value;
		var workspaceId = document.getElementById('txtId').value;
		var propertyId = document.getElementById('txtPropertyId').value;
		var rentalPrice = document.getElementById('txtRentalPrice').value;
        var reservationPropertyId = document.getElementById('txtPropertyId').value;

		localStorage.setItem("workspaceName", workspaceName);
		localStorage.setItem("workspaceId", workspaceId);
		localStorage.setItem("propertyId", propertyId);
		localStorage.setItem("rentalPrice", rentalPrice);
        localStorage.setItem("reservationPropertyId", reservationPropertyId);
		window.location = '/Home/vRegisterReservation';
    }

}


//ON DOCUMENT READY
$(document).ready(function () {
    var vworkspaces = new vWorkspace();
    vworkspaces.RetrieveAll();
});