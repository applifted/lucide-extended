---
'lucide-extended-react': patch
'lucide-extended-react-native': patch
'lucide-extended-preact': patch
'lucide-extended-vue': patch
'lucide-extended-solid': patch
'lucide-extended-svelte': patch
'lucide-extended-astro': patch
'lucide-extended-angular': patch
'lucide-extended-js': patch
'lucide-extended-static': patch
---

Re-export the filled and duotone icons from Figma after a clean-up of their layers: each filled icon's shapes are now flattened and unioned into a single vector. The path data changes, mostly by rounding; the icon names, API and tint opacity are unchanged.
