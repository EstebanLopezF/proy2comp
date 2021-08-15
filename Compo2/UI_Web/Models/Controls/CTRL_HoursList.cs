using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UI_Web.Models.Controls
{
    public class CTRL_HoursList : CTRL_BaseModel
    {
        public string Label { get; set; }
        public string ID_List { get; set; }
        public string HoursRangeGetter { get;  set; }
        public string Prefix { get;  set; }

        public CTRL_HoursList()
        {
            ViewName = "";
        }
    }
}