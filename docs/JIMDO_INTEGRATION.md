# Jimdo Integration - iFrame Einbettung

## Voraussetzungen

- Fertiggestelltes Google Formular
- Jimdo-Webseite mit Bearbeitungsrechten

---

## Schritt 1: Formular-URL kopieren

1. Google Forms → Formular öffnen
2. **Senden** (oben rechts)
3. **Link-Symbol** (🔗) auswählen
4. **Kürzen** deaktivieren
5. URL kopieren (Format: `https://docs.google.com/forms/d/e/XXXXXX/viewform`)

---

## Schritt 2: Jimdo-Einbettung

### iFrame-Code

```html
<iframe 
  src="https://docs.google.com/forms/d/e/IHRE_FORMULAR_ID/viewform?embedded=true" 
  width="100%" 
  height="1200" 
  frameborder="0" 
  marginheight="0" 
  marginwidth="0"
  style="border: none; max-width: 640px; margin: 0 auto; display: block;">
  Wird geladen…
</iframe>
```

### In Jimdo einfügen

1. Jimdo-Editor öffnen
2. Gewünschte Seite auswählen
3. **+ Element hinzufügen** → **Weitere Inhalte** → **Widget/HTML**
4. Code einfügen
5. **Speichern**

---

## Anpassungen

### Höhe anpassen

Bei längeren Formularen die `height` erhöhen:

```html
height="1500"
```

### Breite anpassen

Für schmalere Darstellung:

```html
style="max-width: 500px; margin: 0 auto;"
```

### Responsive Design

Für mobile Geräte:

```html
<div style="position: relative; padding-bottom: 150%; height: 0; overflow: hidden;">
  <iframe 
    src="https://docs.google.com/forms/d/e/IHRE_ID/viewform?embedded=true"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
  </iframe>
</div>
```

---

## Fehlerbehandlung

| Problem | Lösung |
|---------|--------|
| Formular wird nicht angezeigt | URL auf `?embedded=true` prüfen |
| Scrollen nicht möglich | `height` erhöhen |
| Abgeschnittene Inhalte | `frameborder="0"` hinzufügen |
| Formular zu schmal | `max-width` anpassen |

---

## Fertige Testseite

Nach der Einbettung sollte die Seite so aussehen:

1. Formular ist vollständig sichtbar
2. Alle Felder sind ausfüllbar
3. Absende-Button funktioniert
4. Bestätigungsnachricht erscheint nach dem Senden
