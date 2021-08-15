using POJOS;
using System;
using System.Configuration;
using System.Net.Http;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types.Enums;
using Newtonsoft.Json;
using API_Web.Models;
using System.Threading.Tasks;

namespace Telegram_Bot
{
    class Program
    {
        private static readonly TelegramBotClient Bot = new TelegramBotClient(ConfigurationManager.ConnectionStrings["telegram_TOKET_API"].ToString());
        private static long ID;
        private static string WelcomeMessage;

        private static HttpClient HttpClient = new HttpClient();
        private static string URL_Reservation = "https://localhost:44346/api/";

        public static void Main(string[] args)
        {
            SendMessage(WelcomeMessage);
            Bot.OnMessage += bot_OnMessage;
            Bot.OnMessageEdited += bot_OnMessage;

            Bot.StartReceiving();
            Console.ReadLine();
        }

        private static void bot_OnMessage(object sender, MessageEventArgs e)
        {
            ID = e.Message.Chat.Id;
            WelcomeMessage = "Bienvenido al bot de ayuda de Work Together, ingresá el codigo de tu reservación para proceder\n";

            if (e.Message.Type == MessageType.Text)
            {
                processMessage(e.Message.Text);
            }
        }


        private static void SendMessage(string message)
        {
            Bot.SendTextMessageAsync(ID, message);

        }

        private static void processMessage(string Message)
        {
            if (Message == "/start")
            {
                SendMessage(WelcomeMessage);
            }
            else if (isCodeValid(Message))
            {
                SendMessage("¡Perfecto! Vamos a validar la información que nos brindaste y ya te compartimos los detalles que encontremos.");
                ProcessReservationRequest(Message);
            } else
            {
                SendMessage(WelcomeMessage);
                SendMessage("La opción ingresada es inválida, por favor intente de nuevo");
            }
        }

        private static bool isCodeValid(string Code)
        {
            if (Code.Length == 6 && isOnlyNumbers(Code))
                return true;
            return false;
        }

        private static bool isOnlyNumbers(string Code)
        {
            foreach (char c in Code)
            {
                if (c < '0' || c > '9')
                    return false;
            }
            return true;
        }

        private async static void ProcessReservationRequest(string Code)
        {
            Reservation Reservation = (Reservation) await GetAsync("reservation", Code);

            if (Reservation != null)
            {
                var Workspace_ID = Reservation.IdWorkspace.ToString();
                Workspace Workspace = (Workspace) await GetAsync("workspace", Workspace_ID);

                if (Workspace != null)
                {
                    var Property_ID = Workspace.PropetiesId.ToString();
                    Property Property = (Property) await GetAsync("property", Property_ID);

                    if (Property != null)
                    {
                        SendMessage($"La reservación que consultaste, se encuentra en el espacio de trabajo {Workspace.Name}, y se ubica en {Property.LocationDetails}.");
                        SendMessage($"Podés ver a ubicación en el siguiente enlace 👉 https://www.google.com/maps/place/{Property.Location}");
                    }
                }
            }
        }

        private static async Task<Base> GetAsync(string entity, string ID)
        {
            Base Data = null;

            HttpResponseMessage RES = await HttpClient.GetAsync(URL_Reservation + entity + "/" + ID);

            if (RES.IsSuccessStatusCode)
            {
                Response Result = await RES.Content.ReadAsAsync<Response>();

                switch (entity)
                {
                    case "reservation":
                        Data = JsonConvert.DeserializeObject<Reservation>(Result.Data.ToString());
                        break;

                    case "workspace":
                        Data = JsonConvert.DeserializeObject<Workspace>(Result.Data.ToString());
                        break;

                    case "property":
                        Data = JsonConvert.DeserializeObject<Property>(Result.Data.ToString());
                        break;

                }
            }

            return Data;
        }
    }
}
