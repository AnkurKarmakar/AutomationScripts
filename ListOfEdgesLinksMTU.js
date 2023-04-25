//Getting list of edges of the enterprise
var EdgeList = eval(await VC.api.call('/enterprise/getEnterpriseEdgeList',{
    "enterpriseId": 46,
    "with" : ["links"]
  }));

//console.log(EdgeList);
var itemsFormatted = [];

//console.log("Edge Id----------Edge Name------------LinkName---------Interface Type-------MTU----------VcoDeepUrl");
for(var k in EdgeList['result'])
{
    
    var ConfigurationOfOneEdge = eval(await VC.api.call('/edge/getEdgeConfigurationModules',{
        "edgeId": EdgeList['result'][k]['id'],
        "enterpriseId": 46,
        "modules": [
          "deviceSettings"
        ]
      }));
      console.log("Fetching your report, edge "+k);

    //Getting each link info
for(var j in EdgeList['result'][k]["links"])
{
    //console.log(ConfigurationOfOneEdge);
    for(var i in ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces']){
        //ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]['addressing']['type']
        if(EdgeList['result'][k]["links"][j]["interface"]==ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]["name"])
        {
            itemsFormatted.push({
                EdgeId: EdgeList['result'][k]['id'],
                EdgeName: EdgeList['result'][k]['name'], 
                LinkName: EdgeList['result'][k]['links'][j]['displayName'],
                InterfaceType: EdgeList['result'][k]['links'][j]['interface'],
                MTU: ConfigurationOfOneEdge['result']['deviceSettings']['data']['routedInterfaces'][i]['l2']['MTU'],
                VcoDeepUrl: 'vco128-usvi1.velocloud.net/#!/msp/customer/46/config/edge/'+EdgeList['result'][k]['id']+'/device/'
        });
    }
        
    
    }


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
    EdgeId: "Edge Id",
    EdgeName: "Edge Name", 
    LinkName: "Link Name",
    InterfaceType: "Interface Type",
    MTU: "MTU",
    VcoDeepUrl: "VCO Deep URL"
};

var fileTitle = 'Report'; 

exportCSVFile(headers, itemsFormatted, fileTitle);


