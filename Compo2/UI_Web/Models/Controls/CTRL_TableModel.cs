namespace UI_Web.Models.Controls
{
    public class CTRL_TableModel : CTRL_BaseModel
    {
        public CTRL_TableModel()
        {
            Columns = "";
        }

        public string Title { get; set; }
        public string Columns { get; set; }
        public string ColumnsDataName { get; set; }
        public string FunctionName { get; set; }

        public int ColumnsCount => Columns.Split(',').Length;

        public string ColumnHeaders
        {
            get
            {
                var Headers = "";
                foreach (var Text in Columns.Split(','))
                {
                    Headers += "<th>" + Text + "</th>";
                }
                return Headers;
            }
        }
    }
}