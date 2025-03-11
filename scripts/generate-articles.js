const fs = require('fs');
const path = require('path');
const glob = require('glob');

function parseFrontMatter(mdContent) {
    let frontMatter = '';
    let inFrontMatter = false;
    const lines = mdContent.split('\n');

    for (let line of lines) {
        if (line.trim() === '---') {
            inFrontMatter = !inFrontMatter;
            if (!inFrontMatter) break;
        } else if (inFrontMatter) {
            frontMatter += line + '\n';
        }
    }

    try {
        const frontMatterJson = JSON.parse(frontMatter.replace(/^\s+|\s+$/g, ''));
        return frontMatterJson;
    } catch (e) {
        console.error('解析前置元數據錯誤:', e);
        return {};
    }
}

function generateArticlesJson() {
    const postsDir = 'post';
    const files = glob.sync('*.md', { cwd: postsDir });
    const articles = [];

    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const mdContent = fs.readFileSync(filePath, 'utf8');
        const frontMatter = parseFrontMatter(mdContent);
        articles.push({
            filename: file,
            title: frontMatter.title || file.replace('.md', ''),
            tags: frontMatter.tags || []
        });
    });

    const jsonContent = JSON.stringify(articles, null, 2);
    fs.writeFileSync('articles.json', jsonContent);
    console.log('已生成 articles.json');
}

generateArticlesJson();
