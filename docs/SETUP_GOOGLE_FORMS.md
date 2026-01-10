# Google Forms Setup - Ziel e.V. Anmeldeformular

Diese Anleitung beschreibt die Erstellung des Anmeldeformulars in Google Forms.

## Voraussetzungen

- Eingeloggt mit `info.zielev@gmail.com`
- Öffnen Sie [Google Forms](https://forms.google.com)

---

## Formularstruktur

### Abschnitt 1: Angaben zum Kind

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Vorname des Kindes** | Kurzantwort | ✓ | |
| **Nachname des Kindes** | Kurzantwort | ✓ | |
| **Geburtsdatum** | Datum | ✓ | |
| **Nationalität** | Kurzantwort | ✓ | |

### Abschnitt 2: Anschrift des Kindes

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Straße und Hausnummer** | Kurzantwort | ✓ | |
| **Postleitzahl** | Kurzantwort | ✓ | |
| **Ort** | Kurzantwort | ✓ | |

### Abschnitt 3: Schulinformationen

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Klasse** | Dropdown | ✓ | Optionen: 1a, 1b, 2a, 2b, 3a, 3b, 4a, 4b |
| **Klassenlehrer/in** | Kurzantwort | ✓ | |

### Abschnitt 4: Angaben der Mutter / Erziehungsberechtigte 1

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Mutter - Vorname** | Kurzantwort | ✓ | |
| **Mutter - Nachname** | Kurzantwort | ✓ | |
| **Mutter - Telefon** | Kurzantwort | ✓ | Für Notfälle |
| **Mutter - Beruf** | Kurzantwort | - | Optional |
| **Mutter - Straße/Nr.** | Kurzantwort | - | Falls abweichend |
| **Mutter - PLZ/Ort** | Kurzantwort | - | Falls abweichend |

### Abschnitt 5: Angaben des Vaters / Erziehungsberechtigte 2

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Vater - Vorname** | Kurzantwort | - | Optional |
| **Vater - Nachname** | Kurzantwort | - | Optional |
| **Vater - Telefon** | Kurzantwort | - | Optional |
| **Vater - Beruf** | Kurzantwort | - | Optional |
| **Vater - Straße/Nr.** | Kurzantwort | - | Falls abweichend |
| **Vater - PLZ/Ort** | Kurzantwort | - | Falls abweichend |

### Abschnitt 6: Kontakt & Zahlung

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **E-Mail-Adresse** | Kurzantwort | ✓ | Validierung: E-Mail |
| **IBAN** | Kurzantwort | ✓ | Für SEPA-Lastschrift |
| **Kontoinhaber** | Kurzantwort | ✓ | Falls abweichend |

### Abschnitt 7: Förderung & Einwilligung

| Feldname | Typ | Pflicht | Hinweise |
|----------|-----|---------|----------|
| **Jobcenter-Förderung** | Checkbox | - | "Ja, ich beziehe Leistungen vom Jobcenter" |
| **DSGVO-Einwilligung** | Checkbox | ✓ | "Ich stimme der Verarbeitung meiner Daten zu..." |

---

## Zweispaltige Darstellung (Mutter/Vater)

> **Hinweis:** Google Forms unterstützt keine echten Spalten. Verwenden Sie stattdessen:

1. **Abschnittstitel** mit klarer Beschriftung
2. **Beschreibungstext** unter dem Abschnitt:
   ```
   Bitte geben Sie die Kontaktdaten eines Erziehungsberechtigten an.
   Die Angaben zum zweiten Erziehungsberechtigten sind optional.
   ```

---

## IBAN-Feld einrichten

1. Feld "IBAN" hinzufügen (Typ: Kurzantwort)
2. Drei-Punkte-Menü → **Antwortvalidierung**
3. Einstellungen:
   - **Regulärer Ausdruck** → **Stimmt überein mit**
   - Muster: `^DE[0-9]{2}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{2}$`
   - Fehlermeldung: "Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Ziffern)"

> **Vollständige IBAN-Prüfung** (inkl. Prüfsumme) erfolgt im Apps Script!

---

## E-Mail-Feld einrichten

1. Feld "E-Mail-Adresse" hinzufügen
2. Drei-Punkte-Menü → **Antwortvalidierung**
3. **Text** → **E-Mail-Adresse**

---

## Formular-Einstellungen

1. **Einstellungen** (Zahnrad-Icon)
2. **Antworten**:
   - ✓ E-Mail-Adressen erfassen (optional)
   - ✓ Auf eine Antwort beschränken (optional)
3. **Präsentation**:
   - ✓ Fortschrittsbalken anzeigen
   - Bestätigungsnachricht: "Vielen Dank für Ihre Anmeldung!"

---

## Mit Google Sheets verknüpfen

1. Tab **Antworten** öffnen
2. Grünes Sheets-Symbol klicken
3. **Neue Tabelle erstellen**
4. Name: `Anmeldungen_OGS_Ziel`
