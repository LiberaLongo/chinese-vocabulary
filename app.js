let vocabulary = [];

const container = document.getElementById("vocabulary");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("partOfSpeech");
const resultCount = document.getElementById("resultCount");

// Load JSON
async function loadVocabulary() {

    try {
        const response = await fetch("./vocabulary.json");

        if (!response.ok) {
            throw new Error("Could not load vocabulary.json");
        }

        const data = await response.json();

        vocabulary = data.chinese;

        populateCategories();
        renderVocabulary(vocabulary);

    } catch (error) {
        console.error(error);
        container.textContent = "Error loading vocabulary.";
    }
}

// Generate categories from JSON
function populateCategories() {

    const categories = [
        ...new Set(
            vocabulary
                .map(item => item.part_of_speech)
                .filter(Boolean)
        )
    ];

    categories.sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categorySelect.appendChild(option);
    });
}

// Render vocabulary cards
function renderVocabulary(items) {

    container.replaceChildren();

    resultCount.textContent =
        `${items.length} vocabulary entries`;

    if (items.length === 0) {

        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No vocabulary found.";

        container.appendChild(empty);
        return;
    }

    items.forEach(item => {

        const card = document.createElement("article");
        card.className = "card";

        const top = document.createElement("div");
        top.className = "card-top";

        const chinese = document.createElement("h2");
        chinese.className = "chinese";
        chinese.textContent = item.chinese;

        top.appendChild(chinese);

        if (item.part_of_speech) {

            const category = document.createElement("span");
            category.className = "category";
            category.textContent = item.part_of_speech;

            top.appendChild(category);
        }

        const pinyin = document.createElement("p");
        pinyin.className = "pinyin";
        pinyin.textContent = item.pinyin || "";

        const english = document.createElement("div");
        english.className = "english";
        english.textContent = item.english || "No translation";

        const details = document.createElement("div");
        details.className = "details";

        if (item.characters) {
            addDetail(details, "Characters", item.characters);
        }

        if (item.note) {
            addDetail(details, "Note", item.note, "note");
        }

        card.append(top, pinyin, english, details);

        container.appendChild(card);
    });
}

// Create a detail row safely
function addDetail(parent, label, value, className = "") {

    const paragraph = document.createElement("p");

    if (className) {
        paragraph.className = className;
    }

    const strong = document.createElement("strong");
    strong.textContent = label + ": ";

    const text = document.createElement("span");
    text.textContent = value;

    paragraph.append(strong, text);
    parent.appendChild(paragraph);
}

// Search and filter
function filterVocabulary() {

    const query = searchInput.value
        .trim()
        .toLowerCase();

    const category = categorySelect.value;

    const filtered = vocabulary.filter(item => {

        const searchableFields = [
            item.chinese,
            item.pinyin,
            item.english,
            item.characters,
            item.part_of_speech,
            item.note
        ];

        const matchesSearch = searchableFields.some(value =>
            String(value ?? "")
                .toLowerCase()
                .includes(query)
        );

        const matchesCategory =
            !category || item.part_of_speech === category;

        return matchesSearch && matchesCategory;
    });

    renderVocabulary(filtered);
}

// Events
searchInput.addEventListener("input", filterVocabulary);

categorySelect.addEventListener("change", filterVocabulary);

// Start application
loadVocabulary();
