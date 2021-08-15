using Newtonsoft.Json;
using POJOS;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;

namespace Exceptions
{
    public class ExceptionManager
    {
        public string Path = "";
        private static ExceptionManager Instance;
        private static Dictionary<int, ApplicationMessage> Messages = new Dictionary<int, ApplicationMessage>();

        private ExceptionManager()
        {
            LoadMessages();
            Path = ConfigurationManager.AppSettings.Get("LogPath");
        }

        public static ExceptionManager GetInstance()
        {
            if (Instance == null)
                Instance = new ExceptionManager();

            return Instance;
        }

        public void HandleException(Exception ex)
        {
            BussinessException BS_Exception;

            if (ex.GetType() == typeof(BussinessException))
            {
                BS_Exception = (BussinessException)ex;
                BS_Exception.ExceptionDetails = GetMessage(BS_Exception).Message;
            }
            else
            {
                BS_Exception = new BussinessException(0, ex);
            }

            LogBussinessException(BS_Exception);
        }

        private void LogBussinessException(BussinessException B_EX)
        {
            var Today = DateTime.Now.ToString("yyyyMMdd_HH");
            var LogName = Path + Today + "_" + "log.txt";

            var Message = B_EX.ExceptionDetails + "\n" + B_EX.StackTrace + "\n";

            using (StreamWriter Writer = File.AppendText(LogName))
            {
                Log(Message, Writer);
            }

            B_EX.AppMessage = GetMessage(B_EX);

            throw B_EX;
        }

        public ApplicationMessage GetMessage(BussinessException B_Exception)
        {

            var AppMessage = new ApplicationMessage
            {
                Message = "Message not found!"
            };

            if (Messages.ContainsKey(B_Exception.ID_Exception))
                AppMessage = Messages[B_Exception.ID_Exception];

            return AppMessage;

        }

        private void LoadMessages()
        {
            List<ApplicationMessage> ErrorMessages;

            string path = AppDomain.CurrentDomain.BaseDirectory;
            using (StreamReader FileReader = new StreamReader(AppDomain.CurrentDomain.BaseDirectory + @"\..\Exceptions\Messages.json"))
            {
                ErrorMessages = JsonConvert.DeserializeObject<List<ApplicationMessage>>(FileReader.ReadToEnd());
            }

            ErrorMessages.ForEach(each => {
                Messages.Add(each.Id, each);
            });
        }

        private void Log(string LogMessage, TextWriter Writer)
        {
            Writer.Write("\r\nLog Entry : ");
            Writer.WriteLine("{0} {1}", DateTime.Now.ToLongTimeString(),
                DateTime.Now.ToLongDateString());
            Writer.WriteLine("  :");
            Writer.WriteLine("  :{0}", LogMessage);
            Writer.WriteLine("-------------------------------");
        }
    }
}
