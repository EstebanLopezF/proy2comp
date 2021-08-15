namespace UI_Web.Models.Controls
{
    public class CTRL_ButtonModel : CTRL_BaseModel
    {
        public string Label { get; set; }
        public string FunctionName { get; set; }
        public string ButtonType { get; set; }

        public CTRL_ButtonModel()
        {
            ViewName = "";
        }
    }
}