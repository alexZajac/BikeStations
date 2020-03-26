@RD /S /Q "%~dp0fuseki/backups"
@RD /S /Q "%~dp0fuseki/logs"
@RD /S /Q "%~dp0fuseki/system"
@RD /S /Q "%~dp0fuseki/system_files"
@RD /S /Q "%~dp0fuseki/templates"
del "%~dp0fuseki\config.ttl"
del "%~dp0fuseki\shiro.ini"

start docker-compose up