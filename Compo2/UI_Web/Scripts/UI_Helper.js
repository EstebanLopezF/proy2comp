function UI_Helper() {
    this.togglePanel = function (panelId, closeBtnId) {
        const panel = document.getElementById(panelId);
        panel.classList.toggle('d-none');

        if (document.getElementById(closeBtnId)) {
            document.getElementById(closeBtnId).addEventListener('click', () => {
                panel.classList.toggle('d-none');
            });
        }
    }
}

$("document").ready(() => {
    this.sessionService = new SessionStorage();

    if (!this.sessionService.GetSessionStorage()) {
        document.getElementById("BTN_Register").classList.remove("d-none");
        document.getElementById("BTN_HomeLogout").classList.add("d-none");
        document.getElementById("userOptions").classList.add("d-none");
    } else {
        document.getElementById("BTN_Register").classList.add("d-none");
        document.getElementById("userOptions").classList.remove("d-none");
        document.getElementById("BTN_HomeLogout").classList.remove("d-none");
        document.getElementById("BTN_HomeLogin").classList.add("d-none");
    }
});
