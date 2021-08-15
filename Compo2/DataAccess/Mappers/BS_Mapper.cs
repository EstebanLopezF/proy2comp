using System;
using System.Collections.Generic;

namespace DataAccess
{
    public abstract class BS_Mapper
    {
        protected string GetStringValue(Dictionary<string, object> DIC, string ATT_Name)
        {
            var Val = DIC[ATT_Name];
            if (DIC.ContainsKey(ATT_Name) && Val is string)
                return (string)Val;

            return "";
        }

        protected int GetIntValue(Dictionary<string, object> DIC, string ATT_Name)
        {
            var Val = DIC[ATT_Name];
            if (DIC.ContainsKey(ATT_Name) && (Val is int || Val is decimal))
                return (int)DIC[ATT_Name];

            return -1;
        }

        protected double GetDoubleValue(Dictionary<string, object> DIC, string ATT_Name)
        {
            var Val = DIC[ATT_Name];
            if (DIC.ContainsKey(ATT_Name) && Val is double)
                return (double)DIC[ATT_Name];

            return -1;
        }

        protected DateTime GetDateValue(Dictionary<string, object> DIC, string ATT_Name)
        {
            var Val = DIC[ATT_Name];
            if (DIC.ContainsKey(ATT_Name) && Val is DateTime)
                return (DateTime)DIC[ATT_Name];

            return DateTime.Now;
        }
    }
}
