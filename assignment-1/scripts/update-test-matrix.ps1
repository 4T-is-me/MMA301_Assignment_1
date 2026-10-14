param(
    [string]$ResultsPath = "$PSScriptRoot/../docs/automated-test-results.json",
    [string]$WorkbookPath = "$PSScriptRoot/../docs/Test_Matrix.xlsx"
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$results = Get-Content -LiteralPath $ResultsPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($results.numTotalTests -eq 0) { throw 'Jest results contain no tests.' }
$workbook = [IO.Path]::GetFullPath($WorkbookPath)
$zip = [IO.Compression.ZipFile]::Open($workbook, [IO.Compression.ZipArchiveMode]::Update)
function Read-Part([string]$name) {
    $reader = [IO.StreamReader]::new($zip.GetEntry($name).Open())
    try { return $reader.ReadToEnd() } finally { $reader.Dispose() }
}
function Write-Part([string]$name, [string]$content) {
    $old = $zip.GetEntry($name)
    if ($old) { $old.Delete() }
    $writer = [IO.StreamWriter]::new($zip.CreateEntry($name).Open(), [Text.UTF8Encoding]::new($false))
    try { $writer.Write($content) } finally { $writer.Dispose() }
}
function Escape-Xml($value) { return [Security.SecurityElement]::Escape([string]$value) }
try {
    [xml]$book = Read-Part 'xl/workbook.xml'
    [xml]$rels = Read-Part 'xl/_rels/workbook.xml.rels'
    [xml]$types = Read-Part '[Content_Types].xml'
    $sheetNamespace = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'
    $relNamespace = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    $existing = @($book.workbook.sheets.sheet) | Where-Object { $_.name -eq 'Automated Testing' }
    if ($existing) {
        $rid = $existing.GetAttribute('id', $relNamespace)
        $relationship = @($rels.Relationships.Relationship) | Where-Object { $_.Id -eq $rid }
        $part = 'xl/' + $relationship.Target
    } else {
        $sheetId = 1 + (@($book.workbook.sheets.sheet) | ForEach-Object { [int]$_.sheetId } | Measure-Object -Maximum).Maximum
        $relId = 1 + (@($rels.Relationships.Relationship) | ForEach-Object { [int]($_.Id -replace 'rId','') } | Measure-Object -Maximum).Maximum
        $part = "xl/worksheets/sheet$sheetId.xml"
        $sheet = $book.CreateElement('sheet', $sheetNamespace)
        $sheet.SetAttribute('name', 'Automated Testing')
        $sheet.SetAttribute('sheetId', [string]$sheetId)
        $sheet.SetAttribute('id', $relNamespace, "rId$relId") | Out-Null
        $book.workbook.sheets.AppendChild($sheet) | Out-Null
        $relation = $rels.CreateElement('Relationship', $rels.DocumentElement.NamespaceURI)
        $relation.SetAttribute('Id', "rId$relId")
        $relation.SetAttribute('Type', "$relNamespace/worksheet")
        $relation.SetAttribute('Target', "worksheets/sheet$sheetId.xml")
        $rels.DocumentElement.AppendChild($relation) | Out-Null
        $override = $types.CreateElement('Override', $types.DocumentElement.NamespaceURI)
        $override.SetAttribute('PartName', "/$part")
        $override.SetAttribute('ContentType', 'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml')
        $types.DocumentElement.AppendChild($override) | Out-Null
        Write-Part 'xl/workbook.xml' $book.OuterXml
        Write-Part 'xl/_rels/workbook.xml.rels' $rels.OuterXml
        Write-Part '[Content_Types].xml' $types.OuterXml
        [xml]$app = Read-Part 'docProps/app.xml'
        $app.Properties.HeadingPairs.vector.variant[1].i4 = [string](@($book.workbook.sheets.sheet).Count)
        $titles = $app.Properties.TitlesOfParts.vector
        $title = $app.CreateElement('vt', 'lpstr', 'http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes')
        $title.InnerText = 'Automated Testing'
        $titles.AppendChild($title) | Out-Null
        $titles.SetAttribute('size', [string](@($book.workbook.sheets.sheet).Count))
        Write-Part 'docProps/app.xml' $app.OuterXml
    }
    $rows = [Collections.Generic.List[object]]::new()
    $runDate = [DateTimeOffset]::FromUnixTimeMilliseconds([long]$results.startTime).ToOffset([TimeSpan]::FromHours(7)).ToString('yyyy-MM-dd HH:mm:ss zzz')
    $rows.Add(@('Automated Testing', 'Jest + jest-expo (SDK 57) + React Native Testing Library'))
    $rows.Add(@('Run time (Asia/Saigon)', $runDate))
    $rows.Add(@('Command', 'npm run test -- --json --outputFile=docs/automated-test-results.json'))
    $rows.Add(@('Actual totals', "PASS: $($results.numPassedTests); FAIL: $($results.numFailedTests); PENDING: $($results.numPendingTests); suites passed: $($results.numPassedTestSuites)/$($results.numTotalTestSuites)"))
    $rows.Add(@('Scope', 'AsyncStorage uses the official in-memory mock; native image picker, icons and toast presentation are mocked. Remount verifies provider hydration, not a physical device restart. Manual matrix results are unchanged.'))
    $rows.Add(@('Other checks', 'Test/config ESLint: PASS. Project lint: 2 existing errors and 3 warnings in src. tsc --noEmit: no tsconfig in this JavaScript project; typecheck unavailable.'))
    $rows.Add(@('ID', 'Area', 'Test case / asserted behavior', 'Actual result', 'Duration (ms)', 'Evidence file', 'Failure details'))
    $index = 0
    foreach ($suite in $results.testResults) {
        foreach ($test in $suite.assertionResults) {
            $index++
            $status = switch ($test.status) { 'passed' { 'PASS' } 'failed' { 'FAIL' } default { $test.status.ToUpperInvariant() } }
            $file = '__tests__/' + [IO.Path]::GetFileName($suite.name)
            $rows.Add(@(('AT{0:D3}' -f $index), ($test.ancestorTitles -join ' / '), $test.title, $status, $test.duration, $file, ($test.failureMessages -join "`n")))
        }
    }
    $xml = [Text.StringBuilder]::new()
    [void]$xml.Append('<worksheet xmlns="' + $sheetNamespace + '"><sheetViews><sheetView workbookViewId="0"><pane ySplit="7" topLeftCell="A8" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="18" customWidth="1"/><col min="2" max="2" width="45" customWidth="1"/><col min="3" max="3" width="95" customWidth="1"/><col min="4" max="5" width="18" customWidth="1"/><col min="6" max="7" width="55" customWidth="1"/></cols><sheetData>')
    $rowNumber = 0
    foreach ($row in $rows) {
        $rowNumber++
        [void]$xml.Append('<row r="' + $rowNumber + '">')
        for ($column = 0; $column -lt $row.Count; $column++) {
            $reference = [string][char](65 + $column) + $rowNumber
            [void]$xml.Append('<c r="' + $reference + '" t="inlineStr"><is><t xml:space="preserve">' + (Escape-Xml $row[$column]) + '</t></is></c>')
        }
        [void]$xml.Append('</row>')
    }
    [void]$xml.Append('</sheetData><autoFilter ref="A7:G' + $rowNumber + '"/></worksheet>')
    Write-Part $part $xml.ToString()
    Write-Output "Updated Automated Testing sheet: $index actual Jest cases."
} finally { $zip.Dispose() }
