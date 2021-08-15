namespace UI_Web.Models.Controls
{
    public class CTRL_LoadFile : CTRL_BaseModel
    {
        public string Label { get; set; }
        public string FunctionName { get; set; }
        public string Accept { get; set; }

        public CTRL_LoadFile()
        {
            ViewName = "";
        }
    }
}