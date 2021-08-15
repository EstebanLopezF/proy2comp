using System;
using System.Collections.Generic;
using POJOS;
using DataAccess.DAO;

namespace DataAccess.CRUD
{
    public class CRUD_Service : CRUD_Factory
    {
        Service_Mapper Mapper;

        public CRUD_Service() : base()
        {
            Mapper = new Service_Mapper();
            DAO = SQL_DAO.GetInstance();
        }

        public override void Create(Base entity)
        {
            var service = (Service)entity;
            var SQL_Operation = Mapper.GetCreateStatement(service);
            DAO.ExecuteProcedure(SQL_Operation);
        }

        public override List<T> RetrieveAll<T>()
        {
            var LST_Services = new List<T>();

            var LST_Result = DAO.ExecuteQueryProcedure(Mapper.GetRetriveAllStatement());
            var dic = new Dictionary<string, object>();
            if (LST_Result.Count > 0)
            {
                var OBJS = Mapper.BuildObjects(LST_Result);
                foreach (var c in OBJS)
                {
                    LST_Services.Add((T)Convert.ChangeType(c, typeof(T)));
                }
            }

            return LST_Services;
        }
    }
}
