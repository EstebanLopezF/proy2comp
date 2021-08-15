using DataAccess.CRUD;
using POJOS;
using System;
using System.Collections.Generic;

namespace API_Core
{
    public class ServiceManager : BaseManager
    {

        private CRUD_Service CRUD_Service;

        public ServiceManager()
        {
            CRUD_Service = new CRUD_Service();
        }

        public void Create(Service service)
        {
                CRUD_Service.Create(service);
        }

        public List<Service> RetrieveAll()
        {
            return CRUD_Service.RetrieveAll<Service>();
        }
    
    }
}
