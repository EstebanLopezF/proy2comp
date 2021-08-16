using API_Core;
using POJOS;
using System;
using System.Web.Http;
using API_Web.Models;
using System.Web.Http.Cors;

namespace API_Web.Controllers
{
    [EnableCors(origins: "*", "*", "*")]
    public class ServiceController : ApiController
    {

        Response API_Resp = new Response();

        public IHttpActionResult Post(Service service)
        {
                var mng = new ServiceManager();
                mng.Create(service);

                API_Resp = new Response();
                API_Resp.Message = "El servicio fue registrado de manera exitosa.";

                return Ok(API_Resp);
        }

        public IHttpActionResult Get()
        {
            API_Resp = new Response();
            var mng = new ServiceManager();
            API_Resp.Data = mng.RetrieveAll();

            return Ok(API_Resp);
        }

    }

}
