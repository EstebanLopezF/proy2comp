namespace UI_Web.Models.Controls
{
    public class CTRL_ShowImageModel : CTRL_BaseModel
    {
        public string Type { get; set; }
        public string Label { get; set; }
        public string PlaceHolder { get; set; }
        public string ColumnDataName { get; set; }
        public string Src { get; set; }
        public string With { get; set; }
        public string Height { get; set; }

        public CTRL_ShowImageModel()
        {
            ViewName = "";
        }
    }
}