// Builds qa/index.html: every icon rendered through the real component, next to
// Lucide's outline, with colour controls and flags for things tests can't see.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { icons as lucideIcons } from 'lucide-react'
import { parse, type INode } from 'svgson'
import * as ours from '../src/index.js'
import { collectPaths, listSources, ROOT, toPascal } from './lib.ts'

// Tints are rendered in this sentinel colour so the page's CSS can recolour them live
const TINT_SENTINEL = '#fe01fe'

type Flag = 'not-in-lucide' | 'filled-only' | 'duotone-only' | 'stroked-tint' | 'stroked-dot'

const FLAG_LABELS: Record<Flag | 'tint-overlap', string> = {
  'not-in-lucide': 'Not in Lucide 1.45.0',
  'filled-only': 'Filled only',
  'duotone-only': 'Duotone only',
  'stroked-tint': 'Tint has a stroke',
  'stroked-dot': 'Dot has fill and stroke',
  'tint-overlap': 'Overlapping tints',
}

const components = ours as unknown as Record<string, ComponentType<Record<string, unknown>>>
const lucide = lucideIcons as unknown as Record<string, ComponentType<Record<string, unknown>>>

const render = (component: ComponentType<Record<string, unknown>> | undefined, props = {}) =>
  component ? renderToStaticMarkup(createElement(component, props)) : ''

// classify() treats any stroked path as an outline, so a source path with both a
// stroke and a fill renders as outline only. For a tint that loses the tint (a
// problem); for an opaque dot it's usually invisible. Read the raw file, because
// SVGO drops default fills.
async function strokedFills(file: string): Promise<Flag[]> {
  const tree: INode = await parse(await readFile(file, 'utf8'))
  const flags = new Set<Flag>()
  for (const { attributes: a } of collectPaths(tree)) {
    if (a.stroke === undefined || a.stroke === 'none') continue
    if (a.opacity !== undefined && Number(a.opacity) < 1) flags.add('stroked-tint')
    else if (a.fill !== undefined && a.fill !== 'none') flags.add('stroked-dot')
  }
  return [...flags]
}

const filled = new Map((await listSources('filled')).map((s) => [s.name, s.file]))
const duotone = new Map((await listSources('duotone')).map((s) => [s.name, s.file]))
const names = [...new Set([...filled.keys(), ...duotone.keys()])].sort()

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

const counts: Record<Flag, number> = { 'not-in-lucide': 0, 'filled-only': 0, 'duotone-only': 0, 'stroked-tint': 0, 'stroked-dot': 0 }

const cards: string[] = []
for (const name of names) {
  const pascal = toPascal(name)
  const flags: Flag[] = []
  if (!lucide[pascal]) flags.push('not-in-lucide')
  if (!duotone.has(name)) flags.push('filled-only')
  if (!filled.has(name)) flags.push('duotone-only')
  const duotoneFile = duotone.get(name)
  if (duotoneFile) flags.push(...(await strokedFills(duotoneFile)))
  flags.forEach((f) => counts[f]++)

  const cell = (label: string, svg: string) =>
    `<figure class="cell${svg ? '' : ' empty'}">${svg || '<span>—</span>'}<figcaption>${label}</figcaption></figure>`

  cards.push(`<article class="card" data-name="${escape(name)}" data-flags="${flags.join(' ')}">
<header><code>${escape(name)}</code><ul class="flags">${flags.map((f) => `<li class="flag-${f}">${FLAG_LABELS[f]}</li>`).join('')}</ul></header>
<div class="cells">${cell('Lucide', render(lucide[pascal]))}${cell('Filled', render(components[`${pascal}Filled`]))}${cell(
    'Duotone',
    render(components[`${pascal}Duotone`], { secondaryColor: TINT_SENTINEL }),
  )}</div>
</article>`)
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Icon QA sheet</title>
<style>
:root {
  --bg: #f6f6f4; --surface: #fff; --text: #1b1b1a; --muted: #6b6b66; --line: #e3e3de;
  --accent: #2f5bd3; --warn-bg: #fff2d6; --warn-text: #7a4b00; --info-bg: #e8eefc; --info-text: #2a468f;
  --icon: #1b1b1a; --secondary: var(--icon); --tint-opacity: .15; --size: 32px; --tile: #fff;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #141413; --surface: #1d1d1b; --text: #ededea; --muted: #9a9a94; --line: #2e2e2b;
    --accent: #8aa6ff; --warn-bg: #3a2c0c; --warn-text: #f3c874; --info-bg: #1c2744; --info-text: #aabdf5;
    color-scheme: dark;
  }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 14px/1.4 system-ui, sans-serif; }
