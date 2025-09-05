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
    public partial class login : Form
    {
        public login()
        {
            InitializeComponent();
            this.StartPosition = FormStartPosition.CenterScreen;
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            string username = txtUsername.Text.Trim();
            string password = txtPassword.Text;

            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password)) 
            {
                MessageBox.Show("Please enter both username andpassword.", "Missing Information",MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }
             bool isValid = username.Equals("admin", StringComparison.OrdinalIgnoreCase) && password == "1234";
            if (isValid)
            {
                MessageBox.Show("Login Successful!", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);    
                Form1 mainForm = new Form1();
                mainForm.StartPosition = FormStartPosition.CenterScreen;
                this.Hide();
                mainForm.Show();
            {
                StartPosition = FormStartPosition.CenterScreen;
            }
            
            }
                else
            {
                MessageBox.Show("Invalid username or password.", "Login Failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
                txtPassword.Clear();
                txtPassword.Focus();
        

            }
        }

        private void txtPassword_TextChanged(object sender, EventArgs e)
        {

        }
    }
}
