let { result: stack } = await VC.api.call('edge/getEdgeConfigurationStack', { enterpriseId: 1, edgeId: 5 });
const modules = ['analyticsSettings','deviceSettings','firewall', 'QOS','controlPlane','WAN'];
for(let i=0;i<modules.length;i++)
{
	let module = stack[0].modules.find(m=>m.name=modules[i]);
	module.data.segments.forEach(segment => { segment.rules = [] });
	await VC.api.call('configuration/updateConfigurationModule', { enterpriseId: 17, configurationModuleId: module.id, _update: { data: module.data } });
}
