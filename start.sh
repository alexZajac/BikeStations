#!/bin/bash

rm -rf ./fuseki/backups
rm -rf ./fuseki/logs
rm -rf ./fuseki/system
rm -rf ./fuseki/system_files
rm -rf ./fuseki/templates
rm -rf ./fuseki/config.ttl
rm -rf ./fuseki/shiro.ini

dokcer-compose up