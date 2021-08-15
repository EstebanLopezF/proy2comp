using DataAccess.DAO;
using POJOS;
using System.Collections.Generic;

namespace DataAccess.CRUD
{
    public abstract class CRUD_Factory
    {
        protected SQL_DAO DAO;

        public abstract void Create(Base bs);
        public abstract List<T> RetrieveAll<T>();
    }
}
