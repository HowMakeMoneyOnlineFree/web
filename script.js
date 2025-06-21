document.addEventListener('DOMContentLoaded', function() {
    let allKeywords = [];
    let currentIndex = 0;
    const batchSize = 15;
    let isLoading = false;
    const contentContainer = document.getElementById('auto-content-container');
    const loader = document.getElementById('loader');

    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array [i], array [j]] = [array [j], array [i]]; } }
    function capitalizeEachWord(str) { if (!str) return ''; return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }

    // MODIFIED: generateSeoTitle function updated for finance theme
    function generateSeoTitle(baseKeyword) {
        const hookWords = ['Expert', 'Essential', 'Smart', 'Simple', 'Complete', 'Practical', 'Actionable', 'Beginner', 'Advanced', 'Guide', 'Tips', 'Strategies', 'Explained'];
        const randomHook = hookWords [Math.floor(Math.random() * hookWords.length)];
        const randomNumber = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        const capitalizedKeyword = capitalizeEachWord(baseKeyword);
        return `${randomNumber}+ ${randomHook} ${capitalizedKeyword}`;
    }

    function loadNextBatch() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        const batch = allKeywords.slice(currentIndex, currentIndex + batchSize);

        setTimeout(() => {
            batch.forEach(keyword => {
                const keywordForUrl = keyword.replace(/\s/g, '-').toLowerCase();
                const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;

                // MODIFIED: Menggunakan URL Pinterest untuk gambar
                const pinterestQuery = encodeURIComponent(keyword + ' finance infographic');
                const imageUrl = `https://i.pinimg.com/originals/4a/ff/11/4aff11d7e65f831ca9184aa4a8a0050d.jpg`; // Placeholder, perlu logika pencarian Pinterest yang lebih kompleks

                const newTitle = generateSeoTitle(keyword);
                const cardHTML = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newTitle}" loading="lazy"><div class="content-card-body"><h3>${newTitle}</h3></div></a></article>`;
                contentContainer.innerHTML += cardHTML;
            });

            currentIndex += batch.length;
            loader.style.display = 'none';
            isLoading = false;
            if (currentIndex >= allKeywords.length) { window.removeEventListener('scroll', handleInfiniteScroll); loader.style.display = 'none'; }
        }, 500);
    }

    function handleInfiniteScroll() { if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight - 100) { loadNextBatch(); } }

    async function initializeDailyShuffle() {
        const today = new Date().toISOString().slice(0, 10);
        const storedDate = localStorage.getItem('shuffleDate');
        const storedKeywords = localStorage.getItem('shuffledKeywords');
        if (storedDate === today && storedKeywords) {
            allKeywords = JSON.parse(storedKeywords);
            startDisplay();
        } else {
            try {
                const response = await fetch('keyword.txt');
                if (!response.ok) throw new Error('keyword.txt file not found.');
                const text = await response.text();

                const keywords = text.split('\n')
                                     .map(k => k.trim())
                                     .filter(k => k.trim() !== '');

                shuffleArray(keywords);
                localStorage.setItem('shuffledKeywords', JSON.stringify(keywords));
                localStorage.setItem('shuffleDate', today);
                allKeywords = keywords;
                startDisplay();
            } catch (error) {
                console.error('Error:', error);
                contentContainer.innerHTML = `<p style="text-align:center; color:red;">${error.message}</p>`;
                loader.style.display = 'none';
            }
        }
    }

    function startDisplay() { if (allKeywords.length > 0) { loadNextBatch(); window.addEventListener('scroll', handleInfiniteScroll); } else { contentContainer.innerHTML = '<p>No keywords to display.</p>'; loader.style.display = 'none'; } }

    initializeDailyShuffle();
});
