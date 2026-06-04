@AGENTS.md

# UI komponenty

Pro veškeré formulářové prvky vždy používej shadcn komponenty z `src/components/ui/`,
nikdy ne nativní HTML prvky:

- `<input>` → `Input` (`@/components/ui/input`); jediná výjimka je `type="hidden"`
- `<select>` → `Select` (`@/components/ui/select`)
- `<input type="checkbox">` → `Checkbox` (`@/components/ui/checkbox`)
- datum → `Calendar` v `Popover` (`@/components/ui/calendar`, `@/components/ui/popover`)
  + skrytý `input` s hodnotou ve formátu `YYYY-MM-DD`
- formulářová tlačítka (submit / zrušit) → `Button` (`@/components/ui/button`)

Pokud potřebná komponenta v `src/components/ui/` ještě není, přidej ji přes
`npx shadcn@latest add <komponenta>` (projekt je nakonfigurován v `components.json`).
Styling drží projektovou paletu (neutral + lime) přes design tokeny v `src/app/globals.css`.
