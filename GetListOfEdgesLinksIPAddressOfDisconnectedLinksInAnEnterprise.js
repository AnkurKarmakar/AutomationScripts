var result = eval(await VC.api.call('/enterprise/getEnterpriseEdgeList',{
    "enterpriseId": 498,
    "with": [
      "links"
    ]
  }))


//console.log('EdgeName		   	                      LinkName		         IPaddress    	   LinkState');

var itemsFormatted = [];
for(var key1 in result['result'])
{ 
for(var key in result['result'][key1]['links'])
{
    if((result['result'][key1]['links'][key]['state'] == 'DISCONNECTED') && (result['result'][key1]['name'].includes("Test")==false) && (result['result'][key1]['name'].includes("Lab")==false))
    {
        //console.log(result['result'][key1]['name']+'			'+result['result'][key1]['links'][key]['displayName']+'			'+result['result'][key1]['links'][key]['ipAddress']+'			'+result['result'][key1]['links'][key]['state']);
        
        itemsFormatted.push({
            EdgeName: result['result'][key1]['name'], 
            LinkName: result['result'][key1]['links'][key]['displayName'],
            IPAddress: result['result'][key1]['links'][key]['ipAddress'],
            LinkState: result['result'][key1]['links'][key]['state']
    });
}
}
}



function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            document.body.appendChild(link);
            link.click();
            console.log("Download link will be under Elements tab with tag <a href>");
            //document.body.removeChild(link);
        }
    }
}

var headers = {
    EdgeName: "Edge Name", 
    LinkName: "Link Name",
    IPAddress: "IP Address",
    LinkState: "Link State"
};

var fileTitle = 'Report'; 

exportCSVFile(headers, itemsFormatted, fileTitle);
