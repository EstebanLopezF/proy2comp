using API_Core;
using POJOS;
using System;
using System.Web.Http;
using API_Web.Models;

namespace API_Web.Controllers
{

    public class UserController : ApiController
    {

        Response API_Resp = new Response();

        public IHttpActionResult Post(User user)
        {
                var mng = new UserManager();
                mng.Create(user);

                API_Resp = new Response();
                API_Resp.Message = "El usuario fue registrado de manera exitosa.";

                return Ok(API_Resp);
        }

        public IHttpActionResult Get()
        {
            API_Resp = new Response();
            var mng = new UserManager();
            API_Resp.Data = mng.RetrieveAll();

            return Ok(API_Resp);
        }

    }

}
