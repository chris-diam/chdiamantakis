#!/bin/sh

# Start the Node.js backend server
node server/index.js &

# Serve the static frontend (on port 80)
serve -s dist -l 80 &

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
