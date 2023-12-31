let enterpriseId = 245;
let edgeId = 89859;
let id = 1;
let csrfToken = document.cookie.split('; ').filter((item) => (item.indexOf('csrf') !== -1))[0].split('=')[1];const edgeConfigurationWithModulesRequest = await fetch('/portal/', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Vco-Csrf': csrfToken
    },
    body: JSON.stringify({
        "id": id++,
        "jsonrpc": "2.0",
        "method": "edge/getEdgeConfigurationStack",
        "params":
        {
            "enterpriseId": enterpriseId,
            "edgeId": edgeId,
            "with": ["modules"]
        }
    })
});const edgeConfigurationWithModules = await edgeConfigurationWithModulesRequest.json();let imageRefs = edgeConfigurationWithModules.result[0].modules.find((item) => (item.name === 'deviceSettings')).refs['deviceSettings:vnfs:vnfImage'];if (!Array.isArray(imageRefs)) {
    imageRefs = [imageRefs];
}imageRefs = imageRefs.filter((item) => (item.data && item.data.FAILED && item.data.FAILED.description && item.data.FAILED.description.indexOf('<') !== -1));for (let enterpriseObjectInfo of imageRefs) {
    const enterpriseObjectRequest = await fetch('/portal/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Vco-Csrf': csrfToken
        },
        body: JSON.stringify({
            "id": id++,
            "jsonrpc": "2.0",
            "method": "enterprise/getEnterpriseServices",
            "params":
            {
                "enterpriseId": enterpriseId,
                "name": enterpriseObjectInfo.name,
                "type": enterpriseObjectInfo.type
            }
        })
    });
    const enterpiseObjArr = await enterpriseObjectRequest.json();
    if (Array.isArray(enterpiseObjArr.result)) {
        throw "got unexpected data, this script may broke your data. please contact velocloud support!"
    }
    
    const item = enterpiseObjArr.result;
    
    let updateResp = await fetch('/portal/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Vco-Csrf': csrfToken
        },
        body: JSON.stringify({
            "id": id++,
            "jsonrpc": "2.0",
            "method": "enterprise/updateEnterpriseService",
            "params":{
                "enterpriseId": enterpriseId,
                id: item.id,
                _update: {
                      data: {
                        ...item.data,
                        FAILED: {
                              ...item.data.FAILED,
                              description: item.data.FAILED.description.replace('<', '').replace('>', '').replace('&lt;', '').replace('&gt;', ''),
                        }
                      }
        
                  }
             }
        })
    });
    let result = await updateResp.json();
    console.log('finished service update, id: ' + item.id, result);
}  