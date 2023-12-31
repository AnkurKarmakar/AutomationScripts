let edgeId =  [5063,4668,4755,5158,5226,5302,4777,5092,5030,5320,5059,4693,5151,5184,4773,4945,5132,5262,5367,5015,5172,5188,5138,5175,5027,5780,6313,9415,9413,9699,9414,9935];
let enterpriseId = 524;

const defaultMulticast = {
  "igmp": {
    "enabled": false,
    "type": "IGMP_V2"
  },
  "pim": {
    "enabled": false,
    "type": "PIM_SM"
  },
  "pimHelloTimerSeconds": null,
  "pimKeepAliveTimerSeconds": null,
  "pimPruneIntervalSeconds": null,
  "igmpHostQueryIntervalSeconds": null,
  "igmpMaxQueryResponse": null
};

function fixRoutedInterface(edgeDsModule) {
    const routedInterfaces = DeviceSettings.getPath(edgeDsModule, 'data.routedInterfaces');
    for (const routedInterface of routedInterfaces) {
        if (routedInterface.hasOwnProperty("multicast")) {
            routedInterface.multicast = defaultMulticast;
        }
    }
    return edgeDsModule;
}


async function updateEdgeDsModule(moduleId, data, refs) {
    let result = await VC.api.call("configuration/updateConfigurationModule", {
        enterpriseId: enterpriseId,
        id: moduleId,
        isAsync: false,
        returnData: true,
        _update: {
            data: data,
            name: "deviceSettings",
            refs: refs
        }
    });
    return result;
}

async function fixConfigs() {

    for(let i=0;i<edgeId.length;i++)
    {
    let edgeConfigurationStack = await VC.api.call("edge/getEdgeConfigurationStack", {
        edgeId: edgeId[i],
        with: "modules",
        enterpriseId: enterpriseId
    });
    if (!edgeConfigurationStack || !edgeConfigurationStack.result) {
        console.error('Cannot read edge config stack');
        return;
    }
    let result = edgeConfigurationStack.result;
    let edgeSpecificConfig = result[0];
    let edgeDsModule = edgeSpecificConfig.modules.find(
        (module) => module.name === "deviceSettings"
    );
    edgeDsModule = fixRoutedInterface(edgeDsModule);

    let updateResult = null;
    try {
        updateResult = await updateEdgeDsModule(edgeDsModule.id, edgeDsModule.data, edgeDsModule.refs);
    } catch (e) {
        console.error('Failed to update the configuration ',e,' edgeId',edgeId[i]);
        continue;
    }

    console.log('Update result = ' + updateResult);
}
}

await fixConfigs();