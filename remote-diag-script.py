import os
edgeIds=[1,2,3,4]
stream = os.popen("export VC_USERNAME='super@velocloud.net'")
output = stream.readlines()
stream = os.popen("export VC_PASSWORD='vcadm!n'")
output = stream.readlines()

for id in edgeIds:
	stream = os.popen("python2 remote_diag.py RESTART_DNSMASQ --host 10.110.16.41 --edge "+str(id)+" --enterprise 1 --insecure --operator")
	output = stream.readlines()
	print(output)
