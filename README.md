# Ziel e.V. - Online-Anmelde-System

Vollständig kostenfreies Online-Anmeldeformular für die OGS (Offene Ganztagsschule) des gemeinnützigen Vereins Ziel e.V.

## 🎯 Projektübersicht

| Komponente | Technologie | Beschreibung |
|------------|-------------|--------------|
| **Formular** | Google Forms | Datenerfassung mit Validierung |
| **Datenbank** | Google Sheets | Zentrale Speicherung aller Anmeldungen |
| **Automatisierung** | Google Apps Script | E-Mail-Versand, Backups, IBAN-Prüfung |
| **Webseite** | Jimdo + iFrame | Einbettung des Formulars |

## 🏗️ Systemarchitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                     Jimdo Webseite                              │
│                   (iFrame Einbettung)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google Forms                                  │
│              (Anmeldeformular - Deutsch)                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Google Sheets                                  │
│            (Zentrale Anmeldedatenbank)                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               Google Apps Script                                 │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────────────┐   │
│  │ E-Mail an   │ │ E-Mail an    │ │ Wöchentliches Backup    │   │
│  │ Antragsteller│ │ Admin        │ │ (+ JSON-Export)        │   │
│  └─────────────┘ └──────────────┘ └─────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ IBAN-Validierung (JavaScript) + PDF-Anhang (Jobcenter) │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Setup-Anleitung

> **📖 Vollständige Anleitung:** [VOLLSTAENDIGE_ANLEITUNG.md](docs/VOLLSTAENDIGE_ANLEITUNG.md)
> 
> Diese Schritt-für-Schritt-Anleitung führt Sie durch die komplette Einrichtung (ca. 45-60 Minuten).

### Kurzübersicht der Schritte

1. **Google Forms erstellen** → [Detaillierte Anleitung](docs/VOLLSTAENDIGE_ANLEITUNG.md#1-google-forms-erstellen)
2. **24 Formularfelder hinzufügen** → [Feldliste](docs/VOLLSTAENDIGE_ANLEITUNG.md#2-formularfelder-hinzufügen)
3. **Google Sheets verknüpfen** → [Anleitung](docs/VOLLSTAENDIGE_ANLEITUNG.md#3-google-sheets-verknüpfen)
4. **Apps Script einrichten** → [Code kopieren](scripts/FormularAutomation.gs)
5. **Trigger aktivieren** → [Trigger-Setup](docs/VOLLSTAENDIGE_ANLEITUNG.md#5-trigger-konfigurieren)
6. **In Jimdo einbetten** → [iFrame-Code](docs/JIMDO_INTEGRATION.md)

### Schritt 2: Google Sheets verknüpfen

1. Im Formular auf **"Antworten"** klicken
2. Grünes Sheets-Icon → **"Neue Tabelle erstellen"**
3. Name: `Anmeldungen_OGS_Ziel`

### Schritt 3: Google Apps Script einrichten

1. In Google Sheets: **Erweiterungen → Apps Script**
2. Code aus [scripts/FormularAutomation.gs](scripts/FormularAutomation.gs) einfügen
3. Konfiguration anpassen (siehe Abschnitt unten)

### Schritt 4: Trigger aktivieren

Im Apps Script Editor:
1. ⏰ **Trigger** (linke Seite) → **+ Trigger hinzufügen**
2. Funktion: `onFormSubmit` → Ereignis: **Bei Formularübermittlung**
3. Funktion: `createWeeklyBackup` → Zeitgesteuert: **Wöchentlicher Timer** (z.B. Sonntag 3:00 Uhr)

### Schritt 5: Jimdo-Einbettung

Siehe [JIMDO_INTEGRATION.md](docs/JIMDO_INTEGRATION.md) für den iFrame-Code.

---

## ⚙️ Konfiguration (Apps Script)

Passen Sie diese Werte im Script an:

```javascript
const CONFIG = {
  ADMIN_EMAIL: 'info.zielev@gmail.com',
  BACKUP_FOLDER_ID: 'IHR_GOOGLE_DRIVE_ORDNER_ID',
  JOBCENTER_PDF_ID: 'IHR_PDF_DOKUMENT_ID'
};
```

**Ordner-ID finden:**
1. Ordner in Google Drive öffnen
2. URL enthält: `drive.google.com/drive/folders/`**`XXXXX`** ← Diese ID kopieren

---

## 📁 Projektstruktur

```
c:\DEVOPS\Ziel\
├── README.md                         # Diese Datei
├── ROADMAP.md                        # Entwicklungsphasen
├── scripts/
│   └── FormularAutomation.gs         # Google Apps Script
├── docs/
│   ├── SETUP_GOOGLE_FORMS.md         # Formularfelder-Anleitung
│   ├── IBAN_VALIDATION.md            # IBAN-Prüflogik
│   └── JIMDO_INTEGRATION.md          # iFrame-Einbettung
└── assets/
    └── Jobcenter_Platzhalter.pdf     # Platzhalter-Dokument
```

---

## 🔧 Wartung & Erweiterung

### Neue Felder hinzufügen
1. Feld in Google Forms hinzufügen
2. Spalte erscheint automatisch in Google Sheets
3. Bei Bedarf Apps Script anpassen (z.B. für E-Mail-Inhalt)

### Backup manuell ausführen
1. Google Sheets öffnen
2. **Erweiterungen → Apps Script**
3. Funktion `createWeeklyBackup` auswählen → ▶️ Ausführen

### Logs prüfen
1. Apps Script → **Ausführungen** (linke Seite)
2. Details zu jedem Trigger-Aufruf einsehen

---

## 🛡️ DSGVO-Hinweise

- Daten werden ausschließlich in Google-Diensten gespeichert
- Google ist nach EU-US Data Privacy Framework zertifiziert
- Einwilligungserklärung im Formular erforderlich
- Löschung auf Anfrage durch Entfernen der Zeile in Google Sheets

---

## 📞 Support

Bei technischen Fragen: Dokumentation in `/docs/` konsultieren oder Issue erstellen.
