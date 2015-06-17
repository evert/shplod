#!/bin/bash

set -e
# Any subsequent(*) commands which fail will cause the shell script to exit immediately

echo "--- Downloading punjab. ---"
git clone https://github.com/twonds/punjab.git punjab
cd punjab


echo "--- Running installation script ---"
python setup.py install

echo "--- Running punjab ---"
twistd punjab

echo "Punjab is now running on localhost:5280"
echo "Your BOSH url is http://localhost:5280/http-bind"
