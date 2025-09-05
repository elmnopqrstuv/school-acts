using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class clickme : Form
    {
        public clickme()
        {
            InitializeComponent();
        }

        private void play_Click(object sender, EventArgs e)
        {
            string f = "C:\\Users\\pc\\Desktop\\Mercado POS\\bleh.mp4";
            axWindowsMediaPlayer1.URL = f;
        }
    }
}
