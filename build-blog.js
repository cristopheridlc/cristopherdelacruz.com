const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

const postsDir = path.join(__dirname, 'posts');
const blogDir = path.join(__dirname, 'blog');

// Ensure directories exist
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}
fs.mkdirSync(blogDir, { recursive: true });

// Zero-dependency Front Matter parser
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, body: content };
  }
  const yamlText = match[1];
  const body = match[2];
  const metadata = {};
  
  yamlText.split(/\r?\n/).forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
      metadata[key] = value;
    }
  });
  
  return { metadata, body };
}

// Read and compile posts
function buildBlog() {
  console.log('Compiling blog posts...');
  
  // Filter out template.md so it doesn't get published as an article
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md') && file !== 'template.md');
  const posts = [];

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const slug = file.replace('.md', '');
    
    const { metadata, body } = parseFrontMatter(content);
    
    let title = metadata.title;
    let date = metadata.date || new Date().toISOString().split('T')[0];
    let description = metadata.description;
    
    let parsedBody = body;
    const titleMatch = body.match(/^#\s+(.+)$/m);
    
    // SMART FALLBACK 1: Extract Title from first '# Heading' in markdown if missing
    if (!title) {
      if (titleMatch) {
        title = titleMatch[1].trim();
      } else {
        // Fallback to humanizing the file name slug
        title = slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    // Always strip the first H1 heading from the body to avoid double-rendering
    if (titleMatch) {
      parsedBody = body.replace(titleMatch[0], '').trim();
    }
    
    // SMART FALLBACK 2: Extract Description from the first normal text paragraph if missing
    if (!description) {
      const paragraphs = parsedBody.split(/\r?\n\r?\n/);
      const firstParagraph = paragraphs.find(p => {
        const trimmed = p.trim();
        return trimmed && 
               !trimmed.startsWith('#') && 
               !trimmed.startsWith('-') && 
               !trimmed.startsWith('*') && 
               !trimmed.startsWith('>');
      });

      if (firstParagraph) {
        // Strip markdown symbols and clean up links for a pristine description preview
        description = firstParagraph
          .trim()
          .replace(/[#*`_~]/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert [Link](url) -> Link
          .substring(0, 160); // Safe length for SEO preview snippet
        
        if (firstParagraph.trim().length > 160) {
          description += '...';
        }
      } else {
        description = 'Read article for details.';
      }
    }
    
    const htmlContent = marked.parse(parsedBody);
    
    posts.push({
      slug,
      title,
      date,
      description,
      htmlContent
    });
  });

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Generate individual post pages
  posts.forEach(post => {
    const postHtml = generatePostTemplate(post);
    fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), postHtml, 'utf-8');
    console.log(`- Generated post: /blog/${post.slug}.html`);
  });

  // Generate blog listing page
  const indexHtml = generateListingTemplate(posts);
  fs.writeFileSync(path.join(blogDir, 'index.html'), indexHtml, 'utf-8');
  console.log('- Generated blog index: /blog/index.html');
  
  console.log('Blog compilation complete!');
}

// Premium layout template shared wrapper
function getBaseHtml(title, description, bodyContent, activeTab = 'blog') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; frame-src 'none'; object-src 'none';">
    <meta name="description" content="${description}">
    <title>${title} | Cristopher De La Cruz</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="icon" href="../favicon.ico" type="image/x-icon">
</head>
<body class="centered">
    <main>
        <header class="card-header-tabs">
            <a href="/" class="card-tab ${activeTab === 'home' ? 'active' : ''}">Home</a>
            <a href="/resume/" class="card-tab ${activeTab === 'resume' ? 'active' : ''}">Resume</a>
            <a href="/blog/" class="card-tab ${activeTab === 'blog' ? 'active' : ''}">Blog</a>
        </header>
        <div class="card-body">
            ${bodyContent}
        </div>
    </main>
</body>
</html>
`;
}

// Generate Listing Page HTML
function generateListingTemplate(posts) {
  let listContent = `
    <header class="blog-header">
        <h1>Writing</h1>
        <p class="subtitle">Thoughts on data engineering, analytics, and business intelligence.</p>
    </header>
    <div class="blog-list">
  `;

  if (posts.length === 0) {
    listContent += `
      <div class="empty-blog">
          <p>No articles published yet. Stay tuned!</p>
      </div>
    `;
  } else {
    posts.forEach(post => {
      // Format date beautifully
      const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });

      listContent += `
        <article class="blog-post-item">
            <header class="post-meta">
                <time datetime="${post.date}">${formattedDate}</time>
            </header>
            <h2 class="post-title">
                <a href="/blog/${post.slug}.html">${post.title}</a>
            </h2>
            <p class="post-desc">${post.description}</p>
            <a href="/blog/${post.slug}.html" class="read-more-link">Read article &rarr;</a>
        </article>
      `;
    });
  }

  listContent += `</div>`;
  return getBaseHtml('Blog', 'Articles and guides about BI, analytics, and data warehousing.', listContent, 'blog');
}

// Generate Individual Post Page HTML
function generatePostTemplate(post) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  const postContent = `
    <article class="post-full">
        <header class="post-header">
            <time datetime="${post.date}" class="post-date">${formattedDate}</time>
            <h1>${post.title}</h1>
        </header>
        <div class="post-body">
            ${post.htmlContent}
        </div>
        <footer class="post-footer">
            <a href="/blog/" class="back-link">&larr; Back to all articles</a>
        </footer>
    </article>
  `;

  return getBaseHtml(post.title, post.description, postContent, 'blog');
}

// Run compilation
buildBlog();
