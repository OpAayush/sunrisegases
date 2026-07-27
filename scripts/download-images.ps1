$imageDir = "C:\TDP\sunrisegases\public\images\products"
if (-not (Test-Path $imageDir)) { New-Item -ItemType Directory -Path $imageDir -Force | Out-Null }

$images = @(
  # Gases product images
  "oxygen-cylinder.jpg",
  "nitrogen-cylinder.jpg",
  "argon-cylinder.jpg",
  "carbon-dioxide-cylinder.jpg",
  "hydrogen-cylinder.jpg",
  "helium-cylinder.jpg",
  "dissolved-acetylene-cylinder.jpg",
  "lpg-cylinder.jpg",
  "ammonia-cylinder.jpg",
  # Gas mixtures
  "zero-air-cylinder.jpg",
  "argonite-cylinder.jpg",
  "hydrogen-nitrogen-cylinder.jpg",
  "p10-gas-cylinder.jpg",
  "breathing-air-cylinder.jpg",
  # Specialty
  "uhp-gases-cylinder.jpg",
  # Refrigerants
  "r22-gas.jpg",
  "r134a-gas.jpg",
  "r404a-gas.jpg",
  "r407c-gas.jpg",
  "r410a-gas.jpg",
  "r123-refrigerant.jpg",
  # Cryogenic
  "dry-ice.jpg",
  "liquid-nitrogen-dewar.jpg",
  "liquid-nitrogen-container-dewar.jpg",
  # Equipment
  "cylinder-valve.jpg",
  "gas-regulator.jpg",
  "industrial-manifold.jpg",
  "gas-handling-accessories.jpg",
  # Fire safety
  "abc-fire-extinguisher.jpg",
  "co2-fire-extinguisher.jpg",
  "water-fire-extinguisher.jpg",
  "foam-fire-extinguisher.jpg",
  "dry-chemical-powder-extinguisher.jpg",
  # Balloons
  "advertising-balloon.jpg",
  # Industries
  "construction-industry.jpg",
  "power-energy-industry.jpg",
  "aerospace-industry.jpg"
)

$baseUrl = "http://sunrisegases.com/wp-content/uploads/products"

Write-Host "Downloading $($images.Length) product images to $imageDir..."
Write-Host ""

$downloaded = 0
$skipped = 0
$errors = @()

foreach ($img in $images) {
  $path = Join-Path $imageDir $img
  if (Test-Path $path) {
    Write-Host "  SKIP $img (already exists)"
    $skipped++
    continue
  }

  $url = "$baseUrl/$img"
  try {
    Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK   $img"
    $downloaded++
  } catch {
    Write-Host "  FAIL $img — $($_.Exception.Message)"
    $errors += $img
  }
}

Write-Host ""
Write-Host "Done: $downloaded downloaded, $skipped skipped, $($errors.Count) errors"
if ($errors.Count -gt 0) {
  Write-Host "Failed:"
  $errors | ForEach-Object { Write-Host "  - $_" }
}
