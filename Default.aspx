<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="theme.blue.css" rel="stylesheet" />
    <script src="js/jquery-1.4.3.min.js" type="text/javascript"></script>
    <script src="js/jquery.tablesorter.min.js" type="text/javascript"></script>
    <script src="js/jquery.tablesorter.js"></script>
    <script src="js/jquery.tablesorter.widgets.js"></script>
    <script type="text/javascript">      
        $(function () {

            // call the tablesorter plugin
            $("table.tablesorter").tablesorter({
                theme: 'blue',

                // hidden filter input/selects will resize the columns, so try to minimize the change
                widthFixed: true,

                // initialize zebra striping and filter widgets
                widgets: ["zebra", "filter"],

                // headers: { 5: { sorter: false, filter: false } },

                widgetOptions: {

                    // If there are child rows in the table (rows with class name from "cssChildRow" option)
                    // and this option is true and a match is found anywhere in the child row, then it will make that row
                    // visible; default is false
                    filter_childRows: false,

                    // if true, a filter will be added to the top of each table column;
                    // disabled by using -> headers: { 1: { filter: false } } OR add class="filter-false"
                    // if you set this to false, make sure you perform a search using the second method below
                    filter_columnFilters: true,

                    // extra css class applied to the table row containing the filters & the inputs within that row
                    filter_cssFilter: '',

                    // class added to filtered rows (rows that are not showing); needed by pager plugin
                    filter_filteredRow: 'filtered',

                    // add custom filter elements to the filter row
                    // see the filter formatter demos for more specifics
                    filter_formatter: null,

                    // add custom filter functions using this option
                    // see the filter widget custom demo for more specifics on how to use this option
                    filter_functions: null,

                    // if true, filters are collapsed initially, but can be revealed by hovering over the grey bar immediately
                    // below the header row. Additionally, tabbing through the document will open the filter row when an input gets focus
                    filter_hideFilters: true,

                    // Set this option to false to make the searches case sensitive
                    filter_ignoreCase: true,

                    // if true, search column content while the user types (with a delay)
                    filter_liveSearch: true,

                    // jQuery selector string of an element used to reset the filters
                    filter_reset: 'button.reset',

                    // Delay in milliseconds before the filter widget starts searching; This option prevents searching for
                    // every character while typing and should make searching large tables faster.
                    filter_searchDelay: 300,

                    // if true, server-side filtering should be performed because client-side filtering will be disabled, but
                    // the ui and events will still be used.
                    filter_serversideFiltering: false,

                    // Set this option to true to use the filter to find text from the start of the column
                    // So typing in "a" will find "albert" but not "frank", both have a's; default is false
                    filter_startsWith: false,

                    // Filter using parsed content for ALL columns
                    // be careful on using this on date columns as the date is parsed and stored as time in seconds
                    filter_useParsedData: false

                }

            });

            // External search
            // buttons set up like this:
            // <button type="button" data-filter-column="4" data-filter-text="2?%">Saved Search</button>
            $('button[data-filter-column]').click(function () {
                /*** first method *** data-filter-column="1" data-filter-text="!son"
                  add search value to Discount column (zero based index) input */
                var filters = [],
                  $t = $(this),
                  col = $t.data('filter-column'), // zero-based index
                  txt = $t.data('filter-text') || $t.text(); // text to add to filter

                filters[col] = txt;
                // using "table.hasFilters" here to make sure we aren't targetting a sticky header
                $.tablesorter.setFilters($('table.hasFilters'), filters, true); // new v2.9

                /** old method (prior to tablsorter v2.9 ***
                var filters = $('table.tablesorter').find('input.tablesorter-filter');
                filters.val(''); // clear all filters
                filters.eq(col).val(txt).trigger('search', false);
                ******/

                /*** second method ***
                  this method bypasses the filter inputs, so the "filter_columnFilters"
                  option can be set to false (no column filters showing)
                ******/
                /*
                var columns = [];
                columns[5] = '2?%'; // or define the array this way [ '', '', '', '', '', '2?%' ]
                $('table').trigger('search', [ columns ]);
                */

                return false;
            });

        });
    </script>
        <%--<style type="text/css">
        th
        {
        	cursor:pointer;
        	background-color:#dadada;
        	color:Black;
        	font-weight:bold;
        	text-align:left; 
        }
        th.headerSortUp 
        {     
        	background-image: url(images/asc.gif);
        	background-position: right center;
        	background-repeat:no-repeat; 
        }
        th.headerSortDown 
        {     
        	background-image: url(images/desc.gif);   
        	background-position: right center;
        	background-repeat:no-repeat; 
        } 
        td
        {
            border-bottom: solid 1px #dadada;	
        }
    </style>--%>
    <style type="text/css">
        /* filter row */
        .tablesorter-filter-row td {
  background: #eee;
  line-height: normal;
  text-align: center; /* center the input */
  -webkit-transition: line-height 0.1s ease;
  -moz-transition: line-height 0.1s ease;
  -o-transition: line-height 0.1s ease;
  transition: line-height 0.1s ease;
}
/* optional disabled input styling */
.tablesorter-filter-row .disabled {
  opacity: 0.5;
  filter: alpha(opacity=50);
  cursor: not-allowed;
}

