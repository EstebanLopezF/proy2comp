using API_Web.Models;

namespace API
{
    public class Helper
    {
        public void ClearResponse(Response RES)
        {
            RES.Message = null;
            RES.Data = null;
        }
    }
}