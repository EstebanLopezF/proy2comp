function vVerification() {
	this.service = 'verification';
	this.CTRL_Actions = new ControlActions();
	this.UI_Helper = new UI_Helper();

	this.Verification = function () {
		var vHelper = new ValidationHelper(), verificationData = this.CTRL_Actions.GetDataForm('frmVerificationData');

		if (!vHelper.validateFormValues(frmVerificationData)) {
			$('spinner').show();
			//We obtain the user's ID
			var userId = localStorage.getItem('userId');
			new Promise((resolve) => {
				//GET CODE 
				this.CTRL_Actions.GetByIdToApi("Verification", userId, (res) => { resolve(res) });
			})
				.then(res => {
					var correoCodigo = '';
					var phoneCode = '';
					if (res[0].Type == 'correo' && res[1].Type == 'telefono') {
						correoCodigo = res[0].Code;
						phoneCode = res[1].Code;  
					} else {
						correoCodigo = res[1].Code;
						phoneCode = res[0].Code;
					}		
					//We get the code entered by the user
					var userEmailCode = document.getElementById('emailCode').value;
					var userPhoneCode = document.getElementById('phoneCode').value;
					if (userEmailCode == correoCodigo) {
						if (userPhoneCode == phoneCode) {
							$('spinner').hide();
							this.CTRL_Actions.ShowMessage('I', 'Activacion de la cuenta ha sido correcta');
							var isClient = localStorage.getItem("userRedirection");
							localStorage.setItem("userRedirection", "no");
							if (isClient == "yes") {

								//POST notification email.
								var emailJsonObj = JSON.parse('{}');
								emailJsonObj['ToEmail'] = localStorage.getItem("EmailCred");
								emailJsonObj['Name'] = localStorage.getItem("NameCred");
								emailJsonObj['Description'] = "Creación de Cuenta Cliente";
								emailJsonObj['TextMesage'] = "Nos alegra informarle que su cuenta cliente en WORK-TOGETHER fue creada exitosamente, usted recibira una contraseña temporal para su ingreso en algunos minutos.";
								this.CTRL_Actions.PostToAPI("email", emailJsonObj, () => {

									//GET TEMP password on email.
									this.CTRL_Actions.GetByIdToApi("password", userId, () => {
										$('.spinner').hide();
										this.CTRL_Actions.ShowMessage('I', 'El usuario fue creado de manera correcta!');
										setTimeout(window.location = '/Home/Index', 35000);
									});
								});

							} else {
								setTimeout(window.location = '/Home/vRegisterProperty', 10000);
							}
						} else {
							$('spinner').hide();
							this.CTRL_Actions.ShowMessage('E', 'El codigo de verificacion de telefono es incorrecto');
						}
					} else {
						$('spinner').hide();
						this.CTRL_Actions.ShowMessage('E', 'El codigo de verificacion de correo ingresado es incorrecto');
                    }
				})
				.catch(error => {
					$('.spinner').hide();
					this.CTRL_Actions.ShowMessage('E', 'El codigo de verificacion no pudo ser procesada correctamente');
                })
		} else {
			this.CTRL_Actions.ShowMessage('E', 'Por favor, ingrese todos los campos');
        }
	}
}