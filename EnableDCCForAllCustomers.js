//To enable DCC for all enterprises in a VCO
var EnterpriseList = eval(await VC.api.call('network/getNetworkEnterprises',{}))
for(var k in EnterpriseList['result'])
{
    await VC.api.call('enterprise/setEnterpriseDistributedCostCalculation',{
        "enterpriseId": EnterpriseList['result'][k]['id'],
        "value": true
        });

}



//To enable DCC for some enterprises
var EnterpriseList = [1,2,3] //enter the enterprise ids
for(var k=0; k < EnterpriseList.length; k++)
{
    await VC.api.call('enterprise/setEnterpriseDistributedCostCalculation',{
        "enterpriseId": EnterpriseList[k],
        "value": true
        });
}
