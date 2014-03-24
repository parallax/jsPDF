# Build script for jsPDF
# modeled on koGrid's build.ps1
$CurrentDir = (Get-Location).Path;
$OutputDir = $CurrentDir + "\dist";
$OutPutFile = $OutputDir + "\jspdf.amd.js";
$TempFile = $OutPutFile + ".temp";
$BuildOrder = $CurrentDir + "\build.txt";
$BuildRequire = $CurrentDir + "\build-require.txt";


Write-Host "JSBuild Starting...";
$files = Get-Content $BuildOrder;
$modules = Get-Content $BuildRequire;
$moduleNames = $modules | foreach {[io.path]::GetFileNameWithoutExtension($_)}
Set-Content $TempFile "/***********************************************";
#Add-Content $TempFile "* Compiled At: $compileTime";
Add-Content $TempFile "***********************************************/`n"
Foreach ($file in $modules){
    Write-Host "Building... $file";
    Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
    $fileContents = (Get-Content $file) -replace "define\(", ("define(`"" + ([io.path]::GetFileNameWithoutExtension($file)) + "`", ") ;
    Add-Content $TempFile $fileContents
}
Add-Content $TempFile ("define([" + (($moduleNames | foreach {"`"" + $_ + "`""}) -join ", ") + "], function (" + ($moduleNames -join ", ") + ") {`nmodules = {}; // Workaround to prevent nested define calls`n");
Foreach ($file in $files){
    Write-Host "Building... $file";
    Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
    $fileContents = Get-Content $file;
    Add-Content $TempFile $fileContents
}
Add-Content $TempFile "return jsPDF;";
Add-Content $TempFile "});";


copy $TempFile $OutPutFile
del $TempFile