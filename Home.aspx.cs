using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Home : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void btnCheck_Click(object sender, EventArgs e)
    {
        string value = "";
        foreach (ListItem item in lstView.Items)
        {
            if (item.Selected)
            {
                value = item.Value.ToString() + "," + value;
            }
        }

        lbl.Text = value.TrimEnd(',');
    }
}