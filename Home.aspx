<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Home" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
      <asp:ListBox ID="lstView" SelectionMode="Multiple"  runat="server">
          <asp:ListItem Text="A" Value="1" />
          <asp:ListItem Text="B" Value="2" />
          <asp:ListItem Text="C" Value="3" />
          <asp:ListItem Text="D" Value="4" />
      </asp:ListBox>
    </div>
        <div>
            <asp:Button ID="btnCheck" runat="server" Text="Submit" OnClick="btnCheck_Click" />
            <asp:Label ID="lbl" runat="server"></asp:Label>
        </div>
    </form>
</body>
</html>
