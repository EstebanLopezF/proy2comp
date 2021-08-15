using System.Web;
using System.Web.Mvc;
using UI_Web.Models.Controls;

namespace Web_UI.Models.Helpers
{
    public static class ControlExtensions
    {
        public static HtmlString CTRL_Table(this HtmlHelper HTML, string ViewName, string ID, string Title,
            string ColumnsTitle, string ColumnsDataName, string OnSelectFunction)
        {
            var CTRL = new CTRL_TableModel
            {
                ViewName = ViewName,
                Id = ID,
                Title = Title,
                Columns = ColumnsTitle,
                ColumnsDataName = ColumnsDataName,
                FunctionName = OnSelectFunction
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_Input(this HtmlHelper HTML, string ID, string Type, string Label, string PlaceHolder = "", string ColumnDataName = "")
        {
            var CTRL = new CTRL_InputModel
            {
                Id = ID,
                Type = Type,
                Label = Label,
                PlaceHolder = PlaceHolder,
                ColumnDataName = ColumnDataName
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_ShowImageModel(this HtmlHelper HTML, string ID, string Type, string Label, string Src, string With, string Height, string PlaceHolder = "", string ColumnDataName = "")
        {
            var CTRL = new CTRL_ShowImageModel
            {
                Id = ID,
                Type = Type,
                Label = Label,
                PlaceHolder = PlaceHolder,
                ColumnDataName = ColumnDataName,
                Src = Src,
                With = With,
                Height = Height
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_Button(this HtmlHelper HTML, string ViewName, string ID, string Label, string OnClickFunction = "", string ButtonType = "primary")
        {
            var CTRL = new CTRL_ButtonModel
            {
                ViewName = ViewName,
                Id = ID,
                Label = Label,
                FunctionName = OnClickFunction,
                ButtonType = ButtonType
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_Dropdown(this HtmlHelper HTML, string ID, string Label, string ID_List)
        {
            var CTRL = new CTRL_DropdownModel()

            {
                Id = ID,
                Label = Label,
                ID_List = ID_List
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_LoadFile(this HtmlHelper HTML, string ViewName, string ID, string Label, string GetFileAddressFunction, string Accept)
        {
            var CTRL = new CTRL_LoadFile()

            {
                ViewName = ViewName,
                Id = ID,
                Label = Label,
                FunctionName = GetFileAddressFunction,
                Accept = Accept
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_DowwnloadFile(this HtmlHelper HTML, string ID, string ColumnDataName = "")
        {
            var CTRL = new CTRL_DownloadFile
            {
                Id = ID,
                ColumnDataName = ColumnDataName
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_HoursList(this HtmlHelper HTML, string Label, string ID_List, string HoursRangeGetter, string Prefix)
        {
            var CTRL = new CTRL_HoursList
            {
                Id = ID_List,
                Label = Label,
                ID_List = ID_List,
                HoursRangeGetter = HoursRangeGetter,
                Prefix = Prefix
            };

            return new HtmlString(CTRL.GetHtml());
        }

        public static HtmlString CTRL_DaysList(this HtmlHelper HTML, string Label, string ID_Container, string DaysGetter, string DaysSetter)
        {
            var CTRL = new CTRL_DaysList
            {
                Id = ID_Container,
                Label = Label,
                ID_Container = ID_Container,
                DaysGetter = DaysGetter,
                DaysSetter = DaysSetter
            };

            return new HtmlString(CTRL.GetHtml());
        }
    }
}