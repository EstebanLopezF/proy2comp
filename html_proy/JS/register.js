$( "#buttom_register" ).click(function() {

        if(document.getElementById("serviceName").value.length == 0)
        {
            document.getElementById("serviceName").classList.add("errorinput");
        } else {
            document.getElementById("serviceName").classList.remove("errorinput");
        }

        if(document.getElementById("chargeName").value.length == 0)
        {
            document.getElementById("chargeName").classList.add("errorinput");
        } else {
            document.getElementById("chargeName").classList.remove("errorinput");
        }

        if(document.getElementById("service").value.length == 0)
        {
            document.getElementById("service").classList.add("errorinput");
        } else {
            document.getElementById("service").classList.remove("errorinput");
        }

        if(document.getElementById("phoneNum").value.length == 0)
        {
            document.getElementById("phoneNum").classList.add("errorinput");
        } else {
            document.getElementById("phoneNum").classList.remove("errorinput");
        }

        if(document.getElementById("email").value.length == 0)
        {
            document.getElementById("email").classList.add("errorinput");
        } else {
            document.getElementById("email").classList.remove("errorinput");
        }
        
        if(document.getElementById("description").value.length == 0)
        {
            document.getElementById("description").classList.add("errorinput");
        } else {
            document.getElementById("description").classList.remove("errorinput");
        }
        
  });



