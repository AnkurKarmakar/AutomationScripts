from client import VcoRequestManager
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

#Enter VCO URL and API token
client = VcoRequestManager("10.110.16.36", verify_ssl=False)
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblV1aWQiOiIxMzA0MjU3YS1kMzNiLTQ5N2EtOGE3Ny1jYjIxYTNkMzlhZTQiLCJleHAiOjE3MjY5MDk3ODMsInV1aWQiOiJiNmNlNjdiZS1kYTM3LTQ1OGUtOWI2NC01NDAxMzJhMTAzMTciLCJpYXQiOjE2OTUzNzM3ODd9.JPTBLhxxtFpYfNvzuFSZf2GAw2x07jro8m8w-WlB3fI'

#Enter enterpriseID
enterpriseId = 1

#API to get profile ids for getConfiguration API
profiles = client.call_api_token("enterprise/getEnterpriseConfigurationsPolicies", {"enterpriseId": enterpriseId},token)

#For each profile id iterate
for prof in profiles:
    params = {"enterpriseId": enterpriseId, "id": prof["id"], "with": ["modules", "edgeCount", "refs"]}
    profileConf = client.call_api_token("configuration/getConfiguration", params,token)
    profileName = profileConf["name"]
    profileModules = profileConf["modules"]
    firewallModule = [m for m in profileModules if m["name"] == "firewall"][0]
    data = firewallModule["data"]

#l is the list containing the current IPs for SSH
    l = data["services"]["ssh"]["allowSelectedIp"]
    l.append("54.67.58.131") #appending the new IP to the existing list
#updating data dictionary with the changes
    data["services"]["ssh"]["allowSelectedIp"]=l
    data["services"]["ssh"]["enabled"]=True
    #print(data)

    try:
        params = {
            'enterpriseId': enterpriseId,
            'id': firewallModule['id'],
            'isAsync': True,
            '_update': {
                'name': firewallModule['name'],
                'description': firewallModule['description'],
                'data': firewallModule['data'],
                'refs': firewallModule["refs"]
            }
        }
    except:
        params = {
            'enterpriseId': enterpriseId,
            'id': firewallModule['id'],
            'isAsync': True,
            '_update': {
                'name': firewallModule['name'],
                'description': firewallModule['description'],
                'data': firewallModule['data']
            }
        }
    print(params)

#call update API with changed values
    resp = client.call_api_token("configuration/updateConfigurationModule", params, token)
    print(resp)
    print("\n\n\n")