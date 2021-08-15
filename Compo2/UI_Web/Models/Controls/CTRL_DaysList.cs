
namespace UI_Web.Models.Controls
{
    public class CTRL_DaysList : CTRL_BaseModel
    {
        public string Label { get; set; }
        public string ID_Container { get; set; }
        public string DaysGetter { get; set; }
        public string DaysSetter { get; set; }

        public CTRL_DaysList()
        {
            ViewName = "";
        }
    }
}