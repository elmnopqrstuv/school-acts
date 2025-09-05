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
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void inventoryToolStripMenuItem_Click(object sender, EventArgs e)
        {
            inventory forko4 = new inventory();
            forko4.MdiParent = this;
            forko4.Show();
        }

        private void salesToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Sales forko2 = new Sales();
            forko2.MdiParent = this;
            forko2.Show();
        }


        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            about forko5 = new about();
            forko5.MdiParent = this;
            forko5.Show();
        }

        private void aboutMeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Creator forko3 = new Creator();
            forko3.MdiParent = this;
            forko3.Show();
        }

        private void clickMeeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            clickme forko6 = new clickme();
            forko6.MdiParent = this;
            forko6.Show();
        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
