import { useEffect, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import { LANGS, LANGUAGE_NAMES, META_LABELS, UI_TEXT } from "./content";
import { resolveImagePath, textFor } from "./utils";

const getStoredLanguage = () => {
  const stored = localStorage.getItem("acharyaLanguage");
  return LANGS.includes(stored) ? stored : "en";
};

function Header({ lang, onChange }) {
  return (
    <header className="site-header">
      <h1>
        <Link id="site-title-link" to="/">
          {textFor(UI_TEXT.title, lang)}
        </Link>
      </h1>
      <nav className="language-bar" aria-label="Language chooser">
        <label htmlFor="language-select" id="language-label">
          {textFor(UI_TEXT.language, lang)}
        </label>
        <select
          id="language-select"
          value={lang}
          onChange={(event) => onChange(event.target.value)}
        >
          {LANGS.map((language) => (
            <option key={language} value={language}>
              {LANGUAGE_NAMES[language]}
            </option>
          ))}
        </select>
      </nav>
    </header>
  );
}

function Home({ lang }) {
  const [acharyas, setAcharyas] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        setError(false);
        const response = await fetch("/api/acharyas");
        if (!response.ok) throw new Error("not found");
        const data = await response.json();
        if (isActive) setAcharyas(data);
      } catch {
        if (isActive) setError(true);
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  if (error) {
    return (
      <section>
        <h2>{textFor(UI_TEXT.homeHeading, lang)}</h2>
        <ul className="card-list">
          <li>{textFor(UI_TEXT.notFound, lang)}</li>
        </ul>
      </section>
    );
  }

  return (
    <section>
      <h2>{textFor(UI_TEXT.homeHeading, lang)}</h2>
      <ul className="card-list">
        {acharyas.map((acharya) => (
          <li key={acharya.id}>
            <Link to={`/acharya/${acharya.id}`}>
              {textFor(acharya.name, lang)}
            </Link>
            <p className="birth-day">
              {textFor(UI_TEXT.birthDay, lang)}: {textFor(acharya.birthDay, lang)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MetaRow({ label, value }) {
  return (
    <>
      <div className="meta-label">{label}</div>
      <div>{value}</div>
    </>
  );
}

function Detail({ lang }) {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(false);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      if (!id) {
        if (isActive) {
          setDetail(null);
          setError(true);
        }
        return;
      }

      try {
        setError(false);
        const response = await fetch(`/api/acharyas/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error("not found");
        const data = await response.json();
        if (isActive) {
          setShowImage(true);
          setDetail(data);
        }
      } catch {
        if (isActive) {
          setDetail(null);
          setError(true);
        }
      }
    };

    load();

    return () => {
      isActive = false;
    };
  }, [id]);

  const imageSrc = detail
    ? resolveImagePath(detail.image || detail.meta?.image || detail.content?.image)
    : "";

  if (error) {
    return <p className="error-text">{textFor(UI_TEXT.notFound, lang)}</p>;
  }

  if (!detail) return null;

  const metaKeys = [
    "birthYear",
    "birthNakshatra",
    "otherNames",
    "sishyas",
    "thaniyan",
    "birthPlace",
  ];

  return (
    <article className="detail-card">
      <h2>{textFor(detail.meta?.name, lang)}</h2>
      {imageSrc && showImage ? (
        <figure className="acharya-media">
          <img
            className="acharya-image"
            src={imageSrc}
            alt={textFor(detail.meta?.name, lang)}
            loading="lazy"
            onError={() => setShowImage(false)}
          />
        </figure>
      ) : null}
      <div className="meta-grid">
        {metaKeys.map((key) => {
          const valueRaw = detail.meta?.[key];
          const value = Array.isArray(valueRaw)
            ? valueRaw.map((item) => textFor(item, lang)).join(", ")
            : textFor(valueRaw, lang);
          return (
            <MetaRow
              key={key}
              label={textFor(META_LABELS[key], lang)}
              value={value}
            />
          );
        })}
      </div>
      <section className="description-block">
        <h3>{textFor(UI_TEXT.description, lang)}</h3>
        <p>{textFor(detail.content?.description, lang)}</p>
      </section>
    </article>
  );
}

function App() {
  const [lang, setLang] = useState(() => getStoredLanguage());

  useEffect(() => {
    localStorage.setItem("acharyaLanguage", lang);
    document.title = textFor(UI_TEXT.title, lang);
  }, [lang]);

  return (
    <BrowserRouter>
      <Header lang={lang} onChange={setLang} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/acharya/:id" element={<Detail lang={lang} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
