Add-Type -AssemblyName System.Drawing
$src = "d:\sites\Perlimpimpon\public\images\logo-jewelry.png"
$bmp = [System.Drawing.Bitmap]::FromFile($src)
$color = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
$bmp.MakeTransparent($color)
$bmp.Save("d:\sites\Perlimpimpon\public\images\logo-jewelry-transparent.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save("d:\sites\Perlimpimpon\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
