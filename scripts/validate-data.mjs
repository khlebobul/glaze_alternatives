import { readFile } from "node:fs/promises";

const load = (name) => readFile(new URL(`../data/${name}.json`, import.meta.url)).then(JSON.parse);
const [apps, glazeApps] = await Promise.all([load("apps"), load("glaze-apps")]);
const categories = new Set(["productivity", "developer", "media", "utilities", "design"]);
const collectIds = (items, type) => {
  const ids = new Set();
  for (const item of items) {
    if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) throw new Error(`${type}: invalid or duplicate id ${item.id}`);
    ids.add(item.id);
  }
  return ids;
};
const appIds = collectIds(apps, "app");
collectIds(glazeApps, "Glaze app");

for (const app of apps) {
  if (!app.name || !app.url?.startsWith("https://") || !app.iconUrl?.startsWith("https://") || !app.description || !categories.has(app.category)) throw new Error(`Invalid app: ${app.id}`);
}
for (const app of glazeApps) {
  if (!app.name || !app.description || !app.url?.startsWith("https://www.glaze.app/app/") || !app.iconUrl?.startsWith("https://") || !app.replaces?.length) throw new Error(`Invalid Glaze app: ${app.id}`);
  for (const appId of app.replaces) if (!appIds.has(appId)) throw new Error(`${app.id}: unknown app ${appId}`);
}
for (const appId of appIds) if (!glazeApps.some((app) => app.replaces.includes(appId))) throw new Error(`${appId}: no replacements`);

console.log(`Validated ${apps.length} products and ${glazeApps.length} Glaze apps.`);
