from client import VcoRequestManager
import os
import json
client = VcoRequestManager("vco209-clone-fra1.velocloud.net")
##change values
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblV1aWQiOiJjYWM5MmI0ZC1kNGFjLTRiYzMtOWNhNy1jOGYxZmVkMjYzYzYiLCJleHAiOjE3MjUyOTkwNzkwMDAsInV1aWQiOiI0YWFjMzUxNy00ZWFhLTQ1NGYtOTNmYS1iNDNmZmYxMmQ5MjEiLCJpYXQiOjE2OTM3NjMwODZ9.HFeIZSPWWpdbW3dzMVwBfqXFW-BbVNzhLTSUGSv1GDo"
##Change the values
profiles = client.call_api_token("enterprise/getEnterpriseConfigurationsPolicies", {"enterpriseId": 3}, token)
usedRefs = []
for prof in profiles:
    params = {"enterpriseId":3,
             "id":prof["id"],
             "with":["modules","edgeCount","refs"]}
    profileConf = client.call_api_token("configuration/getConfiguration",params,token)
    profileName = profileConf["name"]
    profileModules = profileConf["modules"]
    firewallModule = [m for m in profileModules if m["name"] == 'firewall'][0]
    if "refs" not in firewallModule:
        continue
    refs = firewallModule["refs"]
    data = firewallModule["data"]
    for ag in refs["objectGroup:addressGroup"]:
        agLogicalId= ag["logicalId"]
        addressGroupUsed = 0
        for s in data["segments"]:
            for r in s["outbound"]:
                if "dAddressGroup" not in r["match"] and "sAddressGroup" not in r["match"]:
                    continue
                else:
                    if "dAddressGroup" in r["match"] and agLogicalId == r["match"]["dAddressGroup"]:
                            addressGroupUsed = addressGroupUsed + 1
                    if "sAdressGroup" in r["match"] and agLogicalId == r["match"]["sAddressGroup"]:
                            addressGroupUsed = addressGroupUsed + 1



        if addressGroupUsed == 0:
            print("{},{},{},{},{}".format(ag["id"],ag["name"],ag["logicalId"],ag["type"],profileName))

    for pg in refs["objectGroup:portGroup"]:
        pgLogicalId = pg["logicalId"]
        portGroupUsed = 0
        for s in data["segments"]:
            for r in s["outbound"]:
                if "dPortGroup" not in r["match"] and "sPortGroup" not in r["match"]:
                     continue
                else:
                    if "dPortGroup" in r["match"] and pgLogicalId == r["match"]["dPortGroup"]:
                        portGroupUsed = portGroupUsed + 1
                    if "sPortGroup" in r["match"] and  pgLogicalId == r["match"]["sPortGroup"]:
                        portGroupUsed = portGroupUsed + 1
        if portGroupUsed == 0:
            print("{},{},{},{},{}".format(pg["id"],pg["name"],pg["logicalId"],pg["type"],profileName))