.bar { position: sticky; top: 0; z-index: 2; background: var(--surface); border-bottom: 1px solid var(--line); padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; }
.bar h1 { font-size: 15px; margin: 0 8px 0 0; }
.bar label { display: inline-flex; align-items: center; gap: 6px; color: var(--muted); }
.bar input[type=search] { width: 200px; }
.bar input, .bar select { font: inherit; color: var(--text); background: var(--bg); border: 1px solid var(--line); border-radius: 6px; padding: 4px 6px; }
.bar input[type=color] { padding: 0; width: 32px; height: 26px; }
.summary { color: var(--muted); font-size: 13px; padding: 10px 16px 0; }
.summary b { color: var(--text); font-weight: 600; }
main { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr)); gap: 12px; padding: 12px 16px 40px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px; cursor: zoom-in; }
.card:hover { border-color: var(--accent); }
.card header { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; margin-bottom: 8px; min-height: 22px; }
.card code { font-size: 12.5px; }
.flags { display: contents; list-style: none; }
.flags li { font-size: 11px; padding: 1px 6px; border-radius: 99px; background: var(--info-bg); color: var(--info-text); }
.flags li.flag-stroked-tint, .flags li.flag-tint-overlap, .flags li.flag-not-in-lucide { background: var(--warn-bg); color: var(--warn-text); }
.cells { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.cell { margin: 0; display: grid; justify-items: center; gap: 4px; }
.cell > svg, .cell > span { width: var(--size); height: var(--size); }
.cell > span { display: grid; place-items: center; color: var(--muted); }
.cell svg { color: var(--icon); }
.cells .cell, dialog .cell { background: var(--tile); border-radius: 6px; padding: 10px 4px 4px; }
.cell figcaption { font-size: 11px; color: var(--muted); }
body.tile-dark { --tile: #1b1b1a; }
body.tile-checker { --tile: repeating-conic-gradient(#ddd 0 25%, #fff 0 50%) 0 0 / 12px 12px; }
.card.hidden { display: none; }
path[fill="${TINT_SENTINEL}"] { fill: var(--secondary); opacity: var(--tint-opacity); }
body.solo-tint svg.applifted-icon path:not([fill="${TINT_SENTINEL}"]) { visibility: hidden; }
body.solo-tint path[fill="${TINT_SENTINEL}"] { opacity: 1; }
dialog { border: 1px solid var(--line); border-radius: 12px; background: var(--surface); color: var(--text); padding: 16px; width: min(760px, calc(100vw - 32px)); }
dialog::backdrop { background: rgb(0 0 0 / .45); }
dialog .cells { gap: 12px; }
dialog .cell > svg, dialog .cell > span { width: min(200px, 26vw); height: min(200px, 26vw); }
dialog .cell svg { background-image: linear-gradient(to right, rgb(127 127 127 / .18) 1px, transparent 1px), linear-gradient(to bottom, rgb(127 127 127 / .18) 1px, transparent 1px); background-size: calc(100% / 24) calc(100% / 24); }
dialog header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; flex-wrap: wrap; }
dialog button { font: inherit; background: var(--bg); color: var(--text); border: 1px solid var(--line); border-radius: 6px; padding: 4px 10px; cursor: pointer; }
</style>
</head>
<body>
<div class="bar">
  <h1>Icon QA sheet</h1>
  <label><input type="search" id="q" placeholder="Filter by name"></label>
  <label>Show <select id="filter">
    <option value="">All icons</option>
    <option value="attention">Needs a look</option>
    <option value="tint-overlap">${FLAG_LABELS['tint-overlap']}</option>
    <option value="stroked-tint">${FLAG_LABELS['stroked-tint']}</option>
    <option value="stroked-dot">${FLAG_LABELS['stroked-dot']}</option>
    <option value="not-in-lucide">${FLAG_LABELS['not-in-lucide']}</option>
    <option value="filled-only">${FLAG_LABELS['filled-only']}</option>
    <option value="duotone-only">${FLAG_LABELS['duotone-only']}</option>
  </select></label>
  <label>Colour <input type="color" id="color" value="#1b1b1a"></label>
  <label><input type="checkbox" id="use-secondary"> Secondary <input type="color" id="secondary" value="#e5484d"></label>
  <label>Tint <input type="range" id="opacity" min="0" max="1" step="0.05" value="0.15"> <output id="opacity-out">0.15</output></label>
  <label><input type="checkbox" id="solo"> Tints only</label>
  <label>Size <select id="size"><option>16</option><option>24</option><option selected>32</option><option>48</option></select></label>
  <label>Tile <select id="tile"><option value="">Light</option><option value="tile-dark">Dark</option><option value="tile-checker">Checker</option></select></label>
</div>
<p class="summary">
  <b>${names.length}</b> names · <b>${filled.size}</b> filled · <b>${duotone.size}</b> duotone ·
  <b id="overlap-count">…</b> with overlapping tints · <b>${counts['stroked-tint']}</b> with a stroked tint ·
  <b>${counts['stroked-dot']}</b> with stroked dots ·
  <b>${counts['not-in-lucide']}</b> not in Lucide 1.45.0 · showing <b id="shown">${names.length}</b>.
  Click an icon to enlarge it on a 24-unit grid.
</p>
<main id="grid">
${cards.join('\n')}
</main>
<dialog id="zoom"><header><code id="zoom-name"></code><button id="zoom-close">Close</button></header><div class="cells" id="zoom-cells"></div></dialog>
<script>
const $ = (id) => document.getElementById(id)
const root = document.documentElement.style
const cards = [...document.querySelectorAll('.card')]
const ATTENTION = ['tint-overlap', 'stroked-tint', 'not-in-lucide']

// Two tints overlapping stack to a darker patch. Draw each icon's tints alone at
// 50% opacity (one layer gives alpha ~128, two stacked ~191), then erase whatever
// the opaque outlines cover, since overlaps hidden under a stroke can't be seen.
// Flag the icon if more than a few pixels exceed one layer (anti-aliased edges).
const RASTER = 96
const canvas = Object.assign(document.createElement('canvas'), { width: RASTER, height: RASTER })
const ctx = canvas.getContext('2d', { willReadFrequently: true })

async function layer(svg, keepTints) {
  const clone = svg.cloneNode(true)
  clone.setAttribute('width', RASTER)
  clone.setAttribute('height', RASTER)
  for (const p of clone.querySelectorAll('path')) {
    const isTint = p.getAttribute('fill') === '${TINT_SENTINEL}'
    if (isTint !== keepTints) p.remove()
    else if (isTint) { p.setAttribute('fill', '#000'); p.setAttribute('opacity', '0.5') }
  }
  const img = new Image()
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone))
  await img.decode()
  return img
}

async function stackedPixels(svg) {
  if (svg.querySelectorAll('path[fill="${TINT_SENTINEL}"]').length < 2) return 0
  ctx.clearRect(0, 0, RASTER, RASTER)
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(await layer(svg, true), 0, 0)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.drawImage(await layer(svg, false), 0, 0)
  ctx.globalCompositeOperation = 'source-over'
  const { data } = ctx.getImageData(0, 0, RASTER, RASTER)
  let stacked = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 160) stacked++
  return stacked
}

