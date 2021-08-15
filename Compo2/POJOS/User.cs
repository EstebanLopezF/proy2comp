using System;

namespace POJOS
{
    public class User : Base
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public string LastName { set; get; }
        public string Email { set; get; }
        public string PhoneNumber { set; get; }
        public string Status { set; get; }
        public double ElectronicWalletAmount { set; get; }

        public User()
        {

        }

        public User(string[] infoArray)
        {

            Id = Int32.Parse(infoArray[0]);
            Name = infoArray[1];
            LastName = infoArray[2];
            Email = infoArray[3];
            PhoneNumber = infoArray[4];
            Status = infoArray[5];
            ElectronicWalletAmount = Double.Parse(infoArray[6]);

        }

    }
}


