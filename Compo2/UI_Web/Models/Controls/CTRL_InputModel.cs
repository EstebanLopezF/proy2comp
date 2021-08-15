namespace UI_Web.Models.Controls
{
    public class CTRL_InputModel : CTRL_BaseModel
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public string PlaceHolder { get; set; }
        public string ColumnDataName { get; set; }

        public CTRL_InputModel()
        {
            ViewName = "";
        }
    }
}