$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$vaultDir = "$repoRoot\ObsidianNotes"

$targetDirs = @(
    "$vaultDir\npcs",
    "$vaultDir\concepts",
    "$vaultDir\organizations",
    "$vaultDir\locations",
    "$vaultDir\races"
)

$reportFile = "$vaultDir\short_descriptions.md"
$threshold = 150

$shortFiles = @()

foreach ($dir in $targetDirs) {
    if (-not (Test-Path $dir)) { continue }
    
    $files = Get-ChildItem -Path $dir -Recurse -Filter "*.md"
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Remove YAML frontmatter
        $contentWithoutYaml = $content -replace '(?s)^---\n.*?\n---\n', ''
        
        # Count words
        $words = $contentWithoutYaml -split '\s+' | Where-Object { $_ -ne '' }
        $wordCount = $words.Count
        
        if ($wordCount -lt $threshold) {
            $shortFiles += [PSCustomObject]@{
                Path = $file.FullName -replace [regex]::Escape("$vaultDir\"), ""
                WordCount = $wordCount
            }
        }
    }
}

$reportContent = @("# Short Descriptions Report (< $threshold words)", "")
if ($shortFiles.Count -eq 0) {
    $reportContent += "All analyzed files meet the word count threshold!"
} else {
    $reportContent += "| File Path | Word Count |"
    $reportContent += "|-----------|------------|"
    foreach ($item in $shortFiles | Sort-Object WordCount) {
        $reportContent += "| $($item.Path) | $($item.WordCount) |"
    }
}

$reportContent -join "`n" | Set-Content -Path $reportFile -Encoding UTF8

Write-Host "Audit complete! Found $($shortFiles.Count) short files." -ForegroundColor Cyan
Write-Host "Report saved to: $reportFile" -ForegroundColor Green
