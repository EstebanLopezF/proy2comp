using System;

namespace POJOS
{
    public class Service : Base
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string PhoneNumber { set; get; }
        public string Email { set; get; }
        public string Contact { set; get; }
        public string Type { set; get; }
        public string Description { set; get; }

        public Service()
        {

        }

        public Service(string[] infoArray)
        {
            Id = Int32.Parse(infoArray[0]);
            Name = infoArray[1];
            PhoneNumber = infoArray[2];
            Email = infoArray[3];
            Contact = infoArray[4];
            Type = infoArray[5];
            Description = infoArray[6];
        }
    }
}
