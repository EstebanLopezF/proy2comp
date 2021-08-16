$( "#buttom_register" ).click(function() {

        let allok = 0;

        if(document.getElementById("serviceName").value.length == 0)
        {
            document.getElementById("serviceName").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("serviceName").classList.remove("errorinput");
        }

        if(document.getElementById("chargeName").value.length == 0)
        {
            document.getElementById("chargeName").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("chargeName").classList.remove("errorinput");
        }

        if(document.getElementById("service").value.length == 0)
        {
            document.getElementById("service").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("service").classList.remove("errorinput");
        }

        if(document.getElementById("phoneNum").value.length == 0)
        {
            document.getElementById("phoneNum").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("phoneNum").classList.remove("errorinput");
        }

        if(document.getElementById("email").value.length == 0)
        {
            document.getElementById("email").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("email").classList.remove("errorinput");
        }
        
        if(document.getElementById("description").value.length == 0)
        {
            document.getElementById("description").classList.add("errorinput");
            allok = 1;
        } else {
            document.getElementById("description").classList.remove("errorinput");
        }

        if (allok == 0){

            var data = JSON.stringify({"Name":document.getElementById("serviceName").value
            ,"PhoneNumber":document.getElementById("phoneNum").value
            ,"Email":document.getElementById("email").value
            ,"Contact":document.getElementById("chargeName").value
            ,"Type":document.getElementById("service").value
            ,"Description":document.getElementById("description").value}); 

            console.log(data);

            xhr = new XMLHttpRequest(); 
            var url = "http://proyectofinalcomponentescenfoteccr.azurewebsites.net/api/Service"; 
            xhr.open("POST", url, true); 
            xhr.setRequestHeader("Content-type", "application/json"); 
            xhr.onreadystatechange = function () {  
                if (xhr.readyState == 4 && xhr.status == 200) { 
                    var json = JSON.parse(xhr.responseText); 
                } 
            } 
            xhr.send(data)

            

        } 
        
  });



