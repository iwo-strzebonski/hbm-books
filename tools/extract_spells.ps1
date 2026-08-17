$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$file = "$repoRoot\ObsidianNotes\rules\01. Księga Magii.md"
$content = Get-Content $file -Raw
$lines = $content -split '\r?\n'

$inSpells = $false
$currentDiscipline = "Ogólna"
$currentSpell = ""
$spellLines = @()
$outDir = "$repoRoot\ObsidianNotes\spells"

function SaveSpell {
    param($disc, $name, $lines)
    if ($name -eq "" -or $lines.Count -eq 0) { return }
    
    $discSafe = ($disc.ToLower() -replace '\s+', '-') -replace '[^a-z0-9\-ąćęłńóśźż]', ''
    if ($discSafe -eq "") { $discSafe = "ogolne" }
    
    $yaml = @("---", "tags:", "  - foundry/compendium/spells", "  - spell", "  - $discSafe")
    foreach ($l in $lines) {
        if ($l -match "^\*\s*Koszt Many:\s*(.*)") { $yaml += "mana_cost: '$($matches[1].Trim().Replace("'", "''"))'" }
        if ($l -match "^\*\s*Czas(?: trwania)?:\s*(.*)") { $yaml += "duration: '$($matches[1].Trim().Replace("'", "''"))'" }
        if ($l -match "^\*\s*Zasięg:\s*(.*)") { $yaml += "range: '$($matches[1].Trim().Replace("'", "''"))'" }
        if ($l -match "^\*\s*Czas [Rr]zucania:\s*(.*)") { $yaml += "cast_time: '$($matches[1].Trim().Replace("'", "''"))'" }
    }
    $yaml += "---"
    $yaml += "# $name"
    $yaml += ""
    $yaml += $lines
    
    $safeName = $name -replace '[\\/:\*\?"<>\|]', '_'
    $dir = Join-Path $outDir $discSafe
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $outPath = Join-Path $dir "$safeName.md"
    $yaml -join "`n" | Set-Content -Path $outPath -Encoding UTF8
    Write-Host "Saved spell: $discSafe / $name"
}

for ($i=0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    if ($line -match "^##\s*Rozdział V.*Lista Zaklęć") {
        $inSpells = $true
        continue
    }
    if ($line -match "^##\s*Rozdział VI.*Superzaklęcia") {
        SaveSpell $currentDiscipline $currentSpell $spellLines
        $inSpells = $true
        $currentDiscipline = "Superzaklęcia"
        $currentSpell = ""
        $spellLines = @()
        continue
    }
    if ($line -match "^##\s*Rozdział VII.*Tworzenie Zaklęć" -or $line -match "^##\s*Rozdział VII.*") {
        SaveSpell $currentDiscipline $currentSpell $spellLines
        break
    }
    
    if ($inSpells) {
        if ($line -match "^#+\s+(.*)") {
            $headerText = $matches[1].Trim()
            
            $isSpell = $false
            $j = $i + 1
            while ($j -lt $lines.Count -and $lines[$j] -match "^\s*$") { $j++ }
            if ($j -lt $lines.Count -and ($lines[$j] -match "^\*\s*Próg [Zz]aklęcia:" -or $lines[$j] -match "^\*\s*Koszt Many:" -or $lines[$j] -match "^\s*Wymagania:")) {
                $isSpell = $true
            }
            
            if ($isSpell) {
                SaveSpell $currentDiscipline $currentSpell $spellLines
                $currentSpell = $headerText
                $spellLines = @()
            } else {
                if ($currentSpell -eq "") {
                    $currentDiscipline = $headerText
                } else {
                    SaveSpell $currentDiscipline $currentSpell $spellLines
                    $currentDiscipline = $headerText
                    $currentSpell = ""
                    $spellLines = @()
                }
            }
        } else {
            if ($currentSpell -ne "") {
                $spellLines += $line
            }
        }
    }
}
Write-Host "Spell extraction complete!" -ForegroundColor Green
