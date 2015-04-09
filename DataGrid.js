var PageCount = 1;
var ResultsPerPage = 50;
var dgCheckBoxSelector = '';
var OrderBy = '';
var PageAmount = 0;
searchEnabled = false;
commandsEnabled = false;
searchMode = false;
filtersEnabled = false;
var checkAllSelector = "";
var dgCheckBoxSelector = "";
var dgclaim = "";

$(document).ready(function () {

    $('#ddlResultsPerPage').unbind('change', pageResultChange);
    $('#ddlResultsPerPage').on('change', pageResultChange);

    $('#btnPrevPage').unbind('click', movePage);
    $('#btnNextPage').unbind('click', movePage);
    $('#btnFirstPage').unbind('click', movePage);
    $('#btnLastPage').unbind('click', movePage);
    $('#btnPrevPage').on('click', movePage);
    $('#btnNextPage').on('click', movePage);
    $('#btnFirstPage').on('click', movePage);
    $('#btnLastPage').on('click', movePage);

    initDefaultGridCommands();

});


function getChat() {
    displayLoadingMessage();
    FilterByReg = "";
    PageCount = 1;
    var request = new Object();
    request.chatDTO = chatDTO();
    var rotationVal = $('#ddlRotation :selected').val();

    if (rotationVal > 0) {
        request.chatDTO.RotationID = rotationVal;
        var dataToSend = JSON.stringify(request);

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: MasterChatUrl + '/getChat',
            async: false,
            data: dataToSend,
            success: function (msg, results) {

                $('#ddlRotation').removeAttr("disabled");
                var toSee;
                toSee = $('#ChatsList').render(msg.Results);

                $("#tbTemplate").empty();
                $("#tbTemplate").append(toSee);

                GetRegionsByJob();

                PageAmount = msg.Results[0].PageAmount;
                PageCount = 1;
                if (msg.Results[0].PageAmount != null && msg.Results[0].PageAmount != undefined) {
                    var current = PageCount + "/" + msg.Results[0].PageAmount;
                    $('#lbCurrentPage').text(current);
                }
                clearMessage();
                searchEnabled = true;

                regCheckBoxSelector = '#Regions input[id*="chkReg_"]:checkbox';
                $(regCheckBoxSelector).unbind('change', RegfilterCheck);
                $(regCheckBoxSelector).on('change', RegfilterCheck);

                registerCheckBoxes();
                buttonToggle(false);
                $('#chkCheckAll').attr('checked', false);
            },
            error: function (msg, results) {
                alert("Failed to Load Chats");
                clearMessage();
            }
        });
    }
    else {
        clearMessage();
        $('#ddlRotation').removeAttr("disabled");
        $("#tbTemplate").empty();
        $("#Regions").empty();
    }
}


function pageResultChange(e) {
    var changedResultValue = $('#ddlResultsPerPage').val();
    ResultsPerPage = changedResultValue;
    PageCount = 1;
    $('#lbCurrentPage').text(PageCount);

    if (searchMode && searchEnabled) {
        FilterChats();
    }
    else {
        FilterChats();
    }

}

function movePage(e) {

    var element = e.target || e.srcElement;
    var id = element.id;
    var currentPageCount = $('#lbCurrentPage').text();
    currentPageCount = parseInt(currentPageCount);
    if (id.indexOf("Prev") > -1) {

        if (currentPageCount != 1) {
            --currentPageCount;

            if ($('#lbCurrentPage').text().indexOf('/') > -1) {
                var text = $('#lbCurrentPage').text();
                text = text.substr(text.indexOf('/'));
                text = currentPageCount + text;
                $('#lbCurrentPage').text(text);
            }
            else {
                $('#lbCurrentPage').text(currentPageCount);
            }
            PageCount = currentPageCount;
            if (searchMode && searchEnabled) {
                FilterChats();
            }
            else if (filtersEnabled) {
                if (filtersChecked()) {
                    FilterChats();
                }
                else {
                    FilterChats();
                }
            }
            else {
                FilterChats();
            }
        }
        else {
            //TODO: do nothing as the page count cannot go below 1 if it is already 1
        }
    }

    else if (id.indexOf('Next') > -1) {
        if (currentPageCount < PageAmount) {
            ++currentPageCount;
            if ($('#lbCurrentPage').text().indexOf('/') > -1) {
                var text = $('#lbCurrentPage').text();
                text = text.substr(text.indexOf('/'));
                text = currentPageCount + text;
                $('#lbCurrentPage').text(text);
            }
            else {
                $('#lbCurrentPage').text(currentPageCount);
            }
            PageCount = currentPageCount;
            if (searchMode && searchEnabled) {
                FilterChats();
            }
            else if (filtersEnabled) {
                if (filtersChecked()) {
                    FilterChats();
                }
                else {
                    FilterChats();
                }
            }
            else {
                FilterChats();
            }
        }
    }
    else if (id.indexOf('First') > -1) {
        currentPageCount = 1;
        if ($('#lbCurrentPage').text().indexOf('/') > -1) {
            var text = $('#lbCurrentPage').text();
            text = text.substr(text.indexOf('/'));
            text = currentPageCount + text;
            $('#lbCurrentPage').text(text);
        }
        else {
            $('#lbCurrentPage').text(currentPageCount);
        }
        PageCount = currentPageCount;
        if (searchMode && searchEnabled) {
            FilterChats();
        }
        else if (filtersEnabled) {
            if (filtersChecked()) {
                FilterChats();
            }
            else {
                //FilterChats();
            }
        }
        else {
           // FilterChats();
        }
    }
    else {

        var text = $('#lbCurrentPage').text();
        var lastPage = parseInt(text.substr(text.indexOf('/') + 1));
        text = lastPage + text.substr(text.indexOf('/'));
        $('#lbCurrentPage').text(text);

        PageCount = lastPage;
        if (searchMode && searchEnabled) {
            FilterChats();
        }
        else if (filtersEnabled) {
            if (filtersChecked()) {
                FilterChats();
            }
            else {
                FilterChats();
            }
        }
        else {
            FilterChats();
        }
    }

}


