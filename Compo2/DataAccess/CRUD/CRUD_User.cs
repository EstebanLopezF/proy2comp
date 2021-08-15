using System;
using System.Collections.Generic;
using POJOS;
using DataAccess.DAO;

namespace DataAccess.CRUD
{
    public class CRUD_User : CRUD_Factory
    {
        User_Mapper Mapper;

        public CRUD_User() : base()
        {
            Mapper = new User_Mapper();
            DAO = SQL_DAO.GetInstance();
        }

        public override void Create(Base entity)
        {
            var user = (User)entity;
            var SQL_Operation = Mapper.GetCreateStatement(user);
            DAO.ExecuteProcedure(SQL_Operation);
        }

        public override List<T> RetrieveAll<T>()
        {
            var LST_Users = new List<T>();

            var LST_Result = DAO.ExecuteQueryProcedure(Mapper.GetRetriveAllStatement());
            var dic = new Dictionary<string, object>();
            if (LST_Result.Count > 0)
            {
                var OBJS = Mapper.BuildObjects(LST_Result);
                foreach (var c in OBJS)
                {
                    LST_Users.Add((T)Convert.ChangeType(c, typeof(T)));
                }
            }

            return LST_Users;
        }
    }
}
