[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Encoding = [System.Text.Encoding]::UTF8

$weaponsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcI3WQZb4HvKKZfJUbGC46D88HmJCJ_5qktlOFJT3v2yP0kV-uOR0V4yUCDkNOO-20tpOVQiekKLVA/pub?output=csv&gid=667492832"
$gearUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRcI3WQZb4HvKKZfJUbGC46D88HmJCJ_5qktlOFJT3v2yP0kV-uOR0V4yUCDkNOO-20tpOVQiekKLVA/pub?output=csv&gid=0"

Write-Host "Downloading Weapons and Armor..."
$weaponsContent = $wc.DownloadString($weaponsUrl)
$weaponsLines = $weaponsContent -split '\r?\n'

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$vaultDir = "$repoRoot\ObsidianNotes"

$outWeapons = "$vaultDir\items\weapons"
$outArmor = "$vaultDir\items\armor"
$outGear = "$vaultDir\items\gear"

if (-not (Test-Path $outWeapons)) { New-Item -ItemType Directory -Force -Path $outWeapons | Out-Null }
if (-not (Test-Path $outArmor)) { New-Item -ItemType Directory -Force -Path $outArmor | Out-Null }
if (-not (Test-Path $outGear)) { New-Item -ItemType Directory -Force -Path $outGear | Out-Null }

$mode = ""
foreach ($line in $weaponsLines) {
    if ($line -match "^Broń:") { $mode = "Weapons"; continue }
    if ($line -match "^Pancerz:") { $mode = "Armor"; continue }
    if ($line -match "^Tarcza") { $mode = "Shield" }
    
    if ($line -match "^\s*," -or $line -match "^\s*$") { continue }
    
    if ($mode -eq "Weapons") {
        $csv = $line | ConvertFrom-Csv -Header "Name","Price","Damage","Traits","Extra"
        $name = $csv.Name
        $price = $csv.Price
        $dmg = $csv.Damage
        $traits = $csv.Traits
        if (-not $name) { continue }
        
        $yaml = @("---", "tags:", "  - foundry/compendium/items", "  - weapon")
        if ($price) { $yaml += "price: '$($price.Replace("'", "''"))'" }
        if ($dmg) { $yaml += "damage: '$($dmg.Replace("'", "''"))'" }
        if ($traits) { $yaml += "traits: '$($traits.Replace("'", "''"))'" }
        $yaml += "---"
        $yaml += "# $name"
        $yaml += ""
        if ($price) { $yaml += "* **Cena:** $price" }
        if ($dmg) { $yaml += "* **Obrażenia:** $dmg" }
        if ($traits) { $yaml += "* **Cechy:** $traits" }
        
        $safeName = $name -replace '[\\/:\*\?"<>\|]', '_'
        $yaml -join "`n" | Set-Content -Path (Join-Path $outWeapons "$safeName.md") -Encoding UTF8
        Write-Host "Saved Weapon: $name"
    }
    elseif ($mode -eq "Armor") {
        $csv = $line | ConvertFrom-Csv -Header "Name","Price","ArmorPoints","Reqs","Traits"
        $name = $csv.Name
        $price = $csv.Price
        $ap = $csv.ArmorPoints
        $reqs = $csv.Reqs
        $traits = $csv.Traits
        if (-not $name) { continue }
        
        $yaml = @("---", "tags:", "  - foundry/compendium/items", "  - armor")
        if ($price) { $yaml += "price: '$($price.Replace("'", "''"))'" }
        if ($ap) { $yaml += "armor_points: '$($ap.Replace("'", "''"))'" }
        if ($reqs) { $yaml += "requirements: '$($reqs.Replace("'", "''"))'" }
        if ($traits) { $yaml += "traits: '$($traits.Replace("'", "''"))'" }
        $yaml += "---"
        $yaml += "# Pancerz $name"
        $yaml += ""
        if ($price) { $yaml += "* **Cena:** $price" }
        if ($ap) { $yaml += "* **Punkty Pancerza:** $ap" }
        if ($reqs) { $yaml += "* **Wymagania:** $reqs" }
        if ($traits) { $yaml += "* **Cechy:** $traits" }
        
        $safeName = "Pancerz " + ($name -replace '[\\/:\*\?"<>\|]', '_')
        $yaml -join "`n" | Set-Content -Path (Join-Path $outArmor "$safeName.md") -Encoding UTF8
        Write-Host "Saved Armor: Pancerz $name"
    }
    elseif ($mode -eq "Shield") {
        $csv = $line | ConvertFrom-Csv -Header "Name","Price","Desc","Extra1","Extra2"
        $name = $csv.Name
        $price = $csv.Price
        $desc = $csv.Desc
        if (-not $name) { continue }
        
        $yaml = @("---", "tags:", "  - foundry/compendium/items", "  - shield")
        if ($price) { $yaml += "price: '$($price.Replace("'", "''"))'" }
        $yaml += "---"
        $yaml += "# $name"
        $yaml += ""
        if ($price) { $yaml += "* **Cena:** $price" }
        $yaml += ""
        $yaml += $desc
        
        $safeName = $name -replace '[\\/:\*\?"<>\|]', '_'
        $yaml -join "`n" | Set-Content -Path (Join-Path $outArmor "$safeName.md") -Encoding UTF8
        Write-Host "Saved Shield: $name"
        $mode = "Done"
    }
}

Write-Host "Downloading Gear..."
$gearContent = $wc.DownloadString($gearUrl)
$gearLines = $gearContent -split '\r?\n'

$first = $true
foreach ($line in $gearLines) {
    if ($first) { $first = $false; continue }
    if ($line -match "^\s*," -or $line -match "^\s*$") { continue }
    
    $csv = $line | ConvertFrom-Csv -Header "Name","Price","Desc","Extra1","Extra2"
    $name = $csv.Name
    $price = $csv.Price
    $desc = $csv.Desc
    if (-not $name) { continue }
    if ($name -match "^\*") { continue } # Skip footer
    
    $yaml = @("---", "tags:", "  - foundry/compendium/items", "  - gear")
    if ($price) { $yaml += "price: '$($price.Replace("'", "''"))'" }
    $yaml += "---"
    $yaml += "# $name"
    $yaml += ""
    if ($price) { $yaml += "* **Cena:** $price" }
    $yaml += ""
    $yaml += $desc
    
    $safeName = $name -replace '[\\/:\*\?"<>\|]', '_'
    $yaml -join "`n" | Set-Content -Path (Join-Path $outGear "$safeName.md") -Encoding UTF8
    Write-Host "Saved Gear: $name"
}
Write-Host "Item extraction complete!" -ForegroundColor Green
