using MetroFramework.Forms;
using AForge.Video.DirectShow;
using AForge.Video;
using System.Drawing;
using System.Windows.Forms;
using ZXing;
using System;
using System.Net.Http;
using POJOS;
using System.Threading.Tasks;
using API_Web.Models;
using Newtonsoft.Json;

namespace Desktop_UI
{
    public partial class Main : MetroForm
    {
        static HttpClient HttpClient = new HttpClient();
        static string URL_Reservation = "https://localhost:44346/api/reservation/";

        FilterInfoCollection FilterInfoCollection;
        VideoCaptureDevice CaptureDevice;
        public Main()
        {
            InitializeComponent();
        }

        private void Main_Load(object Sender, EventArgs e)
        {
            /*this.components.SetStyle(this);*/
            FilterInfoCollection = new FilterInfoCollection(FilterCategory.VideoInputDevice);
            foreach (FilterInfo FilterInfo in FilterInfoCollection)
            {
                ComboOptions.Items.Add(FilterInfo.Name);
            }
            ComboOptions.SelectedIndex = 0;
        }

        private void btnScan_Click(object sender, EventArgs e)
        {
            CaptureDevice = new VideoCaptureDevice(FilterInfoCollection[ComboOptions.SelectedIndex].MonikerString);
            CaptureDevice.NewFrame += CaptureDecive_NewFrame;
            CaptureDevice.Start();
            Timer.Start();
        }

        private void CaptureDecive_NewFrame(object sender, NewFrameEventArgs eventArgs)
        {
            VideoBox.Image = (Bitmap)eventArgs.Frame.Clone();
        }

        private void Main_Closing(object Sender, FormClosingEventArgs E)
        {
            if (CaptureDevice.IsRunning) CaptureDevice.Stop();
        }

        private async void Timer_Tick(object sender, EventArgs e)
        {
            if (VideoBox.Image != null)
            {
                BarcodeReader BarCodeReader = new BarcodeReader();
                Result result = BarCodeReader.Decode((Bitmap)VideoBox.Image);

                if (result != null)
                {
                    setConfMessage("Danos un momento mientras validamos tus datos...");
                    Timer.Stop();
                    if (CaptureDevice.IsRunning) CaptureDevice.Stop();

                    Reservation FullReservation = await GetAsync(URL_Reservation + result.ToString());
                    
                    if (FullReservation == null)
                    {
                        setConfMessage("Hubo un error al cargar la información de su reserva.");
                    } else
                    {
                        FullReservation.State = Variables.Reservation_Active;
                        await PutAsync(FullReservation);
                        setConfMessage("Su reservación ha sido activada.");
                    }
                }
            }

        }

        public async Task<Reservation> GetAsync(string FinalAPIURL)
        {
            Reservation Reservation = null;

            HttpResponseMessage RES = await HttpClient.GetAsync(FinalAPIURL);

            if (RES.IsSuccessStatusCode)
            {
                Response Result = await RES.Content.ReadAsAsync<Response>();
                Reservation = JsonConvert.DeserializeObject<Reservation>(Result.Data.ToString());
            }

            return Reservation;
        }

        public async Task PutAsync(Reservation Reservation)
        {
            HttpResponseMessage Response = await HttpClient.PutAsJsonAsync(URL_Reservation, Reservation);
            Response.EnsureSuccessStatusCode();
        }

        public void setConfMessage(string Message)
        {
            txtConfirmation.Text = Message;
        }
    }
}
