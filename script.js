const LANGS = ["en", "ta", "te", "kn", "hi", "sa"];
const LANGUAGE_NAMES = {
  en: "English",
  ta: "தமிழ்",
  te: "తెలుగు",
  kn: "ಕನ್ನಡ",
  hi: "हिन्दी",
  sa: "संस्कृतम्",
};

const UI_TEXT = {
  title: {
    en: "Acharya parampara",
    ta: "ஆச்சார்ய பரம்பரை",
    te: "ఆచార్య పరంపర",
    kn: "ಆಚಾರ್ಯ ಪರಂಪರೆ",
    hi: "आचार्य परम्परा",
    sa: "आचार्यपरम्परा",
  },
  language: {
    en: "Language",
    ta: "மொழி",
    te: "భాష",
    kn: "ಭಾಷೆ",
    hi: "भाषा",
    sa: "भाषा",
  },
  homeHeading: {
    en: "Acharyas and Birth Days",
    ta: "ஆச்சார்யர்களும் அவர்களின் பிறந்த தினங்களும்",
    te: "ఆచార్యులు మరియు వారి జన్మ దినాలు",
    kn: "ಆಚಾರ್ಯರು ಮತ್ತು ಅವರ ಜನ್ಮ ದಿನಗಳು",
    hi: "आचार्य और उनके जन्म दिवस",
    sa: "आचार्याः तथा तेषां जन्मदिनानि",
  },
  birthDay: {
    en: "Birth Day",
    ta: "பிறந்த நாள்",
    te: "జన్మ దినం",
    kn: "ಜನ್ಮ ದಿನ",
    hi: "जन्म दिवस",
    sa: "जन्मदिनम्",
  },
  notFound: {
    en: "Acharya data not found.",
    ta: "ஆச்சார்யர் தகவல் கிடைக்கவில்லை.",
    te: "ఆచార్య సమాచారం దొరకలేదు.",
    kn: "ಆಚಾರ್ಯ ಮಾಹಿತಿ ದೊರಕಲಿಲ್ಲ.",
    hi: "आचार्य का विवरण नहीं मिला।",
    sa: "आचार्यस्य विवरणं न लब्धम्।",
  },
  description: {
    en: "Description",
    ta: "விளக்கம்",
    te: "వివరణ",
    kn: "ವಿವರಣೆ",
    hi: "विवरण",
    sa: "वर्णनम्",
  },
};

const META_LABELS = {
  name: {
    en: "Name",
    ta: "பெயர்",
    te: "పేరు",
    kn: "ಹೆಸರು",
    hi: "नाम",
    sa: "नाम",
  },
  birthYear: {
    en: "Birth Year",
    ta: "பிறந்த ஆண்டு",
    te: "జన్మ సంవత్సరం",
    kn: "ಜನ್ಮ ವರ್ಷ",
    hi: "जन्म वर्ष",
    sa: "जन्मवर्षम्",
  },
  birthNakshatra: {
    en: "Birth Nakshatra",
    ta: "பிறந்த நக்ஷத்திரம்",
    te: "జన్మ నక్షత్రం",
    kn: "ಜನ್ಮ ನಕ್ಷತ್ರ",
    hi: "जन्म नक्षत्र",
    sa: "जन्मनक्षत्रम्",
  },
  otherNames: {
    en: "Other Names",
    ta: "மற்ற பெயர்கள்",
    te: "ఇతర పేర్లు",
    kn: "ಇತರೆ ಹೆಸರುಗಳು",
    hi: "अन्य नाम",
    sa: "अन्यनामानि",
  },
  sishyas: {
    en: "Sishyas",
    ta: "சிஷ்யர்கள்",
    te: "శిష్యులు",
    kn: "ಶಿಷ್ಯರು",
    hi: "शिष्य",
    sa: "शिष्याः",
  },
  thaniyan: {
    en: "Thaniyan",
    ta: "தனியன்",
    te: "తనియన్",
    kn: "ತನಿಯನ್",
    hi: "तानियन्",
    sa: "तनियन्",
  },
  birthPlace: {
    en: "Birth Place",
    ta: "பிறந்த இடம்",
    te: "జన్మ స్థలం",
    kn: "ಜನ್ಮ ಸ್ಥಳ",
    hi: "जन्म स्थान",
    sa: "जन्मस्थानम्",
  },
};

function currentLanguage() {
  const selected = localStorage.getItem("acharyaLanguage") || "en";
  return LANGS.includes(selected) ? selected : "en";
}

