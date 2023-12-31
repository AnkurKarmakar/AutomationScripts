// change this if you only want to run for one profile
//const onlyProfileId = 2280;
const onlyProfileId = null;

function doesProfileVlansNeedUpdate(networks) {
    let updateNeeded = false;
    for (let network of networks) {
        if (!DeviceSettings.hasValue(DeviceSettings.getPath(network, 'advertise'))) {
            updateNeeded = true;
            network.advertise = true;
        }
    }
    return updateNeeded;
}

async function fixConfigs() {
    let res = await VC.api.call("enterprise/getEnterpriseConfigurationsPolicies", {
        enterpriseId:app.currentEnterprise.id
    });

    if (!res || !res.result) {
        console.error('Unable to retrieve profile list');
        return;
    }

    const modulesToUpdate = {};
    for (let profile of res.result) {
        if (onlyProfileId && onlyProfileId !== profile.id) {
            continue;
        }
        if (profile.configurationType === 'NETWORK_BASED') {
            continue;
        }
        console.log(`Checking profile ${profile.name}`);
        res = await VC.api.call("configuration/getConfiguration", {
            enterpriseId: app.currentEnterprise.id,
            id: profile.id,
            with: ["modules"]
        });

        if (!res || !res.result || !Array.isArray(res.result.modules)) {
            continue;
        }

        const deviceSettingsModule = res.result.modules.find(mod => mod.name === 'deviceSettings');
        const networks = DeviceSettings.getPath(deviceSettingsModule, 'data.lan.networks');
        if (!Array.isArray(networks)) {
            continue;
        }
        const needUpdate = doesProfileVlansNeedUpdate(networks);
        if (!needUpdate) {
            continue;
        }
        modulesToUpdate[deviceSettingsModule.id] = deviceSettingsModule;
    }

    for (let id in modulesToUpdate) {
        try {
            console.log(`updating module id ${id}`);
            let res = await VC.api.call("configuration/updateConfigurationModule", {
                enterpriseId: app.currentEnterprise.id,
                id,
                isAsync: false,
                returnData: true,
                _update: {
                    data: modulesToUpdate[id].data,
                    name: "deviceSettings",
                    refs: modulesToUpdate[id].refs
                }
            });
        } catch(err) {
            console.log(err);
        }
    }
}

await fixConfigs();