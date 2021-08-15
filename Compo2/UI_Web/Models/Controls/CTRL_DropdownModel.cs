using Newtonsoft.Json;
using POJOS.Entities_POJO;
using System.Collections.Generic;
using System.Net;

namespace UI_Web.Models.Controls
{
    public class CTRL_DropdownModel : CTRL_BaseModel
    {
        public string Label { get; set; }
        public string ID_List { get; set; }
        public string LST_Options
        {
            get
            {
                var HTML_Options = "";
                var LST = LoadOptions();

                foreach (var option in LST) {
                    HTML_Options += $"<option value='{option.Value}'>{option.Description}</option>";
                };

                return HTML_Options;
            }
            set { }
        }

        private string URL_API_LST = "https://localhost:44346/api/list/";
    
        private List<OptionList> LoadOptions()
        {
            var client = new WebClient();
            var response = client.DownloadString(URL_API_LST + ID_List);
            var options = JsonConvert.DeserializeObject<List<OptionList>>(response);
            return options;
        }

        public CTRL_DropdownModel()
        {
            ViewName = "";
        }
    }
}