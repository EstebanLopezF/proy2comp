
function fillTable(jsonI) {

    console.log(jsonI)

    var jsonNames = { "Mohamed": "saad", "joseph": "Dankwah", "Christian": "mensah" };

    $.each(jsonI.Data,function(i,row){
        $('<tr>').attr('id',i).
            append($('<td>').text(row.Id)).
            append($('<td>').text(row.Name)).
            append($('<td>').text(row.PhoneNumber)).
            append($('<td>').text(row.Email)).
            append($('<td>').text(row.Contact)).
            append($('<td>').text(row.Type)).
            append($('<td>').text(row.Description)).appendTo("#servicesTable");
    });

}

$('document').ready(
   
    fetch('https://localhost:44346/api/Service')
      .then(response => response.json())
      .then(json => fillTable(json))

);