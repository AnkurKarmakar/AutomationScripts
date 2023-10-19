//Script to enable Edge Configuration Updates for all enterprises in a VCO

var EnterpriseList = eval(await VC.api.call('network/getNetworkEnterprises',{})) // To get list of all enterprises in a VCO


for(var k in EnterpriseList['result']) //Loop through each enterprise
{
    await VC.api.call('enterprise/updateEnterpriseEdgeUpdatePolicy',{
        "enabled" : true,
        "enterpriseId": EnterpriseList['result'][k]['id']
        });
    
        console.log("Enabled edge configuration updates in enterprise "+ EnterpriseList['result'][k]['name']);

}
