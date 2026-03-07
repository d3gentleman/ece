import fs from 'fs';
import path from 'path';

export function getArticleContent(slug: string) {
  try {
    const fullPath = path.join(process.cwd(), 'content', `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return fileContents;
  } catch (error) {
    return null;
  }
}
