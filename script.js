const API_URL = "http://127.0.0.1:8000/search";

function toggleDobby(show) {
    document.getElementById('dobbySpeech').style.display = show ? 'block' : 'none';
}

async function triggerMagic() {
    const prompt = document.getElementById('userPrompt').value.trim();
    const speech = document.getElementById('dobbySpeech');

    if (!prompt) {
        speech.innerText = "Master must type something! Dobby cannot summon empty magic!";
        toggleDobby(true);
        setTimeout(() => toggleDobby(false), 3000);
        return;
    }

    // UI animations
    const root = document.getElementById('searchRoot');
    root.classList.add('searching');
    toggleDobby(true);
    speech.innerText = "Dobby feels the magic flowing... 🪄";

    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: prompt,
                k: 6
            })
        });

        const data = await res.json();
        renderBooks(data);


        document.getElementById('resultsSection').classList.remove('hidden');
        speech.innerText = "AHH! Such powerful tomes have appeared!";
    }
    catch (err) {
        speech.innerText = "Dark forces blocked the magic! Backend not responding!";
        console.error(err);
    }
    finally {
        root.classList.remove('searching');

        window.scrollTo({
            top: document.getElementById('resultsSection').offsetTop - 100,
            behavior: 'smooth'
        });
    }
}

function renderBooks(books) {
    const grid = document.getElementById('booksGrid');
    grid.innerHTML = "";

    if (!books || books.length === 0) {
        grid.innerHTML = `<p class="text-center text-amber-400 col-span-full">
            No ancient tomes were found for this spell 🧙‍♂️
        </p>`;
        return;
    }

    books.forEach(book => {
        grid.innerHTML += `
            <div class="book-card p-8 rounded-2xl relative overflow-hidden group">
                <div class="text-6xl mb-6 opacity-80 group-hover:scale-125 transition-transform">📖</div>

                <h3 class="font-fantasy text-2xl text-amber-300 mb-2">
                    ${book.title || "Unknown Tome"}
                </h3>

                <p class="text-amber-500/60 font-ancient mb-2">
                    By ${book.author || "Ancient Wizard"}
                </p>

                <div class="flex gap-2 mb-4 flex-wrap">
                    ${(book.genres || "").split(",").map(g =>
                        `<span class="text-[10px] border border-amber-900 px-2 py-0.5 rounded text-amber-700 uppercase">
                            ${g.trim()}
                        </span>`
                    ).join("")}
                </div>

                <p class="text-amber-100/70 text-sm leading-relaxed mb-6">
                    ${book.description?.slice(0, 220)}...
                </p>

                <a href="${book.url || '#'}" target="_blank"
                   class="block w-full text-center py-3 border border-amber-500/30
                          text-amber-400 font-fantasy text-sm tracking-widest
                          hover:bg-amber-500 hover:text-black transition-all">
                    Examine Full Scroll
                </a>

                <div class="absolute top-0 right-0 p-2 text-xl opacity-0 group-hover:opacity-100">✨</div>
            </div>
        `;
    });
}
