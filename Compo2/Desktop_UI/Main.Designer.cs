
namespace Desktop_UI
{
    partial class Main
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.txtDescription = new MetroFramework.Controls.MetroLabel();
            this.VideoBox = new System.Windows.Forms.PictureBox();
            this.ComboOptions = new MetroFramework.Controls.MetroComboBox();
            this.btnScan = new MetroFramework.Controls.MetroButton();
            this.Timer = new System.Windows.Forms.Timer(this.components);
            this.txtConfirmation = new MetroFramework.Controls.MetroLabel();
            ((System.ComponentModel.ISupportInitialize)(this.VideoBox)).BeginInit();
            this.SuspendLayout();
            // 
            // txtDescription
            // 
            this.txtDescription.AutoSize = true;
            this.txtDescription.Location = new System.Drawing.Point(278, 80);
            this.txtDescription.Name = "txtDescription";
            this.txtDescription.Size = new System.Drawing.Size(243, 19);
            this.txtDescription.TabIndex = 0;
            this.txtDescription.Text = "Escanee el código QR de su reservación";
            // 
            // VideoBox
            // 
            this.VideoBox.BackColor = System.Drawing.SystemColors.ActiveCaption;
            this.VideoBox.Location = new System.Drawing.Point(254, 203);
            this.VideoBox.Name = "VideoBox";
            this.VideoBox.Size = new System.Drawing.Size(292, 200);
            this.VideoBox.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.VideoBox.TabIndex = 2;
            this.VideoBox.TabStop = false;
            // 
            // ComboOptions
            // 
            this.ComboOptions.Cursor = System.Windows.Forms.Cursors.Hand;
            this.ComboOptions.FormattingEnabled = true;
            this.ComboOptions.ItemHeight = 23;
            this.ComboOptions.Location = new System.Drawing.Point(310, 136);
            this.ComboOptions.Name = "ComboOptions";
            this.ComboOptions.Size = new System.Drawing.Size(180, 29);
            this.ComboOptions.TabIndex = 3;
            // 
            // btnScan
            // 
            this.btnScan.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnScan.Location = new System.Drawing.Point(362, 444);
            this.btnScan.Name = "btnScan";
            this.btnScan.Size = new System.Drawing.Size(76, 23);
            this.btnScan.Style = MetroFramework.MetroColorStyle.Orange;
            this.btnScan.TabIndex = 4;
            this.btnScan.Text = "Comenzar";
            this.btnScan.Theme = MetroFramework.MetroThemeStyle.Light;
            this.btnScan.Click += new System.EventHandler(this.btnScan_Click);
            // 
            // Timer
            // 
            this.Timer.Interval = 1000;
            this.Timer.Tick += new System.EventHandler(this.Timer_Tick);
            // 
            // txtConfirmation
            // 
            this.txtConfirmation.AutoSize = true;
            this.txtConfirmation.Location = new System.Drawing.Point(323, 496);
            this.txtConfirmation.Name = "txtConfirmation";
            this.txtConfirmation.Size = new System.Drawing.Size(0, 0);
            this.txtConfirmation.TabIndex = 5;
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 537);
            this.Controls.Add(this.txtConfirmation);
            this.Controls.Add(this.btnScan);
            this.Controls.Add(this.ComboOptions);
            this.Controls.Add(this.VideoBox);
            this.Controls.Add(this.txtDescription);
            this.ForeColor = System.Drawing.Color.OrangeRed;
            this.Name = "Main";
            this.Text = "WORK-TOGETHER";
            this.TextAlign = System.Windows.Forms.VisualStyles.HorizontalAlign.Center;
            this.Load += new System.EventHandler(this.Main_Load);
            ((System.ComponentModel.ISupportInitialize)(this.VideoBox)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private MetroFramework.Controls.MetroLabel txtDescription;
        private System.Windows.Forms.PictureBox VideoBox;
        private MetroFramework.Controls.MetroComboBox ComboOptions;
        private MetroFramework.Controls.MetroButton btnScan;
        private System.Windows.Forms.Timer Timer;
        private MetroFramework.Controls.MetroLabel txtConfirmation;
    }
}

