@echo off
set rootdir=%~dp0..\

java -jar /bin/closure_compiler.jar --js=%rootdir%\jspdf.js --js=%rootdir%\libs\base64.js --js_output_file=%rootdir%\jspdf.min.js