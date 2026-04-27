$sitemapUrl = 'https://greenhybridpower.in/sitemap.xml'
try {
    $s = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing -TimeoutSec 30
    $xml = [xml]$s.Content
    $urls = $xml.urlset.url | ForEach-Object { $_.loc }
    Write-Output "Found $($urls.Count) URLs in sitemap"
    $errors = @()
    foreach ($u in $urls) {
        try {
            $r = Invoke-WebRequest -Uri $u -UseBasicParsing -Method Head -TimeoutSec 15
            Write-Output "$u -> $($r.StatusCode)"
            if ($r.StatusCode -ge 400) { $errors += "$u -> $($r.StatusCode)" }
        } catch {
            Write-Output "$u -> ERROR: $($_.Exception.Message)"
            $errors += "$u -> ERROR: $($_.Exception.Message)"
        }
    }
    if ($errors.Count -gt 0) {
        Write-Output "`nBroken URLs:`n"
        $errors | ForEach-Object { Write-Output $_ }
        exit 2
    } else {
        Write-Output "`nAll sitemap URLs returned 2xx/3xx"
        exit 0
    }
} catch {
    Write-Output "Failed to fetch or parse sitemap: $($_.Exception.Message)"
    exit 1
}
