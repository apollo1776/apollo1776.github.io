const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const yearEl = document.getElementById('year');

navToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  navToggle.classList.toggle('open');
});

document.addEventListener('click', (event) => {
  if (!navLinks || !navToggle) return;
  const isClickInsideNav = navLinks.contains(event.target);
  const isToggle = navToggle.contains(event.target);

  if (!isClickInsideNav && !isToggle) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }
});

yearEl.textContent = new Date().getFullYear();

const subscribeForm = document.querySelector('.subscribe-form');
subscribeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const emailInput = form.querySelector('input[type="email"]');
  if (!emailInput) return;

  const email = emailInput.value.trim();
  if (!email) return;

  alert(`Thanks for subscribing, ${email}!`);
  form.reset();
});

// Load and display articles from localStorage
const STORAGE_KEY = 'blog_articles';

function getArticles() {
  const articles = localStorage.getItem(STORAGE_KEY);
  return articles ? JSON.parse(articles) : [];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function loadArticles() {
  const articlesContainer = document.getElementById('articlesContainer');
  if (!articlesContainer) return;

  const allArticles = getArticles();

  // Filter to only show published articles
  const publishedArticles = allArticles.filter(article => article.published === true);

  // If no published articles, show placeholder blocks
  if (publishedArticles.length === 0) {
    const placeholderArticles = [
      {
        title: "The Future of AI in Everyday Life",
        preview: "Exploring how artificial intelligence is transforming our daily routines and reshaping industries. From smart homes to personalized healthcare, discover the innovations that are making our lives more efficient and connected.",
        date: "2024-01-15"
      },
      {
        title: "Building Scalable Tech Communities",
        preview: "A deep dive into creating sustainable tech ecosystems that foster innovation and collaboration. Learn the principles behind successful developer communities and how to nurture meaningful connections.",
        date: "2023-12-20"
      },
      {
        title: "Minimalist Design Philosophy",
        preview: "Why less is more in modern web design. Discover how simplicity, intentional spacing, and purposeful design choices can create more impactful user experiences that stand the test of time.",
        date: "2023-11-28"
      },
      {
        title: "Entrepreneurship in the Digital Age",
        preview: "Lessons learned from building products in today's fast-paced startup landscape. Navigate the challenges of modern entrepreneurship with insights on product-market fit, lean development, and sustainable growth.",
        date: "2023-11-10"
      },
      {
        title: "The Art of Rapid Prototyping",
        preview: "Transform ideas into working prototypes in record time without sacrificing quality. Master the techniques that successful founders use to validate concepts quickly and iterate based on real user feedback.",
        date: "2023-10-25"
      }
    ];

    articlesContainer.innerHTML = placeholderArticles.map(article => `
      <article class="article-item article-placeholder">
        <div class="article-content">
          <h3>${article.title}</h3>
          <p class="article-preview">${article.preview}</p>
          <div class="article-meta">
            <span>${formatDate(article.date)}</span>
            <a href="editor.html" class="read-more" style="color: var(--accent);">Create Article →</a>
          </div>
        </div>
      </article>
    `).join('');
    return;
  }

  // Sort articles by date (newest first)
  publishedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));

  articlesContainer.innerHTML = publishedArticles.map(article => `
    <article class="article-item">
      <div class="article-content">
        <h3>${article.title}</h3>
        <p class="article-preview">${article.preview}</p>
        <div class="article-meta">
          <span>${formatDate(article.date)}</span>
          <a href="#" class="read-more">Read more →</a>
        </div>
      </div>
    </article>
  `).join('');
}

// Load articles when the page loads
document.addEventListener('DOMContentLoaded', loadArticles);
