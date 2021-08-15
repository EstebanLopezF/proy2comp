using System;
using System.IO;

namespace UI_Web.Models.Controls
{
    public class CTRL_BaseModel
    {
        public string Id { get; set; }
        public string ViewName { get; set; }

        private string ReadFileText()
        {
            string FileName = this.GetType().Name + ".html";

            string Path = AppDomain.CurrentDomain.BaseDirectory + "\\" + System.IO.Path.Combine(@"Models\Controls", FileName);


            string Text = File.ReadAllText(Path);

            return Text;
        }

        public string GetHtml()
        {
            var HTML = ReadFileText();

            foreach (var Prop in this.GetType().GetProperties())
            {
                if (Prop != null)
                {
                    var Value = Prop.GetValue(this, null).ToString();

                    var Tag = string.Format("-#{0}-", Prop.Name);
                    HTML = HTML.Replace(Tag, Value);
                }
            }
            return HTML;
        }
    }
}