using System.IO;
using System.Web;
using System.Web.Mvc;

namespace UI_Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [ActionName("Upload")]
        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            if (file != null)
            {
                string path = Server.MapPath("~/Content/Files/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                file.SaveAs(path + Path.GetFileName(file.FileName));
                ViewBag.Message = "File uploaded successfully.";
            }

            return View();
        }

        public ActionResult vRegisterProperty()
        {
            return View();
        }

        public ActionResult vListProperties()
        {
            return View();
        }

        public ActionResult vRegisterWorkspace()
        {
            return View();
        }

        public ActionResult vListWorkspace()
        {
            return View();
        }

        public ActionResult vRegisterUser()
        {
            return View();
        }

        public ActionResult vProfileUser()
        {
            return View();
        }

        public ActionResult vListUser()
        {
            return View();
        }


        public ActionResult vLogin()
        {
            return View();
        }

        public ActionResult vListRegistrationRequest()
        {
            return View();
        }

        public ActionResult vListPaymentMethod()
        {
            return View();
        }

        public ActionResult vRetPassword()
        {
            return View();
        }

        public ActionResult vActivateUser()
        {
            return View();
        }

        public ActionResult vModifyPassword()
        {
            return View();
        }

        public ActionResult vListBill()
        {
            return View();
        }

        public ActionResult vListRentProfits()
        {
            return View();
        }

        public ActionResult vRefound() 
        {
            return View();
        }

        public ActionResult vVerification()
        {
            return View();
        }

        public ActionResult vBlockedAccount()
        {
            return View();
        }

        public ActionResult vListReservation()
        {
            return View();
        }

        public ActionResult vRegisterReservation()
        {
            return View();
        }
    }
}