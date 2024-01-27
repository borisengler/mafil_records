import fs from 'fs';
import path from 'path';

const buildDir = path.join(__dirname, 'build');
const indexPath = path.join(buildDir, 'index.html');

// Update the title and favicon
function updateIndexHTML(): void {
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return;
    }

    let updatedData = data.replace(
      /<title>.*<\/title>/,
      '<title>Measuring Records</title>'
    );

    updatedData = updatedData.replace(
      /<link rel="icon"[\s\S]*?\/>/,
      '<link rel="icon" type="image/png" href="/favicon.png" />'
    );

    fs.writeFile(indexPath, updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error updating index.html:', err);
        return;
      }
      console.log('index.html updated successfully');
    });
  });
}

updateIndexHTML();