function displayLoadingMessage() {
    $('#imgloader').show();
}

function clearMessage() {
    $('#imgloader').hide(); // Added 
}


function FilterChats() {

    displayLoadingMessage();

    $('#ddlRotation').attr("disabled", "disabled");

    var request = new Object();
    request.chatDTO = chatDTO();

    var rotationVal = $('#ddlRotation :selected').val();
    request.chatDTO.RotationID = rotationVal;
    request.chatDTO.SearchText = $('#txtSearchFilter').val();
    request.chatDTO.FilterByReg = FilterByReg;
    var dataToSend = JSON.stringify(request);

    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: MasterChatUrl + '/getChat',
        async: false,
        data: dataToSend,
        success: function (msg, results) {

            $('#ddlRotation').removeAttr("disabled");
            var toSee;
            toSee = $('#ChatsList').render(msg.Results);

            $("#tbTemplate").empty();
            $("#tbTemplate").append(toSee);

            clearMessage();
            searchEnabled = true;

            PageAmount = msg.Results[0].PageAmount;

            if (msg.Results[0].PageAmount != null && msg.Results[0].PageAmount != undefined) {
                var current = PageCount + "/" + msg.Results[0].PageAmount;
                $('#lbCurrentPage').text(current);
            }

            registerCheckBoxes();

        },
        error: function (msg, results) {

           // clearMessage();
        }
    });

}

function RegfilterCheck(e) {

    buttonToggle(false);
    $(checkAllSelector).attr('checked', false);

    var selecteditems = '';
    var boxes = $('input[id*="chkReg"]:checked');

    if (boxes.length > 0) {
        for (var index = 0; index < boxes.length; ++index) {
            var regionName = boxes[index].id;
            regionName = regionName.replace("chkReg_", "");
            selecteditems = selecteditems + regionName + ',';
        }
    }

    FilterByReg = selecteditems.slice(0, -1);
    PageCount = 1;
    FilterChats();
}

function GetRegionsByJob() {

    var JobId = $('#ddlRotation :selected').val();
    var dataToSend = JSON.stringify(JobId);
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: MasterChatUrl + '/GetDistinctJobRegions',
        async: false,
        data: dataToSend,
        success: function (msg, results) {
            var toSee;
            toSee = $('#RegionList').render(msg.Results);
            $("#Regions").empty();
            $("#Regions").append(toSee);
        },
        error: function (msg, results) {
            alert("Failed to get Regions");
        }

    });
}


function initDefaultGridCommands() {
    buttonToggle(false);
    checkAllSelector = '#WAStbTemlate input[id*="chkCheckAll"]:checkbox';
    dgCheckBoxSelector = '#WAStbTemlate input[id*="chkChat"]:checkbox';

    $('#btnEditChat').on('click', editChatClick);
    $('#btnEditChatHeader').on('click', editChatHeaderClick);
    $('#btnViewChat').on('click', viewChatClick);
    $('#btnNewChat').on('click', newChatClick);  
    actionController();
}

function registerCheckBoxes() {

    $(checkAllSelector).unbind('change', checkChange);
    $(dgCheckBoxSelector).unbind('change', changeCheck);

    $(checkAllSelector).on('change', checkChange);
    $(dgCheckBoxSelector).on('change', changeCheck);
}


function checkChange(e) {
    checkAllSelector = '#WAStbTemlate input[id*="chkCheckAll"]:checkbox';
    dgCheckBoxSelector = '#WAStbTemlate input[id*="chkChat"]:checkbox';

    var val = $(checkAllSelector).is(':checked');

    if (val) {

        $(dgCheckBoxSelector).attr('checked', true);
        $('#tbTemplate tr').addClass("selected");
        $('#tbTemplate tr')[0].className = "";
        actionController(2);
    }
    else {
        $(dgCheckBoxSelector).attr('checked', false);
        $('#tbTemplate tr').removeClass("selected");
    }
    lookingForChecked();
}


function lookingForChecked() {
    var checkboxes = $('#tbTemplate .selected');
    if ($(checkboxes).length > 0) {
        buttonToggle(true);
    }
    else {
        buttonToggle(false);
    }
}

function changeCheck(e) {

    var checked = $('#' + e.target.id).is(':checked');
    var val = $(checkAllSelector).is(':checked');
    if (checked) {
        var parent = $('#' + e.target.id).parent();
        parent = $(parent).parent();
        $(parent).addClass("selected");

    }
    else if (!checked) {
        var parent1 = $('#' + e.target.id).parent();
        parent1 = $(parent1).parent();
        $(parent1).removeClass("selected");

        var anyChecked = $(dgCheckBoxSelector).is(':checked');
        if (!anyChecked) {
            $(checkAllSelector).attr('checked', false);
        }
    }
    lookingForChecked();
}