using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.DAO
{
    public class SQL_Operation
    {
        public string ProcedureName { get; set; }
        public List<SqlParameter> Parameters { get; set; }

        public SQL_Operation()
        {
            Parameters = new List<SqlParameter>();
        }

        public void AddVarcharParam(string PARAM_Name, string PARAM_Value)
        {
            var PARAM = new SqlParameter("@P_" + PARAM_Name, SqlDbType.VarChar)
            {
                Value = PARAM_Value
            };
            Parameters.Add(PARAM);
        }

        public void AddIntParam(string PARAM_Name, int PARAM_Value)
        {
            var PARAM = new SqlParameter("@P_" + PARAM_Name, SqlDbType.Int)
            {
                Value = PARAM_Value
            };
            Parameters.Add(PARAM);
        }

        public void AddDoubleParam(string PARAM_Name, double PARAM_Value)
        {
            var PARAM = new SqlParameter("@P_" + PARAM_Name, SqlDbType.Decimal)
            {
                Value = PARAM_Value
            };
            Parameters.Add(PARAM);
        }

        public void AddDateTimeParam(string PARAM_Name, DateTime PARAM_Value)
        {
            var PARAM = new SqlParameter("@P_" + PARAM_Name, SqlDbType.DateTime)
            {
                Value = PARAM_Value
            };
            Parameters.Add(PARAM);
        }
    }
}
