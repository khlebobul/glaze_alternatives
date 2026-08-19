"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import appsData from "@/data/apps.json";
import glazeAppsData from "@/data/glaze-apps.json";
import { Badge } from "@/components/ascii/badge";
import { Card } from "@/components/ascii/card";
import { Dialog } from "@/components/ascii/dialog";
import { Input } from "@/components/ascii/input";

type Category = "productivity" | "developer" | "media" | "utilities" | "design";
type App = { id: string; name: string; url: string; iconUrl: string; category: Category; description: string };
type GlazeApp = { id: string; name: string; description: string; url: string; iconUrl: string; replaces: string[] };

const apps = appsData as App[];
const glazeApps = glazeAppsData as GlazeApp[];
const replacementCount = glazeApps.reduce((total, app) => total + app.replaces.length, 0);
const categories: Array<["all" | Category, string]> = [
  ["all", "all"], ["productivity", "productivity"], ["developer", "developer"],
  ["media", "media"], ["utilities", "utilities"], ["design", "design"],
];
const REPO_URL = "https://github.com/khlebobul/glaze_alternatives";
const RAYCAST_ALTERNATIVES_URL = "https://khlebobul.github.io/raycast_alternatives/";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [selected, setSelected] = useState<App | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const replacementsFor = (appId: string) => glazeApps.filter((item) => item.replaces.includes(appId));
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return apps.filter((app) => {
      const replacementNames = replacementsFor(app.id).map(({ name }) => name).join(" ");
      return (category === "all" || app.category === category) && `${app.name} ${app.description} ${replacementNames}`.toLowerCase().includes(needle);
    });
  }, [category, query]);

  return (
    <main className="shell">
      <header className="topbar">
        <a href="#top" className="font-bold">~/glaze-alternatives</a>
        <nav><a href="#directory">[apps]</a><a href="#submit">[submit]</a><a href={RAYCAST_ALTERNATIVES_URL} target="_blank" rel="noreferrer">[Raycast Alternatives ↗]</a></nav>
      </header>

      <section id="top" className="hero">
        <p className="prompt">$ glaze install --everything</p>
        <h1>One place.<br />Many apps<span className="cursor">_</span></h1>
        <p className="lede">Replace standalone and paid Mac apps with community-made apps from the <a className="glaze-link" href="https://www.glaze.app/store" target="_blank" rel="noreferrer">Glaze Store ↗</a>. Find what you need, install it, keep your workflow local.</p>
        <div className="counters" aria-label="Catalog totals">
          <div><strong>{apps.length}</strong><span>products covered</span></div>
          <div><strong>{replacementCount}</strong><span>replacement options</span></div>
          <div><strong>{glazeApps.length}</strong><span>unique Glaze apps</span></div>
        </div>
      </section>

      <div className="catalog-layout">
        <section id="directory" className="directory">
          <div className="section-title"><span>01 / directory</span><span>{visible.length} of {apps.length} products</span></div>
          <div className="search-tools">
            <label className="search-label" htmlFor="search">$ find --replacement</label>
            <Input ref={searchRef} id="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => { setQuery(""); searchRef.current?.focus(); }} placeholder="type app or Glaze app name..." autoComplete="off" />
            <div className="filters" aria-label="Filter by category">
              {categories.map(([value, label]) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{category === value ? `[${label}]` : label}</button>)}
            </div>
          </div>

          <div className="grid">
            {visible.map((app, index) => {
              const count = replacementsFor(app.id).length;
              return (
                <Card key={app.id}>
                  <button type="button" className="app-row" onClick={() => setSelected(app)}>
                    <span className="row-index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="app-icon"><span>{app.name.charAt(0)}</span><img src={app.iconUrl} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>
                    <span className="app-copy"><strong>{app.name}</strong><small>{app.description}</small></span>
                    <span className="app-meta"><Badge>{app.category}</Badge><small>{count} alt{count === 1 ? "" : "s"} →</small></span>
                  </button>
                </Card>
              );
            })}
          </div>
          {!visible.length && <p className="empty">[error] no matching applications</p>}
        </section>

        <aside className="submit-window" id="submit">
          <div className="submit-title"><span>community/write</span><span>● online</span></div>
          <div className="submit-body">
            <p className="prompt">$ contribute --catalog</p>
            <h2>Missing a match?</h2>
            <p>Add a Glaze app, product mapping, correction, or better icon through a pull request.</p>
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">[ contribution guide ↗ ]</a>
            <a href={REPO_URL} target="_blank" rel="noreferrer">[ repository ↗ ]</a>
          </div>
        </aside>
      </div>

      <footer><span>END OF DIRECTORY</span><span>also: <a href={RAYCAST_ALTERNATIVES_URL}>[Raycast Alternatives ↗]</a></span><span>built by <a href="https://khlebobul.github.io/">Gleb Shalimov</a></span></footer>

      {selected && (
        <Dialog title={`~/apps/${selected.id}`} onClose={() => setSelected(null)}>
          <div className="detail-head">
            <span className="detail-icon"><span>{selected.name.charAt(0)}</span><img src={selected.iconUrl} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>
            <div><h3>{selected.name}</h3><p>{selected.description}</p><a href={selected.url} target="_blank" rel="noreferrer">visit website ↗</a></div>
          </div>
          <p className="tree-label">$ ls ./glaze-replacements</p>
          <div className="extension-tree">
            {replacementsFor(selected.id).map((item, index, list) => (
              <article key={item.id}>
                <span aria-hidden="true">{index === list.length - 1 ? "└──" : "├──"}</span>
                <span className="extension-icon"><span>{item.name.charAt(0)}</span><img src={item.iconUrl} alt="" onError={(event) => { event.currentTarget.hidden = true; }} /></span>
                <div><strong>{item.name}</strong><p>{item.description}</p></div>
                <a href={item.url} target="_blank" rel="noreferrer">[store ↗]</a>
              </article>
            ))}
          </div>
        </Dialog>
      )}
    </main>
  );
}