/* hidden filter row */
.tablesorter-filter-row.hideme td {
  /*** *********************************************** ***/
  /*** change this padding to modify the thickness     ***/
  /*** of the closed filter row (height = padding x 2) ***/
  padding: 2px;
  /*** *********************************************** ***/
  margin: 0;
  line-height: 0;
  cursor: pointer;
}
.tablesorter-filter-row.hideme .tablesorter-filter {
  height: 1px;
  min-height: 0;
  border: 0;
  padding: 0;
  margin: 0;
  /* don't use visibility: hidden because it disables tabbing */
  opacity: 0;
  filter: alpha(opacity=0);
}

/* filters */
.tablesorter-filter {
  width: 95%;
  height: inherit;
  margin: 4px;
  padding: 4px;
  background-color: #fff;
  border: 1px solid #bbb;
  color: #333;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: height 0.1s ease;
  -moz-transition: height 0.1s ease;
  -o-transition: height 0.1s ease;
  transition: height 0.1s ease;
}
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="btnLoadGrid" runat="server" OnClick="btnLoadGrid_Click" Text="Load Grid" />

        </div>
     <div>
                        <asp:GridView ID="tablesorter"  runat="server">                                                   
                        </asp:GridView>
                            </div>
         <div>
            <asp:Button ID="btnexport" runat="server" OnClick="btnexport_Click" Text="Export To Excel" />             
             <asp:Button ID="btnprint" runat="server" OnClick="btnprint_Click" Text="Print" />
        </div>
        <div>
             <button type="button" data-filter-column="5" data-filter-text="2?%">Saved Search</button><br>
  <button type="button" class="reset">Reset Search</button> <!-- targeted by the "filter_reset" option -->
<h3>Down Table is for sorting demo using Jquery Sorting Plugins</h3>
  <table class="tablesorter">
  <thead>
    <tr>
      <!-- you can also add a placeholder using script; $('.tablesorter th:eq(0)').data('placeholder', 'hello') -->
      <th data-placeholder="" class="filter-false">Rank</th>
      <th data-placeholder="Try B*{space} or alex|br*|c" class="filter-match">First Name (<span></span> filter-match )</th>
      <th data-placeholder="Try <d">Last Name</th>
      <th data-placeholder="Try >=33">Age</th>
      <th data-placeholder="Try <9.99">Total</th>
      <th data-placeholder="Try 2?%">Discount</th> <!-- add class="filter-false" to disable the filter in this column -->
      <th data-placeholder="Try /20[^0]\d/ or >1/1/2010">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Philip Aaron Wong</td><td>Johnson Sr Esq</td><td>25</td><td>$5.95</td><td>22%</td><td>11/13/2013 6:19:51 PM</td></tr>
    <tr><td>11</td><td>Aaron</td><td>Hibert</td><td>12</td><td>$2.99</td><td>5%</td><td>11/3/2012 6:19:51 PM</td></tr>
    <tr><td>12</td><td>Brandon Clark</td><td>Henry Jr</td><td>51</td><td>$42.29</td><td>18%</td><td>2/13/2000 6:19:51 PM</td></tr>
    <tr><td>111</td><td>Peter</td><td>Parker</td><td>28</td><td>$9.99</td><td>20%</td><td>11/13/2015 6:19:51 PM</td></tr>
    <tr><td>21</td><td>John</td><td>Hood</td><td>33</td><td>$19.99</td><td>25%</td><td>11/23/2003 6:19:51 PM</td></tr>
    <tr><td>013</td><td>Clark</td><td>Kent Sr.</td><td>18</td><td>$15.89</td><td>44%</td><td>11/13/2003 6:19:51 PM</td></tr>
    <tr><td>005</td><td>Bruce</td><td>Almighty Esq</td><td>45</td><td>$153.19</td><td>44%</td><td>11/13/2013 7:19:51 PM</td></tr>
    <tr><td>10</td><td>Alex</td><td>Dumass</td><td>13</td><td>$5.29</td><td>4%</td><td>11/13/2013 7:19:51 AM</td></tr>    
  </tbody>
</table>
        </div>
    </form>
</body>
</html>
