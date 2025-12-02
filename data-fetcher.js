// ============================================================================
// Social Media Data Fetcher
// Fetch data from GitHub, Medium, and LinkedIn
// ============================================================================

class SocialDataFetcher {
    constructor() {
        this.githubUsername = 'namratesh';
        this.mediumUsername = 'namratesh';
        this.linkedinProfile = 'namratesh';
        this.cacheExpiry = 3600000; // 1 hour in milliseconds
    }

    // ========================================================================
    // GitHub API Integration
    // ========================================================================

    async fetchGitHubData() {
        try {
            const cached = this.getCache('github');
            if (cached) return cached;

            const [userResponse, reposResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${this.githubUsername}`),
                fetch(`https://api.github.com/users/${this.githubUsername}/repos?sort=updated&per_page=10`)
            ]);

            if (!userResponse.ok || !reposResponse.ok) {
                throw new Error('GitHub API request failed');
            }

            const userData = await userResponse.json();
            const reposData = await reposResponse.json();

            const data = {
                profile: {
                    name: userData.name,
                    bio: userData.bio,
                    followers: userData.followers,
                    following: userData.following,
                    publicRepos: userData.public_repos,
                    avatarUrl: userData.avatar_url,
                    htmlUrl: userData.html_url
                },
                repositories: reposData.map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    language: repo.language,
                    url: repo.html_url,
                    updatedAt: repo.updated_at,
                    topics: repo.topics
                }))
            };

            this.setCache('github', data);
            return data;
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            return null;
        }
    }

    // ========================================================================
    // Medium RSS Feed Integration
    // ========================================================================

    async fetchMediumArticles() {
        try {
            const cached = this.getCache('medium');
            if (cached) return cached;

            // Using rss2json.com API to convert Medium RSS to JSON
            const response = await fetch(
                `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/@${this.mediumUsername}/feed`
            );

            if (!response.ok) {
                throw new Error('Medium RSS fetch failed');
            }

            const data = await response.json();

            if (data.status !== 'ok') {
                throw new Error('Medium RSS parse error');
            }

            const articles = data.items.map(item => ({
                title: item.title,
                description: this.stripHtml(item.description).substring(0, 200) + '...',
                link: item.link,
                pubDate: new Date(item.pubDate),
                thumbnail: item.thumbnail,
                categories: item.categories,
                author: item.author,
                readTime: this.estimateReadTime(item.content)
            }));

            this.setCache('medium', articles);
            return articles;
        } catch (error) {
            console.error('Error fetching Medium articles:', error);
            return null;
        }
    }

    // ========================================================================
    // LinkedIn Integration (Manual/Static)
    // ========================================================================

    getLinkedInData() {
        // LinkedIn doesn't provide public API access
        // This is a structure for manually updating your LinkedIn data
        return {
            profile: {
                name: 'Namratesh Shrivastav',
                headline: 'Data Scientist & Generative AI Expert',
                url: 'https://www.linkedin.com/in/namratesh/',
                connections: '500+',
                location: 'India'
            },
            recentPosts: [
                // Manually add your recent LinkedIn posts here
                {
                    title: 'Update this with your latest LinkedIn post',
                    date: new Date(),
                    engagement: { likes: 0, comments: 0 }
                }
            ]
        };
    }

    // ========================================================================
    // Utility Functions
    // ========================================================================

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    estimateReadTime(content) {
        const text = this.stripHtml(content);
        const wordsPerMinute = 200;
        const wordCount = text.split(/\s+/).length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min read`;
    }

    // ========================================================================
    // Cache Management
    // ========================================================================

    getCache(key) {
        try {
            const cached = localStorage.getItem(`social_data_${key}`);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp > this.cacheExpiry) {
                localStorage.removeItem(`social_data_${key}`);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Cache read error:', error);
            return null;
        }
    }

    setCache(key, data) {
        try {
            const cacheObject = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(`social_data_${key}`, JSON.stringify(cacheObject));
        } catch (error) {
            console.error('Cache write error:', error);
        }
    }

    clearCache() {
        ['github', 'medium', 'linkedin'].forEach(key => {
            localStorage.removeItem(`social_data_${key}`);
        });
    }

    // ========================================================================
    // Update All Data
    // ========================================================================

    async updateAll(options = { forceRefresh: false }) {
        if (options.forceRefresh) {
            this.clearCache();
        }

        const results = {
            github: null,
            medium: null,
            linkedin: null,
            timestamp: new Date()
        };

        try {
            // Fetch all data in parallel
            const [github, medium, linkedin] = await Promise.all([
                this.fetchGitHubData(),
                this.fetchMediumArticles(),
                Promise.resolve(this.getLinkedInData())
            ]);

            results.github = github;
            results.medium = medium;
            results.linkedin = linkedin;

            return results;
        } catch (error) {
            console.error('Error updating social data:', error);
            return results;
        }
    }
}

// ============================================================================
// UI Update Functions
// ============================================================================

class SocialDataUI {
    constructor(fetcher) {
        this.fetcher = fetcher;
        this.isLoading = false;
    }

    // Update GitHub section
    updateGitHubStats(data) {
        if (!data) return;

        // Update stats in hero section if available
        const statsContainer = document.querySelector('.hero-stats');
        if (statsContainer && data.profile) {
            // You can update project count or other stats here
            const projectStat = statsContainer.querySelector('.stat-item:nth-child(2) .stat-number');
            if (projectStat) {
                projectStat.textContent = `${data.profile.publicRepos}+`;
            }
        }

        console.log('GitHub data:', data);
    }

    // Update Medium articles
    updateMediumArticles(articles) {
        if (!articles || articles.length === 0) return;

        const blogGrid = document.getElementById('mediumArticles');
        if (!blogGrid) return;

        // Clear existing articles
        blogGrid.innerHTML = '';

        // Add new articles (limit to 6)
        articles.slice(0, 6).forEach(article => {
            const card = this.createBlogCard(article);
            blogGrid.appendChild(card);
        });

        console.log('Medium articles updated:', articles.length);
    }

    createBlogCard(article) {
        const card = document.createElement('div');
        card.className = 'blog-card';

        const icon = this.getIconForCategory(article.categories);

        card.innerHTML = `
            <div class="blog-image">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="blog-content">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <div class="blog-meta">
                    <span><i class="fab fa-medium"></i> Medium</span>
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
                <a href="${article.link}" target="_blank" class="blog-link">
                    Read Article <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        return card;
    }

    getIconForCategory(categories) {
        if (!categories || categories.length === 0) return 'book';

        const category = categories[0].toLowerCase();
        const iconMap = {
            'ai': 'robot',
            'machine-learning': 'brain',
            'data-science': 'chart-line',
            'python': 'code',
            'tutorial': 'graduation-cap',
            'nlp': 'comments'
        };

        for (const [key, icon] of Object.entries(iconMap)) {
            if (category.includes(key)) return icon;
        }

        return 'book';
    }

    // Update LinkedIn info
    updateLinkedInInfo(data) {
        if (!data) return;
        console.log('LinkedIn data:', data);
    }

    // Show loading state
    showLoading(button) {
        if (!button) return;
        this.isLoading = true;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    }

    // Hide loading state
    hideLoading(button, success = true) {
        if (!button) return;
        this.isLoading = false;
        button.disabled = false;

        if (success) {
            button.innerHTML = '<i class="fas fa-check"></i> Updated!';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            }, 2000);
        } else {
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            }, 2000);
        }
    }

    // Main update function
    async updateAllData(forceRefresh = false) {
        const button = document.getElementById('refreshDataBtn');
        this.showLoading(button);

        try {
            const results = await this.fetcher.updateAll({ forceRefresh });

            // Update UI with fetched data
            this.updateGitHubStats(results.github);
            this.updateMediumArticles(results.medium);
            this.updateLinkedInInfo(results.linkedin);

            this.hideLoading(button, true);

            // Show success notification
            this.showNotification('Data updated successfully!', 'success');
        } catch (error) {
            console.error('Update error:', error);
            this.hideLoading(button, false);
            this.showNotification('Failed to update data', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification (you can enhance this)
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================================================
// Initialize
// ============================================================================

// Export for use in main script
window.SocialDataFetcher = SocialDataFetcher;
window.SocialDataUI = SocialDataUI;