function textFor(field, lang) {
  return field?.[lang] || field?.en || "";
}

function initLanguageSelector(onChange) {
  const select = document.getElementById("language-select");
  if (!select) return;

  LANGS.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = LANGUAGE_NAMES[lang];
    select.appendChild(option);
  });

  select.value = currentLanguage();
  select.addEventListener("change", () => {
    localStorage.setItem("acharyaLanguage", select.value);
    onChange(select.value);
  });
}

function renderSharedLabels(lang) {
  const title = textFor(UI_TEXT.title, lang);
  document.title = title;

  const siteTitle = document.getElementById("site-title");
  if (siteTitle) siteTitle.textContent = title;

  const siteTitleLink = document.getElementById("site-title-link");
  if (siteTitleLink) siteTitleLink.textContent = title;

  const languageLabel = document.getElementById("language-label");
  if (languageLabel) languageLabel.textContent = textFor(UI_TEXT.language, lang);
}

async function renderHome(lang) {
  renderSharedLabels(lang);

  const heading = document.getElementById("home-heading");
  if (heading) heading.textContent = textFor(UI_TEXT.homeHeading, lang);

  const list = document.getElementById("acharya-list");
  if (!list) return;

  try {
    const response = await fetch("data/acharyas.json");
    if (!response.ok) throw new Error("not found");
    const acharyas = await response.json();

    list.innerHTML = "";
    acharyas.forEach((acharya) => {
      const li = document.createElement("li");
      const nameLink = document.createElement("a");
      const birthText = document.createElement("p");

      nameLink.href = `acharya.html?id=${encodeURIComponent(acharya.id)}`;
      nameLink.textContent = textFor(acharya.name, lang);

      birthText.className = "birth-day";
      birthText.textContent = `${textFor(UI_TEXT.birthDay, lang)}: ${textFor(
        acharya.birthDay,
        lang
      )}`;

      li.appendChild(nameLink);
      li.appendChild(birthText);
      list.appendChild(li);
    });
  } catch {
    list.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = textFor(UI_TEXT.notFound, lang);
    list.appendChild(li);
  }
}

function makeMetaRow(label, value) {
  const labelEl = document.createElement("div");
  labelEl.className = "meta-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("div");
  valueEl.textContent = value;

  return [labelEl, valueEl];
}

async function renderDetail(lang) {
  renderSharedLabels(lang);

  const detail = document.getElementById("acharya-detail");
  const error = document.getElementById("detail-error");
  if (!detail || !error) return;

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) {
    error.textContent = textFor(UI_TEXT.notFound, lang);
    error.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch(`acharya-data/${encodeURIComponent(id)}.json`);
    if (!response.ok) throw new Error("not found");
    const data = await response.json();

    error.classList.add("hidden");
    detail.innerHTML = "";

    const nameTitle = document.createElement("h2");
    nameTitle.textContent = textFor(data.meta.name, lang);

    const metaGrid = document.createElement("div");
    metaGrid.className = "meta-grid";

    [
      "birthYear",
      "birthNakshatra",
      "otherNames",
      "sishyas",
      "thaniyan",
      "birthPlace",
    ].forEach((key) => {
      const valueRaw = data.meta[key];
      const value = Array.isArray(valueRaw)
        ? valueRaw.map((item) => textFor(item, lang)).join(", ")
        : textFor(valueRaw, lang);

      const [labelEl, valueEl] = makeMetaRow(textFor(META_LABELS[key], lang), value);
      metaGrid.appendChild(labelEl);
      metaGrid.appendChild(valueEl);
    });

    const description = document.createElement("section");
    description.className = "description-block";

    const descriptionHeading = document.createElement("h3");
    descriptionHeading.textContent = textFor(UI_TEXT.description, lang);

    const descriptionText = document.createElement("p");
    descriptionText.textContent = textFor(data.content.description, lang);

    description.appendChild(descriptionHeading);
    description.appendChild(descriptionText);

    detail.appendChild(nameTitle);
    detail.appendChild(metaGrid);
    detail.appendChild(description);
  } catch {
    detail.innerHTML = "";
    error.textContent = textFor(UI_TEXT.notFound, lang);
    error.classList.remove("hidden");
  }
}

function initialize() {
  const page = document.body.dataset.page;

  const paint = (lang) => {
    if (page === "home") {
      renderHome(lang);
    } else if (page === "detail") {
      renderDetail(lang);
    }
  };

  initLanguageSelector(paint);
  paint(currentLanguage());
}

initialize();
