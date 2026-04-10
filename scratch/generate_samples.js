const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '../public/images/creations');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

// Simplified mapping based on my analysis
// Note: This is an automated generation based on the analysis I did earlier
// I will manually adjust the categories and names in the final array

const articles = files.map((file, index) => {
    const id = `auto-${(index + 1).toString().padStart(3, '0')}`;
    let category = "Boucles d'oreilles"; // Default
    let name = `Création Perlipimpon ${index + 1}`;
    let description = "Magnifique création artisanale faite main dans notre atelier.";
    let price = 35;

    // Categories based on prefixes/batch analysis summarized before
    // 1-50: mostly earrings/rings
    // 51-100: variety
    // 101-165: variety with many bracelets at the end

    // This is a placeholder logic, I will fill the REAL names in the next step
    return {
        id,
        titre: name,
        description,
        prix: price,
        categorie: category,
        pierres: [],
        photos: [`/images/creations/${file}`],
        dateCreation: new Date().toISOString(),
        dateMaj: new Date().toISOString(),
        enVedette: index < 12
    };
});

console.log(JSON.stringify(articles, null, 2));
