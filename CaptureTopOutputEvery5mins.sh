#!/bin/sh
while true; do
        date >> output.txt
        top -b >> output.txt
        echo ""  >> output.txt
        echo ""  >> output.txt
        sleep 300
done
