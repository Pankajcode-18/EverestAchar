$src = ".\images"
$dest = ".\client\public\images"

$null = New-Item -ItemType Directory -Force -Path "$dest\logo"
$null = New-Item -ItemType Directory -Force -Path "$dest\banner"
$null = New-Item -ItemType Directory -Force -Path "$dest\achar"
$null = New-Item -ItemType Directory -Force -Path "$dest\gallery"
$null = New-Item -ItemType Directory -Force -Path "$dest\owners"

# Logo
Copy-Item "$src\ChatGPT Image Aug 4, 2026, 02_29_58 AM.png" "$dest\logo\logo.png" -Force

# Banner
Copy-Item "$src\ChatGPT Image Aug 4, 2026, 02_32_01 AM.png" "$dest\banner\hero-banner.png" -Force
Copy-Item "$src\1000102498.jpg" "$dest\banner\packaging-banner.jpg" -Force
Copy-Item "$src\Gemini_Generated_Image_a42f8fa42f8fa42f.png" "$dest\banner\promo-banner.png" -Force
Copy-Item "$src\Gemini_Generated_Image_13v32i13v32i13v3.png" "$dest\banner\mountain-spice-banner.png" -Force
Copy-Item "$src\Gemini_Generated_Image_uczlcouczlcouczl.png" "$dest\banner\himalayan-feast.png" -Force

# Achar Products
Copy-Item "$src\chicken.png" "$dest\achar\chicken-achar.png" -Force
Copy-Item "$src\mutton.png" "$dest\achar\mutton-achar.png" -Force
Copy-Item "$src\Gundruk.png" "$dest\achar\gundruk-achar.png" -Force
Copy-Item "$src\Timur.png" "$dest\achar\timur-achar.png" -Force
Copy-Item "$src\tama.png" "$dest\achar\tama-achar.png" -Force
Copy-Item "$src\lapsi.png" "$dest\achar\lapsi-achar.png" -Force
Copy-Item "$src\khalpi.png" "$dest\achar\khalpi-achar.png" -Force
Copy-Item "$src\til.jpg" "$dest\achar\til-achar.jpg" -Force
Copy-Item "$src\1000102526.jpg" "$dest\achar\dalle-khursani.jpg" -Force
Copy-Item "$src\1000102505.jpg" "$dest\achar\garlic-achar.jpg" -Force
Copy-Item "$src\1000102523.jpg" "$dest\achar\fish-achar.jpg" -Force
Copy-Item "$src\1000102492.jpg" "$dest\achar\mango-achar.jpg" -Force
Copy-Item "$src\1000102495.jpg" "$dest\achar\radish-achar.jpg" -Force
Copy-Item "$src\1000102490.jpg" "$dest\achar\lemon-achar.jpg" -Force
Copy-Item "$src\1000102529.jpg" "$dest\achar\mixed-achar.jpg" -Force
Copy-Item "$src\1000102468 (1).jpg" "$dest\achar\raw-garlic-achar.jpg" -Force
Copy-Item "$src\1000102480.jpg" "$dest\achar\fried-garlic-achar.jpg" -Force

# Gallery
Copy-Item "$src\1000102471.jpg" "$dest\gallery\shelf-jars-1.jpg" -Force
Copy-Item "$src\1000102474.jpg" "$dest\gallery\shelf-jars-full.jpg" -Force
Copy-Item "$src\1000102477.jpg" "$dest\gallery\fresh-batches.jpg" -Force
Copy-Item "$src\1000102504.jpg" "$dest\gallery\table-pickles.jpg" -Force
Copy-Item "$src\1000102505.jpg" "$dest\gallery\packaged-assortment.jpg" -Force
Copy-Item "$src\1000102523.jpg" "$dest\gallery\jar-closeup-1.jpg" -Force
Copy-Item "$src\1000102526.jpg" "$dest\gallery\jar-closeup-2.jpg" -Force
Copy-Item "$src\1000102498.jpg" "$dest\gallery\official-packaging.jpg" -Force
Copy-Item "$src\1000102483.mp4" "$dest\gallery\pickle-showcase.mp4" -Force

# Owners
Copy-Item "$src\1000102498.jpg" "$dest\owners\sunita-kathayat-banner.jpg" -Force
Copy-Item "$src\Gemini_Generated_Image_a42f8fa42f8fa42f.png" "$dest\owners\business-owners-card.png" -Force

Write-Output "Images successfully organized!"
