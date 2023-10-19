//Getting list of edges of the enterprise
var EdgeList = eval(await VC.api.call('/enterprise/getEnterpriseEdgeList',{
    "enterpriseId": 1
  }));


for(var k in EdgeList['result'])
{
    //if (k != 'length'){
    //console.log(EdgeList['result']);
    
    var ConfigurationOfOneEdge = eval(await VC.api.call('/edge/getEdgeConfigurationStack',{
        "edgeId": EdgeList['result'][k]['id'],
        "enterpriseId": 1
      }));
    
      var DeviceSettingsOfEdge;

      for(var j in ConfigurationOfOneEdge['result'][0]['modules']){
        //console.log('Inside For');
            if (ConfigurationOfOneEdge['result'][0]['modules'][j]['name'] === "deviceSettings"){
                //console.log('Inside If');
                DeviceSettingsOfEdge = ConfigurationOfOneEdge['result'][0]['modules'][j];
            }

      }
       

      try{
      //console.log(DeviceSettingsOfEdge);
      DeviceSettingsOfEdge['data']['lan']['networks'][0]["override"]=false;
      //console.log(DeviceSettingsOfEdge['configurationId']);
      var output = eval(await VC.api.call('configuration/updateConfigurationModule',{
        'enterpriseId': 1,
        'configurationId': DeviceSettingsOfEdge['configurationId'],
        'id': DeviceSettingsOfEdge['id'],
        'isAsync': 'True',
        'returnData': 'True',
        '_update': {
            'name': DeviceSettingsOfEdge['name'],
            'description': DeviceSettingsOfEdge['description'],
            'data': DeviceSettingsOfEdge['data'],
            'refs': DeviceSettingsOfEdge["refs"]
        }
    }));
}
catch(err)
{
    continue;
}
}
//}

