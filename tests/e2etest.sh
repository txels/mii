#!/bin/bash
cd $(dirname $0)

# Simplistic end to end test for sample miimetiq client

# Ensure required exchanges exist
python3 miimetiq_test_setup.py
sleep 1

# Start client
node mii_client.js &
sleep 2

# Send a message
# python3 miimetiq_send.py
# Receive a message. Wait a little to ensure queue is up
# sleep 1
# python3 miimetiq_receive.py && echo 'SUCCESS' || echo 'FAILED'

# Run tests
python3 -m unittest discover

kill -9 `cat mii_client.pid`
