//Getting list of edges of the enterprise
var EdgeList = eval(await VC.api.call('/enterprise/getEnterpriseEdgeList',{
    "enterpriseId": 164
  }));

//console.log(EdgeList);
var itemsFormatted = [];

//console.log("Edge Name-----------------LinkName-----------------------Addressing Type");
for(var k in EdgeList['result'])
{
    
    var ConfigurationOfOneEdge = eval(await VC.api.call('/edge/getEdgeConfigurationModules',{
        "edgeId": EdgeList['result'][k]['id'],
        "enterpriseId": 164,
        "modules": [
          "deviceSettings"
        ]
      }));
      console.log("Fetching your report, edge "+k);

    //console.log(ConfigurationOfOneEdge);

for(var i in ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces']){
    //ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]['addressing']['type']
        itemsFormatted.push({
            EdgeName: EdgeList['result'][k]['name'], 
            InterfaceName: ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]['name'],
            AddressingType: ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]['addressing']['type']
    });
    

}

}

console.log("File can be downloaded. Download link will be under Elements tab with tag <a href>");



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
    LinkName: "Interface Name",
    BWMeasurementType: "Addressing Type"
};

var fileTitle = 'Report'; 

exportCSVFile(headers, itemsFormatted, fileTitle);

