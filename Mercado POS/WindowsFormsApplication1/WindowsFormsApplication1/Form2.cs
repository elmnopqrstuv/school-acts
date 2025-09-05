using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace WindowsFormsApplication1
{
    public partial class Sales : Form
    {
        public Sales()
        {
            InitializeComponent();

        }

        private void Sales_Load(object sender, EventArgs e)
        {
            chart1.ChartAreas["ChartArea1"].BackColor = Color.Transparent;
            chart1.Legends["Legend1"].BackColor = Color.Transparent;
            SetupChart();
        }


        private void SetupChart()
        {

            chart1.BackColor = System.Drawing.Color.Transparent;
            chart1.ChartAreas[0].BackColor = System.Drawing.Color.Transparent;
            
            chart1.Series.Clear();
            chart1.Titles.Clear();

            chart1.Titles.Add("Monthly Sales Trends by Gender Category");


            Series apparelSales = new Series("Man");
            apparelSales.ChartType = SeriesChartType.Line;
            apparelSales.BorderWidth = 3; 
            
            apparelSales.Points.AddXY("Jan", 0);
            apparelSales.Points.AddXY("Feb", 0);
            apparelSales.Points.AddXY("Mar", 0);
            apparelSales.Points.AddXY("Apr", 25);
            apparelSales.Points.AddXY("May", 70);
            apparelSales.Points.AddXY("Jun", 75);
            apparelSales.Points.AddXY("Jul", 80);
            apparelSales.Points.AddXY("Aug", 85);
            apparelSales.Points.AddXY("Sep", 85);
            apparelSales.Points.AddXY("Oct", 90);
            apparelSales.Points.AddXY("Nov", 100);
            apparelSales.Points.AddXY("Dec", 110);
            chart1.Series.Add(apparelSales);

            Series electronicsSales = new Series("Women");
            electronicsSales.ChartType = SeriesChartType.Line;
            electronicsSales.BorderWidth = 3;
            electronicsSales.Points.AddXY("Jan", 5);
            electronicsSales.Points.AddXY("Feb", 5);
            electronicsSales.Points.AddXY("Mar", 25);
            electronicsSales.Points.AddXY("Apr", 50);
            electronicsSales.Points.AddXY("May", 60);
            electronicsSales.Points.AddXY("Jun", 65);
            electronicsSales.Points.AddXY("Jul", 55);
            electronicsSales.Points.AddXY("Aug", 50);
            electronicsSales.Points.AddXY("Sep", 55);
            electronicsSales.Points.AddXY("Oct", 65);
            electronicsSales.Points.AddXY("Nov", 75);
            electronicsSales.Points.AddXY("Dec", 70);
            chart1.Series.Add(electronicsSales);

            Series homeGoodsSales = new Series("Femboy");
            homeGoodsSales.ChartType = SeriesChartType.Line;
            homeGoodsSales.BorderWidth = 3;
            homeGoodsSales.Points.AddXY("Jan", 5);
            homeGoodsSales.Points.AddXY("Feb", 35);
            homeGoodsSales.Points.AddXY("Mar", 35);
            homeGoodsSales.Points.AddXY("Apr", 40);
            homeGoodsSales.Points.AddXY("May", 40);
            homeGoodsSales.Points.AddXY("Jun", 40);
            homeGoodsSales.Points.AddXY("Jul", 45);
            homeGoodsSales.Points.AddXY("Aug", 50);
            homeGoodsSales.Points.AddXY("Sep", 45);
            homeGoodsSales.Points.AddXY("Oct", 50);
            homeGoodsSales.Points.AddXY("Nov", 55);
            homeGoodsSales.Points.AddXY("Dec", 55);
            chart1.Series.Add(homeGoodsSales);
        }

        private void chart1_Click(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            SetupChart();
        }
    }
}
