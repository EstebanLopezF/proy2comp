using DataAccess.DAO;
using DataAccess.Mappers;
using POJOS;
using System.Collections.Generic;

namespace DataAccess
{
    public class User_Mapper : BS_Mapper, iSQL_Statement, iObjectMapper
    {

        private const string DB_COL_Id = "cedula";
        private const string DB_COL_Name = "nombre";
        private const string DB_COL_LastName = "apellido";
        private const string DB_COL_Email = "correo_electronico";
        private const string DB_COL_PhoneNumber = "telefono";
        private const string DB_COL_Status = "estado";
        private const string DB_COL_ElectronicWalletAmount = "monto_billetera_electronica";

        public SQL_Operation GetCreateStatement(Base entity)
        {
            var operation = new SQL_Operation { ProcedureName = "CRE_USUARIO_SP" };

            var c = (User)entity;
            operation.AddIntParam(DB_COL_Id, c.Id);
            operation.AddVarcharParam(DB_COL_Name, c.Name);
            operation.AddVarcharParam(DB_COL_LastName, c.LastName);
            operation.AddVarcharParam(DB_COL_Email, c.Email);
            operation.AddVarcharParam(DB_COL_PhoneNumber, c.PhoneNumber);
            operation.AddVarcharParam(DB_COL_Status, c.Status);
            operation.AddDoubleParam(DB_COL_ElectronicWalletAmount, c.ElectronicWalletAmount);

            return operation;
        }

        public SQL_Operation GetRetriveStatement(Base entity)
        {
            var operation = new SQL_Operation { ProcedureName = "RET_USUARIO_SP" };

            var c = (User)entity;
            operation.AddIntParam(DB_COL_Id, c.Id);

            return operation;
        }

        public SQL_Operation GetRetriveAllStatement()
        {
            var operation = new SQL_Operation { ProcedureName = "RET_ALL_USUARIO_SP" };
            return operation;
        }

        public SQL_Operation GetUpdateStatement(Base entity)
        {
            var operation = new SQL_Operation { ProcedureName = "UPD_USUARIO_SP" };

            var c = (User)entity;
            operation.AddIntParam(DB_COL_Id, c.Id);
            operation.AddVarcharParam(DB_COL_Name, c.Name);
            operation.AddVarcharParam(DB_COL_LastName, c.LastName);
            operation.AddVarcharParam(DB_COL_Email, c.Email);
            operation.AddVarcharParam(DB_COL_PhoneNumber, c.PhoneNumber);
            operation.AddVarcharParam(DB_COL_Status, c.Status);
            operation.AddDoubleParam(DB_COL_ElectronicWalletAmount, c.ElectronicWalletAmount);

            return operation;
        }

        public SQL_Operation GetDeleteStatement(Base entity)
        {
            var operation = new SQL_Operation { ProcedureName = "DEL_USUARIO_SP" };

            var c = (User)entity;
            operation.AddIntParam(DB_COL_Id, c.Id);
            return operation;
        }

        public List<Base> BuildObjects(List<Dictionary<string, object>> lstRows)
        {
            var lstResults = new List<Base>();
            
            foreach (var row in lstRows)
            {
                var user = BuildObject(row);
                lstResults.Add(user);
            }
            return lstResults;
        }
        public Base BuildObject(Dictionary<string, object> row)
        {
            var user = new User
            {
                Id = GetIntValue(row, DB_COL_Id),
                Name = GetStringValue(row, DB_COL_Name),
                LastName = GetStringValue(row, DB_COL_LastName),
                Email = GetStringValue(row, DB_COL_Email),
                PhoneNumber = GetStringValue(row, DB_COL_PhoneNumber),
                Status = GetStringValue(row, DB_COL_Status),
                ElectronicWalletAmount = GetDoubleValue(row, DB_COL_ElectronicWalletAmount)
            };
            return user;
        }
    }
}