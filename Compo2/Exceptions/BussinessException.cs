using POJOS;
using System;

namespace Exceptions
{
    public class BussinessException : Exception
    {
        public int ID_Exception;
        public string ExceptionDetails { get; set; }
        public ApplicationMessage AppMessage { get; set; }

        public BussinessException() { }
        public BussinessException(int ID_Exception)
        {
            this.ID_Exception = ID_Exception;
        }
        public BussinessException(int ID_Exception, Exception InnerException)
        {
            this.ID_Exception = ID_Exception;
            ExceptionDetails = InnerException.Message;
        }
    }
}
