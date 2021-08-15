using DataAccess.DAO;
using POJOS;

namespace DataAccess.Mappers
{
    public interface iSQL_Statement
    {
        SQL_Operation GetCreateStatement(Base bs);
        SQL_Operation GetRetriveStatement(Base bs);
        SQL_Operation GetRetriveAllStatement();
        SQL_Operation GetUpdateStatement(Base bs);
        SQL_Operation GetDeleteStatement(Base bs);
    }
}
