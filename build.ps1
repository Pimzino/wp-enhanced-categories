# Create array of files / folders required.
$BuildItems = @(
    ".\assets",
    ".\templates",
    ".\README.md",
    ".\wp-enhanced-categories.php"
)

# Create a build folder
if (Test-Path ".\build") {
    Write-Host "Removing old build directory"
    Remove-Item ".\build" -Recurse -Force

    Write-Host "Creating new build directory"
    New-Item "build" -ItemType Directory -Force
} else {
    Write-Host "Creating new build directory"
    New-Item "build" -ItemType Directory -Force
}

# Copy BuildItems to the build folder
$BuildItems | ForEach-Object {
    Write-Host "Copying $_ to the build folder"
    Copy-Item -Path $_ -Destination ".\build" -Force -Recurse
}

# Package plugin as a zip
Write-Host "Packaging plugin as zip file"
Compress-Archive -Path ".\build\*" -DestinationPath "wp-enhanced-categories.zip" -Force

# Delete Build Folder
Remove-Item ".\build" -Force -Recurse

Write-Host "Packaging complete. The release version of the plugin is in $(Join-Path $PSScriptRoot "wp-enhanced-categories.zip")" -ForegroundColor Green