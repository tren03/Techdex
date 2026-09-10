import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import articlesRaw from "./data/articles.json";
import youtubeRaw from "./data/yt.json";
import { Item } from "./models";

type RawItem = Omit<Item, "addedAt"> & { addedAt: string };

type ExperienceRole = {
  title: string;
  type: string;
  start: Date;
  end: Date | null;
  location: string;
};

const EXPERIENCE_ROLES: ExperienceRole[] = [
  {
    title: "Associate SDE",
    type: "Full-time",
    start: new Date(2025, 6, 1),
    end: null,
    location: "India · Hybrid",
  },
  {
    title: "Full Stack Intern",
    type: "Internship",
    start: new Date(2024, 10, 1),
    end: new Date(2025, 6, 1),
    location: "Bengaluru, Karnataka, India · On-site",
  },
];

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function monthsBetween(start: Date, end: Date) {
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
}

function formatDuration(start: Date, end: Date) {
  const totalMonths = monthsBetween(start, end);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];

  if (years) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (months) parts.push(`${months} mo${months === 1 ? "" : "s"}`);

  return parts.join(" ") || "Less than 1 mo";
}

function formatDateRange(start: Date, end: Date | null) {
  return `${formatMonthYear(start)} to ${end ? formatMonthYear(end) : "present"}`;
}

export default function App() {
  const { pathname } = useLocation();
  const [searchByTable, setSearchByTable] = useState({
    youtube: "",
    articles: "",
  });
  const [selectedSummary, setSelectedSummary] = useState<string | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const youtube = useMemo(
    () =>
      (youtubeRaw as RawItem[]).map((entry) => ({
        ...entry,
        addedAt: new Date(entry.addedAt),
      })).reverse(),
    [],
  );

  const articles = useMemo(
    () =>
      (articlesRaw as RawItem[]).map((entry) => ({
        ...entry,
        addedAt: new Date(entry.addedAt),
      })).reverse(),
    [],
  );

  const isHome = pathname === "/";
  const today = new Date();
  const visibleTables = pathname === "/articles"
    ? [{ key: "articles", title: "Articles", items: articles }]
    : [{ key: "youtube", title: "YouTube", items: youtube }];

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="site-title" href="/">Techdex</a>
        <nav aria-label="Main navigation">
          <a href="/youtube">YouTube</a>
          <a href="/articles">Articles</a>
        </nav>
      </header>

      <div className="content">
        {isHome ? (
          <section className="portfolio" aria-labelledby="portfolio-title">
            <div className="portfolio-intro">
              <p className="portfolio-label">
                Software engineer <span aria-hidden="true">·</span> {formatDuration(EXPERIENCE_ROLES[0].start, today)} experience
              </p>
              <h1 id="portfolio-title">Hi, I'm Vishnu.</h1>
              <p className="portfolio-lede">
                I build backend systems and keep a personal index of the videos and articles I return to.
              </p>
            </div>

            <nav className="portfolio-links" aria-label="Portfolio links">
              <a href="https://ymxadwabx8zitdmi.public.blob.vercel-storage.com/hire_me.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
              <a href="https://github.com/tren03" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/vishnu-sethuraman-269b63210/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="/youtube">YouTube</a>
              <a href="/articles">Articles</a>
            </nav>

            <dl className="portfolio-facts">
              <div>
                <dt>Focus</dt>
                <dd>
                  Backend engineering<br />
                  Full-stack engineering<br />
                  Distributed systems
                </dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>Python, Golang, React, PostgreSQL, AWS</dd>
              </div>
              <div>
                <dt>Interests</dt>
                <dd>GNU/Linux, split keyboards, vim</dd>
              </div>
            </dl>

            <section className="experience" aria-labelledby="experience-title">
              <h2 id="experience-title">Experience</h2>
              <div className="experience-company">
                <header className="experience-company-header">
                  <h3>MPOWER Financing</h3>
                  <p>{formatDuration(EXPERIENCE_ROLES[1].start, today)}</p>
                </header>
                <ol className="experience-roles">
                  {EXPERIENCE_ROLES.map((role) => (
                    <li className="experience-role" key={role.title}>
                      <h3>{role.title}</h3>
                      <p className="experience-role-type">{role.type}</p>
                      <p>
                        {formatDateRange(role.start, role.end)} · {formatDuration(role.start, role.end ?? today)}
                      </p>
                      <p>{role.location}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </section>
        ) : (
        visibleTables.map(({ key, title, items }) => {
          const query = searchByTable[key as keyof typeof searchByTable].toLowerCase();
          const filtered = items.filter((item) =>
            item.title.toLowerCase().includes(query) ||
            item.url.toLowerCase().includes(query),
          );

          return (
            <section className="table-section" key={key} id={key}>
              <div className="section-heading">
                <h1>{title}</h1>
                <label>
                  <span className="visually-hidden">Search {title}</span>
                  <input
                    type="search"
                    placeholder="Search"
                    value={searchByTable[key as keyof typeof searchByTable]}
                    onChange={(event) =>
                      setSearchByTable((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="table-scroll">
                <table>
                  <caption className="visually-hidden">{title} links</caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">URL</th>
                      <th scope="col">Summary</th>
                      <th scope="col">Date added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5}>No results match your search.</td>
                      </tr>
                    ) : (
                      filtered.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td data-label="Name">{item.title}</td>
                          <td data-label="URL">
                            <a className="url-link" href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.url.replace(/(^\w+:|^)\/\//, "")}
                            </a>
                          </td>
                          <td data-label="Summary">
                            <button
                              className="summary-button"
                              type="button"
                              onClick={() => {
                                setSelectedSummary(item.summary || null);
                                setIsSummaryOpen(true);
                              }}
                            >
                              {item.summary
                                ? `${item.summary.substring(0, 100)}${item.summary.length > 100 ? "..." : ""}`
                                : "No summary"}
                            </button>
                          </td>
                          <td data-label="Date added">{item.addedAt.toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
        )}
      </div>

      {isSummaryOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedSummary(null);
            setIsSummaryOpen(false);
          }
        }}>
          <section className="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summary-title">
            <header>
              <h2 id="summary-title">Summary</h2>
              <button type="button" onClick={() => {
                setSelectedSummary(null);
                setIsSummaryOpen(false);
              }} aria-label="Close summary">
                Close
              </button>
            </header>
            <p>{selectedSummary || "No summary available."}</p>
          </section>
        </div>
      )}
    </main>
  );
}
