from client import VcoRequestManager
import os
import json

import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

client = VcoRequestManager("vco209-fra1.velocloud.net", verify_ssl=False)
##change values
# targetUsername = "c1@c1.com"
# targetPassword = "Test@123"
#targetUsername = "super@velocloud.net"
#targetPassword = "vcadm!n"
#client.authenticate(targetUsername, targetPassword, is_operator=True)
# OR
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblV1aWQiOiI4ODk1MDY4Mi05MjE3LTQzYzUtYmE1Ny01NTlhOWVlNTg2ZDYiLCJleHAiOjE3MjczMzUxMzUwMDAsInV1aWQiOiI0YWFjMzUxNy00ZWFhLTQ1NGYtOTNmYS1iNDNmZmYxMmQ5MjEiLCJpYXQiOjE2OTU3OTkxMzh9.W8ZalizlI8E1sVbn9TNuaNhh7-FFu9SGTB9OiNnZqtY'
##Change the values

# IMPORTANT: set correct enterpriseId below
enterpriseId = 1

profiles = client.call_api_token("enterprise/getEnterpriseConfigurationsPolicies", {"enterpriseId": enterpriseId},token)

usedRefs = []

total = 0

for prof in profiles:
    params = {"enterpriseId": enterpriseId, "id": prof["id"], "with": ["modules", "edgeCount", "refs"]}
    profileConf = client.call_api_token("configuration/getConfiguration", params,token)
    profileName = profileConf["name"]
    profileModules = profileConf["modules"]
    firewallModule = [m for m in profileModules if m["name"] == "firewall"][0]
    if "refs" not in firewallModule:
        continue
    refs = firewallModule["refs"]
    data = firewallModule["data"]
    dataStr = json.dumps(data)

    refsAGResult = []
    for ag in refs["objectGroup:addressGroup"]:
        agLogicalId = ag["logicalId"]

        if agLogicalId not in dataStr:
            # print("{},{},{},{},{}".format(ag["id"], ag["name"], ag["logicalId"], ag["type"], profileName))
            pass
        else:
            refsAGResult.append(ag)

        # addressGroupUsed = 0
        # for s in data["segments"]:
        #     for r in s["outbound"]:
        #         if "dAddressGroup" not in r["match"] and "sAddressGroup" not in r["match"]:
        #             continue
        #         else:
        #             if "dAddressGroup" in r["match"] and agLogicalId == r["match"]["dAddressGroup"]:
        #                 addressGroupUsed = addressGroupUsed + 1
        #             if "sAddressGroup" in r["match"] and agLogicalId == r["match"]["sAddressGroup"]:
        #                 addressGroupUsed = addressGroupUsed + 1

        # if addressGroupUsed == 0:
        #     # print("{},{},{},{},{}".format(ag["id"], ag["name"], ag["logicalId"], ag["type"], profileName))
        #     pass
        # else:
        #     refsAGResult.append(ag)

    diff_ag = len(refs["objectGroup:addressGroup"]) - len(refsAGResult)
    if diff_ag != 0:
        total += diff_ag
        print(profileName, diff_ag)
        refs["objectGroup:addressGroup"] = refsAGResult

    refsPGResult = []
    for pg in refs["objectGroup:portGroup"]:
        pgLogicalId = pg["logicalId"]

        if pgLogicalId not in dataStr:
            # print("{},{},{},{},{}".format(pg["id"], pg["name"], pg["logicalId"], pg["type"], profileName))
            pass
        else:
            refsPGResult.append(pg)

        # portGroupUsed = 0
        # for s in data["segments"]:
        #     for r in s["outbound"]:
        #         if "dPortGroup" not in r["match"] and "sPortGroup" not in r["match"]:
        #             continue
        #         else:
        #             if "dPortGroup" in r["match"] and pgLogicalId == r["match"]["dPortGroup"]:
        #                 portGroupUsed = portGroupUsed + 1
        #             if "sPortGroup" in r["match"] and pgLogicalId == r["match"]["sPortGroup"]:
        #                 portGroupUsed = portGroupUsed + 1
        # if portGroupUsed == 0:
        #     # print("{},{},{},{},{}".format(pg["id"], pg["name"], pg["logicalId"], pg["type"], profileName))
        #     pass
        # else:
        #     refsPGResult.append(pg)

    diff_pg = len(refs["objectGroup:portGroup"]) - len(refsPGResult)

    if diff_pg != 0:
        total += diff_pg
        print(profileName, diff_pg)
        refs["objectGroup:portGroup"] = refsPGResult

    params = {
        'enterpriseId': enterpriseId,
        'id': firewallModule['id'],
        'isAsync': True,
        '_update': {
            'name': firewallModule['name'],
            'description': firewallModule['description'],
            'data': firewallModule['data'],
            'refs': refs
        }
    }

    #print(params)
    # IMPORTANT: Uncomment next line if you want to make the changes
    #resp = client.call_api_token("configuration/updateConfigurationModule", params,token)
    #print(resp)
    #print("\n\n\n")

print("\nTotal", total)