;(async () => {
  let overlaps = 0
  for (const card of cards) {
    const svg = card.querySelector('.cell:nth-child(3) svg')
    if (!svg || (await stackedPixels(svg)) <= 8) continue
    overlaps++
    card.dataset.flags = (card.dataset.flags + ' tint-overlap').trim()
    card.querySelector('.flags').insertAdjacentHTML('beforeend', '<li class="flag-tint-overlap">${FLAG_LABELS['tint-overlap']}</li>')
  }
  $('overlap-count').textContent = overlaps
  applyFilter()
})()

function applyFilter() {
  const q = $('q').value.trim().toLowerCase()
  const f = $('filter').value
  let shown = 0
  for (const card of cards) {
    const flags = card.dataset.flags.split(' ')
    const match = (!q || card.dataset.name.includes(q)) &&
      (!f || (f === 'attention' ? ATTENTION.some((a) => flags.includes(a)) : flags.includes(f)))
    card.classList.toggle('hidden', !match)
    if (match) shown++
  }
  $('shown').textContent = shown
}
$('q').addEventListener('input', applyFilter)
$('filter').addEventListener('change', () => {
  history.replaceState(null, '', $('filter').value ? '#' + $('filter').value : location.pathname)
  applyFilter()
})
// Deep-link a filter, e.g. qa/index.html#attention
const initial = location.hash.slice(1)
if ([...$('filter').options].some((o) => o.value === initial)) {
  $('filter').value = initial
  applyFilter()
}

const applyColours = () => {
  root.setProperty('--icon', $('color').value)
  root.setProperty('--secondary', $('use-secondary').checked ? $('secondary').value : 'var(--icon)')
}
for (const id of ['color', 'secondary', 'use-secondary']) $(id).addEventListener('input', applyColours)
$('opacity').addEventListener('input', (e) => {
  root.setProperty('--tint-opacity', e.target.value)
  $('opacity-out').textContent = e.target.value
})
$('solo').addEventListener('change', (e) => document.body.classList.toggle('solo-tint', e.target.checked))
$('size').addEventListener('change', (e) => root.setProperty('--size', e.target.value + 'px'))
$('tile').addEventListener('change', (e) => {
  document.body.classList.remove('tile-dark', 'tile-checker')
  if (e.target.value) document.body.classList.add(e.target.value)
})

$('grid').addEventListener('click', (e) => {
  const card = e.target.closest('.card')
  if (!card) return
  $('zoom-name').textContent = card.dataset.name
  $('zoom-cells').innerHTML = card.querySelector('.cells').innerHTML
  $('zoom').showModal()
})
$('zoom-close').addEventListener('click', () => $('zoom').close())
$('zoom').addEventListener('click', (e) => { if (e.target === $('zoom')) $('zoom').close() })
</script>
</body>
</html>
`

const outDir = path.join(ROOT, 'qa')
await mkdir(outDir, { recursive: true })
await writeFile(path.join(outDir, 'index.html'), html)
console.log(`Wrote qa/index.html (${names.length} names, ${(Buffer.byteLength(html) / 1e6).toFixed(1)} MB)`)
console.log(`  stroked tints: ${counts['stroked-tint']} · stroked dots: ${counts['stroked-dot']} · not in Lucide: ${counts['not-in-lucide']}`)
