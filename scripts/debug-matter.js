const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filePath = path.join(process.cwd(), 'src/app/work/projects/debug.mdx');
try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    console.log("Frontmatter:", data);
    console.log("Content:", content);
} catch (e) {
    console.error("Error:", e);
}
