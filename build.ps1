# Build script for jsPDF
# modeled on koGrid's build.ps1
$CurrentDir = (Get-Location).Path;
$OutputDir = $CurrentDir + "\dist";
$OutPutFile = $OutputDir + "\jspdf.amd.js";
$TempFile = $OutPutFile + ".temp";

Write-Host "Collecting files...";

$exclude = "(\.min|BlobBuilder\.js$|Downloadify|demo|deps|test)";
$files = (dir "jspdf.plugin.*.js") + (dir -path libs -recurse *.js | where { !$_.PSIsContainer } | where {$_.FullName -notmatch $exclude } | foreach {$_.FullName})

foreach ($file in $files) { echo "$file" }

Write-Host "JSBuild Starting...";

$filesToAppend = @();
$moduleNames = @();
foreach ($file in $files) {
    $content = Get-Content $file;
    if ($content -match "define\(") {
        $moduleNames += ([io.path]::GetFileNameWithoutExtension($file));
        Write-Host "Building... $file";
        Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
        $fileContents = $content -replace "define\(", ("define(`"" + ([io.path]::GetFileNameWithoutExtension($file)) + "`", ") ;
        Add-Content $TempFile $fileContents;
    } else {
       $filesToAppend = $filesToAppend + $file; 
    }
}

Add-Content $TempFile ("define([" + (($moduleNames | foreach {"`"" + $_ + "`""}) -join ", ") + "], function (" + ($moduleNames -join ", ") + ") {`nmodules = {}; // Workaround to prevent nested define calls`n");

Add-Content $TempFile (Get-Content "jspdf.js");

Foreach ($file in $filesToAppend){
    Write-Host "Building... $file";
    Add-Content $TempFile "`n/***********************************************`n* FILE: $file`n***********************************************/";
    $fileContents = Get-Content $file;
    Add-Content $TempFile $fileContents
}

Add-Content $TempFile "return jsPDF;";
Add-Content $TempFile "});";

Write-Host "JSBuild Cleaning up..."
copy $TempFile $OutPutFile
del $TempFile

Write-Host "Done."
