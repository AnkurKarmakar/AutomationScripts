var getEnterprise = eval(await VC.api.call('network/getNetworkEnterprises',{
    "networkId": 1
  }));

console.log("Enterprise ID      Enterprise Name");
for(var i in getEnterprise['result'])
{

    var DCCInfo = eval(await VC.api.call('enterprise/getEnterpriseDistributedCostCalculation',{"enterpriseId" : getEnterprise['result'][i]['id']}));
    if (DCCInfo['result']['value'] == true){
        console.log(getEnterprise['result'][i]['id']+'       '+getEnterprise['result'][i]['name']);}

}
