// Article management system using localStorage
console.log('editor.js loaded!');
const STORAGE_KEY = 'blog_articles';

// Get all articles from localStorage
function getArticles() {
  const articles = localStorage.getItem(STORAGE_KEY);
  return articles ? JSON.parse(articles) : [];
}

// Save articles to localStorage
function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Display all saved articles
function displayArticles() {
  const articles = getArticles();
  const articlesList = document.getElementById('articlesList');

  if (articles.length === 0) {
    articlesList.innerHTML = '<div class="empty-state">No articles yet. Create your first article!</div>';
    return;
  }

  // Sort articles by date (newest first)
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  articlesList.innerHTML = articles.map((article, index) => `
    <div class="article-item-editor">
      <div class="article-item-info">
        <h3>${article.title}</h3>
        <p>${formatDate(article.date)} • <span style="color: ${article.published ? '#8fff8f' : '#ffa500'}">${article.published ? 'Published' : 'Draft'}</span></p>
      </div>
      <div class="article-actions">
        ${!article.published ? `<button class="btn-publish" onclick="publishArticle(${index})">Publish</button>` : ''}
        <button class="btn-delete" onclick="deleteArticle(${index})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Add new article
function addArticle(article, published = false) {
  const articles = getArticles();
  articles.push({
    id: Date.now(),
    ...article,
    published: published,
    createdAt: new Date().toISOString()
  });
  saveArticles(articles);
  displayArticles();
}

// Publish article
function publishArticle(index) {
  const articles = getArticles();
  articles[index].published = true;
  saveArticles(articles);
  displayArticles();
  showMessage('Article published successfully!');
}

// Delete article
function deleteArticle(index) {
  if (confirm('Are you sure you want to delete this article?')) {
    const articles = getArticles();
    articles.splice(index, 1);
    saveArticles(articles);
    displayArticles();
    showMessage('Article deleted successfully!');
  }
}

// Show success message
function showMessage(message) {
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message';
  messageDiv.textContent = message;

  const form = document.getElementById('articleForm');
  form.parentNode.insertBefore(messageDiv, form);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Password protection
const EDITOR_PASSWORD = 'kR9#mT$pL2@nX7wQ';
const PASSWORD_SESSION_KEY = 'editor_authenticated';

// Check password and show editor immediately on page load
(function() {
  console.log('Password check starting');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordProtection);
  } else {
    initPasswordProtection();
  }
})();

function initPasswordProtection() {
  console.log('Initializing password protection');

  // Check if already authenticated
  const sessionAuth = sessionStorage.getItem(PASSWORD_SESSION_KEY);
  if (sessionAuth === 'true') {
    console.log('Already authenticated');
    showEditor();
    return;
  }

  // Setup password form
  const passwordInput = document.getElementById('passwordInput');
  const passwordSubmit = document.getElementById('passwordSubmit');
  const passwordError = document.getElementById('passwordError');

  console.log('Elements found:', {
    input: !!passwordInput,
    button: !!passwordSubmit,
    error: !!passwordError
  });

  if (!passwordInput || !passwordSubmit) {
    console.error('Password elements not found!');
    return;
  }

  // Handle unlock button click
  passwordSubmit.onclick = function() {
    console.log('Unlock clicked, checking password...');
    checkAndUnlock();
  };

  // Handle Enter key
  passwordInput.onkeypress = function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      console.log('Enter pressed, checking password...');
      checkAndUnlock();
    }
  };

  function checkAndUnlock() {
    const password = passwordInput.value;
    console.log('Password length:', password.length);

    if (password === EDITOR_PASSWORD) {
      console.log('Password correct!');
      sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true');
      passwordError.textContent = '';
      showEditor();
    } else {
      console.log('Password incorrect');
      passwordError.textContent = 'Incorrect password. Please try again.';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  // Focus password input
  setTimeout(() => passwordInput.focus(), 100);
}

function showEditor() {
  console.log('Showing editor...');
  const prompt = document.getElementById('passwordPrompt');
  const content = document.getElementById('editorContent');

  if (prompt) prompt.style.display = 'none';
  if (content) {
    content.style.display = 'flex';
    initializeEditor();
  }
}

// Initialize the editor
function initializeEditor() {
  const form = document.getElementById('articleForm');
  const saveDraftBtn = document.getElementById('saveDraftBtn');
  const clearBtn = document.getElementById('clearBtn');
  const dateInput = document.getElementById('articleDate');

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  dateInput.value = today;

  // Function to get form data
  function getFormData() {
    const formData = new FormData(form);
    return {
      title: formData.get('title'),
      preview: formData.get('preview'),
      content: formData.get('content'),
      date: formData.get('date')
    };
  }

  // Handle "Save as Draft" button
  saveDraftBtn.addEventListener('click', function() {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const article = getFormData();
    addArticle(article, false); // false = draft
    form.reset();
    dateInput.value = today;
    showMessage('Article saved as draft!');
  });

  // Handle "Publish Article" form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const article = getFormData();
    addArticle(article, true); // true = published
    form.reset();
    dateInput.value = today;
    showMessage('Article published successfully!');
  });

  // Handle clear button
  clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the form?')) {
      form.reset();
      dateInput.value = today;
    }
  });

  // Display existing articles
  displayArticles();
}
