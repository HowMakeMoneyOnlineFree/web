document.addEventListener('DOMContentLoaded', function() {
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');
    const params = new URLSearchParams(window.location.search);
    const keywordFromQuery = params.get('q') || '';
    const keyword = keywordFromQuery.replace(/-/g, ' ').trim();
    
    function capitalizeEachWord(str) { if (!str) return ''; return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }
    
    // ▼▼▼ MODIFIED: generateSeoTitle function updated to remove the number ▼▼▼
    function generateSeoTitle(baseKeyword) { 
        const hookWords = ['Expert', 'Essential', 'Smart', 'Simple', 'Complete', 'Practical', 'Actionable', 'Beginner', 'Advanced', 'Guide', 'Tips', 'Strategies', 'Explained']; 
        const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)];
        const capitalizedKeyword = capitalizeEachWord(baseKeyword); 
        return `${randomHook} ${capitalizedKeyword}`; 
    }

    function processSpintax(text) {
        const spintaxPattern = /{([^{}]+)}/g;
        while (spintaxPattern.test(text)) {
            text = text.replace(spintaxPattern, (match, choices) => {
                const options = choices.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
        }
        return text;
    }

    if (!keyword) { detailTitle.textContent = 'Content Not Found'; detailBody.innerHTML = '<p>Sorry, the requested content could not be found. Please return to the <a href="index.html">homepage</a>.</p>'; if (relatedPostsContainer) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; } return; }

    function populateMainContent(term) {
        const newTitle = generateSeoTitle(term);
        const capitalizedTermForArticle = capitalizeEachWord(term);
        document.title = `${newTitle} | NiceFinance`;
        detailTitle.textContent = newTitle;

        // ▼▼▼ MODIFIED: Main image size changed to extra large (1200x800) ▼▼▼
        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(term)}&w=1200&h=800&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${newTitle}">`;

        const spintaxArticleTemplate = `
            <p>{Welcome to|This is|You're viewing} our {comprehensive guide|detailed analysis|expert overview} on <strong>${capitalizedTermForArticle}</strong>. {Understanding|Navigating|Mastering} this {financial topic|important subject|key concept} is {essential for|critically important to|crucial for} {building long-term wealth|achieving financial security|making smart money moves}. {In this article|Here}, we'll {break down|explore|discuss} the {key aspects|important details|core principles} to {give you a clearer|provide a better|help you gain a solid} {understanding|perspective|insight}.</p>
            <p>Every {strategy|element|component} within <strong>${capitalizedTermForArticle}</strong> {plays a significant role|is fundamentally important|is vital} in {shaping|determining|influencing} your financial {future|well-being|success}. From {risk assessment|initial investment|strategic planning} and {market trends|portfolio diversification|budget allocation} to {long-term growth|exit strategies|tax implications}, {everything contributes|it all adds up} to the final {outcome|result|return on investment}. {Observe|Learn|See} how {financial experts|seasoned investors|successful individuals} {leverage|integrate|utilize} {various|different|multiple} {tools and tactics|methods|approaches} to {achieve|secure|maximize} their {financial goals|returns|objectives} related to <strong>${capitalizedTermForArticle}</strong>.</p>
            <p>We {hope|trust} this {collection of insights|in-depth guide|detailed information} about <strong>${capitalizedTermForArticle}</strong> {empowers your financial decisions|improves your financial literacy|inspires your next financial move}. {Feel free|Don't hesitate} to {bookmark|save|remember} the {strategies|tips|concepts} you find {valuable|useful|helpful} as a {reference|guide|foundation} for your own financial planning. {Happy investing|To your financial success|Good luck on your journey}!</p>
        `;

        detailBody.innerHTML = processSpintax(spintaxArticleTemplate);
    }

    function generateRelatedPosts(term) {
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);
        script.onload = () => script.remove();
        script.onerror = () => { relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Could not load related topics.</div>'; script.remove(); }
    }

    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1];
        relatedPostsContainer.innerHTML = '';
        if (!suggestions || suggestions.length === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; return; }
        const originalKeyword = keyword.toLowerCase();
        let relatedCount = 0;
        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 11) return;
            relatedCount++;
            const keywordForUrl = relatedTerm.replace(/\s/g, '-').toLowerCase();
            const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;
            
            // ▼▼▼ MODIFIED: Related posts image size changed to extra large (1200x800) ▼▼▼
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(relatedTerm)}&w=1200&h=800&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
            const newRelatedTitle = generateSeoTitle(relatedTerm);
            const card = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy"><div class="content-card-body"><h3>${newRelatedTitle}</h3></div></a></article>`;
            relatedPostsContainer.innerHTML += card;
        });
        if (relatedCount === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; }
    };

    populateMainContent(keyword);
    generateRelatedPosts(keyword);
});
