using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.IO;
using System.Configuration;
using System.Text;
using JSONConverter;
using System.Globalization;

public partial class _Default : System.Web.UI.Page
{
    string location = ConfigurationManager.AppSettings["Folder"];
    protected void Page_Load(object sender, EventArgs e)
    {
       
    }
   
    public class Person
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        
    }
    protected void btnLoadGrid_Click(object sender, EventArgs e)
    {
        BindGrid();

        List<Person> people = new List<Person>{
                   new Person{ID = 1, FirstName = "Scott", LastName = "Gurthie"},
                   new Person{ID = 2, FirstName = "", LastName = "Gates"},
                   new Person{ID = 3, FirstName = "Krishna", LastName = "Mouli"}
                   };

        string jsonString = people.ToJSON();
      
    }
    public void BindGrid()
    {
        DataTable db = new DataTable();
        db.Columns.Add("First Name");
        db.Columns.Add("Last Name");
        db.Columns.Add("Job Title");
        db.Columns.Add("User Email");
        db.Columns.Add("Company Name");
        db.Columns.Add("Branch");
        db.Columns.Add("Logons Count");
        db.Columns.Add("Last Logon");
        db.Rows.Add("Paramjit", "前菜", "Systems & Data Co-ordinator", "paramjit.sanghera@ba.com", "British Airways", "Waterside", "1278", "10/23/2013  2:35:18 PM");
        db.Rows.Add("Juliana", "主菜", "Account Manager", "Juliana.Araujo@LSGSkyChefs.com", "Catering Company", "NULL", "11", "10/23/2013  1:08:37 PM");
        Session["GridData"] = db;
        tablesorter.DataSource = db;
        tablesorter.DataBind();
    }
    protected void btnexport_Click(object sender, EventArgs e)
    {
        int cols;
        DataTable exportData = new DataTable();
       
        if (Session["GridData"] != null)
        {
            exportData = (DataTable)Session["GridData"];
        }
        //exportData = (DataTable)grdUsersList.DataSource;
        //open file 
        System.Globalization.CultureInfo ci = null;
        ci = System.Globalization.CultureInfo.CreateSpecificCulture("ja-JP");
       // FormattingStreamWriter wr = new FormattingStreamWriter(location + "/ApplicationUsage.csv",ci);
        
        // Culture changed to Japanese in Web.config file

        StreamWriter wr = new StreamWriter(location+"/ApplicationUsage.csv");
       
        //determine the number of columns and write columns to file 
        cols = exportData.Columns.Count;
        for (int i = 0; i < cols; i++)
        {
            wr.Write(exportData.Columns[i].ToString().ToUpper() + ",");
        }
        wr.WriteLine();
        
        //write rows to excel file
        for (int i = 0; i < (exportData.Rows.Count); i++)
        {
            for (int j = 0; j < cols; j++)
            {
                if (exportData.Rows[i][j] != null)
                {
                    wr.Write(exportData.Rows[i][j] + ",");
                }
                else
                {
                    wr.Write(",");
                }
            }

            wr.WriteLine();
        }

        //close file
        wr.Close();
        DownLoad(location + "\\ApplicationUsage.csv");
    }
    //public class FormattingStreamWriter : StreamWriter
    //{
    //    private readonly IFormatProvider formatProvider;
 
    //    public FormattingStreamWriter(string path, IFormatProvider formatProvider)
    //        : base(path)
    //    {
    //        this.formatProvider = formatProvider;
    //    }
    //    public override IFormatProvider FormatProvider
    //    {
    //        get
    //        {
    //            return this.formatProvider;
    //        }
    //    }
    //}
    public void DownLoad(string FName)
    {
        string path = FName;
        System.IO.FileInfo file = new System.IO.FileInfo(path);
        if (file.Exists)
        {
            Response.Clear();
            Response.AddHeader("Content-Disposition", "attachment; filename=" + file.Name);
            Response.AddHeader("Content-Length", file.Length.ToString());
            Response.ContentType = "application/octet-stream";
            Response.WriteFile(file.FullName);
            Response.End();

        }
        else
        {
            Response.Write("This file does not exist.");
        }

    }
    protected void btnprint_Click(object sender, EventArgs e)
    {
        GridView GridView1 = new GridView();
        GridView1.DataSource = Session["GridData"];
        GridView1.PagerSettings.Visible = false;
        GridView1.DataBind();
        StringWriter sw = new StringWriter();
        HtmlTextWriter hw = new HtmlTextWriter(sw);
        GridView1.RenderControl(hw);
        string gridHTML = sw.ToString().Replace("\"", "'")
            .Replace(System.Environment.NewLine, "");
        StringBuilder sb = new StringBuilder();
        sb.Append("<script type = 'text/javascript'>");
        sb.Append("window.onload = new function(){");
        sb.Append("var printWin = window.open('', '', 'left=0");
        sb.Append(",top=0,width=1000,height=600,status=0');");
        sb.Append("printWin.document.write(\"");
        sb.Append(gridHTML);
        sb.Append("\");");
        sb.Append("printWin.document.close();");
        sb.Append("printWin.focus();");
        sb.Append("printWin.print();");
        sb.Append("printWin.close();};");
        sb.Append("</script>");
        ClientScript.RegisterStartupScript(this.GetType(), "GridPrint", sb.ToString());
        //GridView1.PagerSettings.Visible = true;
        //GridView1.DataBind();
    }

   
}