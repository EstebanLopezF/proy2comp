using POJOS;
using System.Collections.Generic;

namespace DataAccess.Mappers
{
    public interface iObjectMapper
    {
        List<Base> BuildObjects(List<Dictionary<string, object>> LST_Rows);
        Base BuildObject(Dictionary<string, object> Row);
    }
}
