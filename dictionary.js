const searchWord = document.getElementById("word-input");
const toggleBtn = document.getElementById("toggle-mode");
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle("dark-mode");
});


searchWord.addEventListener('input', async () => {
    const wordInput = document.getElementById("word-input");
    const resultDiv = document.getElementById("result");
    const word = wordInput.value.trim();

    if (!word) return;

    resultDiv.textContent = "Loading...";

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) throw new Error("Word not found.");

        const data = await response.json();
        const entry = data[0];
        resultDiv.textContent = "";

        const title = document.createElement("h3");
        title.textContent = "Word Title: " + entry.word;
        resultDiv.appendChild(title);

        const phoneticData = entry.phonetics.find(phonetic => {
            return phonetic.audio && phonetic.audio.trim() !== "";
        }) || {};


        if (phoneticData.text) {
            const phoneticPara = document.createElement("p");
            phoneticPara.textContent = `Phonetic: ${phoneticData.text}`;
            resultDiv.appendChild(phoneticPara);
        }
        // Meanings and Definitions

        if (entry.meanings && entry.meanings.length > 0) {
            const meaningsContainer = document.createElement("div");

            const firstMeaning = entry.meanings[0];
            if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
                const def = firstMeaning.definitions[0];

                const defPara = document.createElement("p");
                defPara.textContent = `meaning: ${def.definition}`;

                meaningsContainer.appendChild(defPara);
            }

            resultDiv.appendChild(meaningsContainer);

            if (phoneticData.audio && phoneticData.audio.trim() !== "") {
                const audioElement = document.createElement("audio");
                audioElement.controls = true;
                audioElement.src = phoneticData.audio;
                audioElement.style.marginTop = "10px";
                resultDiv.appendChild(audioElement);
            }
        }


    } catch (error) {
        resultDiv.textContent = error.message;
    }
});