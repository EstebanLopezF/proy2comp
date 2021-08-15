using DataAccess.DAO;
using DataAccess.Mappers;
using POJOS;
using System.Collections.Generic;

namespace DataAccess
{
    public class Service_Mapper : BS_Mapper, iSQL_Statement, iObjectMapper
    {

        private const string DB_COL_Id = "id";
        private const string DB_COL_Name = "nombre";
        private const string DB_COL_PhoneNumber = "telefono";
        private const string DB_COL_Email = "correo_electronico";
        private const string DB_COL_Contact = "contacto";
        private const string DB_COL_Type = "tipo";
        private const string DB_COL_Description = "descripcion";

        public SQL_Operation GetCreateStatement(Base entity)
        {
            var operation = new SQL_Operation { ProcedureName = "CRE_SERVICIO_SP" };

            var c = (Service)entity;
            operation.AddVarcharParam(DB_COL_Name, c.Name);
            operation.AddVarcharParam(DB_COL_PhoneNumber, c.PhoneNumber);
            operation.AddVarcharParam(DB_COL_Email, c.Email);
            operation.AddVarcharParam(DB_COL_Contact, c.Contact);
            operation.AddVarcharParam(DB_COL_Type, c.Type);
            operation.AddVarcharParam(DB_COL_Description, c.Description);

            return operation;
        }

        public SQL_Operation GetRetriveAllStatement()
        {
            var operation = new SQL_Operation { ProcedureName = "RET_ALL_SERVICIO_SP" };
            return operation;
        }

        public List<Base> BuildObjects(List<Dictionary<string, object>> lstRows)
        {
            var lstResults = new List<Base>();
            
            foreach (var row in lstRows)
            {
                var service = BuildObject(row);
                lstResults.Add(service);
            }
            return lstResults;
        }
        public Base BuildObject(Dictionary<string, object> row)
        {
            var service = new Service
            {
                Id = GetIntValue(row, DB_COL_Id),
                Name = GetStringValue(row, DB_COL_Name),
                PhoneNumber = GetStringValue(row, DB_COL_PhoneNumber),
                Email = GetStringValue(row, DB_COL_Email),
                Contact = GetStringValue(row, DB_COL_Contact),
                Type = GetStringValue(row, DB_COL_Type),
                Description = GetStringValue(row, DB_COL_Description)
            };
            return service;
        }
    }
}