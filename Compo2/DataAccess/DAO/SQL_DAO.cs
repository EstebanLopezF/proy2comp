using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace DataAccess.DAO
{
    public class SQL_DAO
    {
        private string ConnectionString = "";

        private static SQL_DAO Instance;

        private SQL_DAO()
        {
            ConnectionString = ConfigurationManager.ConnectionStrings["CONN_STR"].ConnectionString;
        }

        public static SQL_DAO GetInstance()
        {
            if (Instance == null)
            {
                Instance = new SQL_DAO();
            }

            return Instance;
        }

        public void ExecuteProcedure(SQL_Operation SQL_Operation)
        {
            using (var CONN = new SqlConnection(ConnectionString))
            {
                using (var Command = new SqlCommand(SQL_Operation.ProcedureName, CONN)
                {
                    CommandType = CommandType.StoredProcedure
                })
                {
                    foreach (var param in SQL_Operation.Parameters)
                    {
                        Command.Parameters.Add(param);
                    }

                    CONN.Open();
                    Command.ExecuteNonQuery();
                }
            }
        }

        public List<Dictionary<string, object>> ExecuteQueryProcedure(SQL_Operation SQL_Operation)
        {
            var LST_Result = new List<Dictionary<string, object>>();

            using (var CONN = new SqlConnection(ConnectionString))
            {
                using (var Command = new SqlCommand(SQL_Operation.ProcedureName, CONN)
                {
                    CommandType = CommandType.StoredProcedure
                })
                {
                    foreach (var param in SQL_Operation.Parameters)
                    {
                        Command.Parameters.Add(param);
                    }

                    CONN.Open();
                    var Reader = Command.ExecuteReader();
                    if (Reader.HasRows)
                    {
                        while (Reader.Read())
                        {
                            var Dict = new Dictionary<string, object>();
                            for (var lp = 0; lp < Reader.FieldCount; lp++)
                            {
                                Dict.Add(Reader.GetName(lp), Reader.GetValue(lp));
                            }
                            LST_Result.Add(Dict);
                        }
                    }
                }
            }

            return LST_Result;
        }
    }
}
