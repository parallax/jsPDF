@echo off
set rootdir=%~dp0..\
set jsdocbindir=\bin\jsdoc-toolkit

java -jar %jsdocbindir%\jsrun.jar %jsdocbindir%\app\run.js -v %rootdir%\jspdf.js -d=%rootdir%\doc -t=%rootdir%\tools\jsdoc_template