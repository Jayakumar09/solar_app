function Get-PSI($url,$strategy){
    try{
        $res = Invoke-RestMethod -Uri "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$url&strategy=$strategy" -TimeoutSec 60
        $perf = [math]::Round($res.lighthouseResult.categories.performance.score*100)
        $acc = [math]::Round($res.lighthouseResult.categories.accessibility.score*100)
        $seo = [math]::Round($res.lighthouseResult.categories.seo.score*100)
        return @{strategy=$strategy; performance=$perf; accessibility=$acc; seo=$seo}
    } catch {
        return @{strategy=$strategy; error=$_.Exception.Message}
    }
}

$site = 'https://greenhybridpower.in'
Write-Output "Running PageSpeed Insights for $site"
$m = Get-PSI $site 'mobile'
if ($m.error) { Write-Output "Mobile PSI failed: $($m.error)" } else { Write-Output "Mobile - Performance: $($m.performance), Accessibility: $($m.accessibility), SEO: $($m.seo)" }
$d = Get-PSI $site 'desktop'
if ($d.error) { Write-Output "Desktop PSI failed: $($d.error)" } else { Write-Output "Desktop - Performance: $($d.performance), Accessibility: $($d.accessibility), SEO: $($d.seo)" }
