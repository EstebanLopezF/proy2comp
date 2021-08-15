function vProfile() {

	this.TBL_Users_List_ID = 'TBL_User_Id';
	this.service = 'user';
	this.CTRL_Actions = new ControlActions();
	this.columns = "Id,Name,LastName,Email,PhoneNumber,Status,ElectronicWalletAmount,UrlImage";

	this.RetrieveAll = function () {
		this.CTRL_Actions.FillTable(this.service, this.TBL_Users_List_ID, false);
	}

	this.RetrieveID = function () {
		var id = '304870951';
		this.CTRL_Actions.FillTableId(this.service, this.TBL_Users_List_ID, id);
	}

	this.ReloadTable = function () {
		this.CTRL_Actions.FillTable(this.service, this.TBL_Users_List_ID, true);
	}

	this.BindFields = function (data) {
		this.CTRL_Actions.BindFieldsImage('frmUserData', data);
	}
}

//ON DOCUMENT READY
$(document).ready(function () {
	var vprofile = new vProfile();
	vprofile.RetrieveID();
});

