
from client import VcoRequestManager
import os
import json

client = VcoRequestManager("vco33.velocloud.net")
##change values
token = "eyJhbGc...g1Vg"

# Raeady for run 1 of 3
list_ents = [372, 261, 447, 565, 489, 739, 557, 444, 545, 715]

poolId = 16

for enterprise in list_ents:
    ent = client.call_api_token("/enterprise/getEnterprise", { "id":enterprise }, token)
    del ent["created"]
    del ent["modified"]
    del ent["accountNumber"]
    del ent["logicalId"]
    del ent["bastionState"]
    del ent["id"]
    del ent["networkId"]
    #print(json.dumps(ent,indent=3))
    print("Changing enterprise: \"{}\", Current PoolId: {} -> New PoolId:{}".format(ent["name"],ent["gatewayPoolId"],poolId))
    ent["gatewayPoolId"]=poolId
    output = client.call_api_token("enterprise/deleteEnterpriseGatewayHandoff", {"enterpriseId":enterprise}, token)
    output = client.call_api_token("enterprise/updateEnterprise",{"enterpriseId":enterprise, "_update": ent} ,token)
    print(json.dumps(output, indent=3))
