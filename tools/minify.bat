@echo off
set rootdir=%~dp0..\

java -jar /bin/closure_compiler.jar --js=%rootdir%\jspdf.js --js_output_file=%rootdir%\jspdf.min.js