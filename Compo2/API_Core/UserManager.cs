using DataAccess.CRUD;
using POJOS;
using System;
using System.Collections.Generic;

namespace API_Core
{
    public class UserManager : BaseManager
    {

        private CRUD_User CRUD_User;

        /// <summary>
        /// Constructor of UserMananger that creates a CRUD.
        /// </summary>
        public UserManager()
        {
            CRUD_User = new CRUD_User();
        }

        /// <summary>
        /// API Core entity that receives an User that contains all the required information to be created.
        /// The method checks if the user is compliant before call the CRUD to create it.
        /// </summary>
        /// <param name="User">User entity with information required to be created</param>
        /// <returns>void</returns>
        public void Create(User user)
        {
                CRUD_User.Create(user);
        }

        /// <summary>
        /// API Core entity that calls CRUD method to retrive all the users.
        /// </summary>
        /// <param name="User">User entity with basic information to be recognized</param>
        /// <returns>List of users with all its information</returns>
        public List<User> RetrieveAll()
        {
            return CRUD_User.RetrieveAll<User>();
        }
    
    }
}
