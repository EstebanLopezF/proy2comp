using DataAccess.DAO;
using POJOS;

namespace DataAccess.Mappers
{
    public interface iSQL_Statement
    {
        SQL_Operation GetCreateStatement(Base bs);
        SQL_Operation GetRetriveAllStatement();
    }
}
