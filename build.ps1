# Build script for jsPDF
# modeled on koGrid's build.ps1
$CurrentDir = (Get-Location).Path;
$OutputDir = $CurrentDir + "\dist";
$OutPutFile = $OutputDir + "\jspdf.debug.js";
$TempFile = $OutPutFile + ".temp";
$BuildOrder = $CurrentDir + "\build.txt";
$BuildRequire = $CurrentDir + "\build-require.txt";


Write-Host "JSBuild Starting...";
$files = Get-Content $BuildOrder;
$modules = Get-Content $BuildRequire;
$moduleNames = $modules | foreach {[io.path]::GetFileNameWithoutExtension($_)}
Set-Content $TempFile "/***********************************************";
Add-Content $TempFile "* koGrid JavaScript Library";
Add-Content $TempFile "* Authors: https://github.com/ericmbarnard/koGrid/blob/master/README.md";
Add-Content $TempFile "* License: MIT (http://www.opensource.org/licenses/mit-license.php)";
#Add-Content $TempFile "* Compiled At: $compileTime";
Add-Content $TempFile "***********************************************/`n"
Add-Content $TempFile ("define([" + (($moduleNames | foreach {"`"./" + $_ + "`""}) -join ", ") + "], function (" + ($moduleNames -join ", ") + ") {");
Foreach ($file in $files){
    Write-Host "Building... $file";
    Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
    $fileContents = Get-Content $file | where {!$_.StartsWith("///")};
    Add-Content $TempFile $fileContents
}
Add-Content $TempFile "return jsPDF;";
Add-Content $TempFile "});";

Foreach ($file in $modules){
    copy $file $OutputDir
}

copy $TempFile $OutPutFile
del $TempFile