# 📋 Vollständige Einrichtungsanleitung - Ziel e.V. Online-Anmelde-System

> **Hinweis:** Diese Anleitung führt Sie Schritt für Schritt durch die komplette Einrichtung.
> Geschätzte Zeit: 45-60 Minuten

---

## 📑 Inhaltsverzeichnis

1. [Google Forms erstellen](#1-google-forms-erstellen)
2. [Formularfelder hinzufügen](#2-formularfelder-hinzufügen)
3. [Google Sheets verknüpfen](#3-google-sheets-verknüpfen)
4. [Google Apps Script einrichten](#4-google-apps-script-einrichten)
5. [Trigger konfigurieren](#5-trigger-konfigurieren)
6. [Backup-Ordner erstellen](#6-backup-ordner-erstellen)
7. [Jimdo-Einbettung](#7-jimdo-einbettung)
8. [Testen](#8-testen)

---

## 1. Google Forms erstellen

### 1.1 Anmelden
1. Öffnen Sie **https://forms.google.com**
2. Melden Sie sich mit `info.zielev@gmail.com` an

### 1.2 Neues Formular erstellen
1. Klicken Sie auf das **große + Symbol** (Leer) oder **Neues Formular**
2. Klicken Sie auf **"Unbenanntes Formular"** (oben)
3. Geben Sie ein: `Anmeldung OGS Ziel e.V.`
4. Klicken Sie auf **"Formularbeschreibung"**
5. Geben Sie ein:
   ```
   Herzlich willkommen! Mit diesem Formular melden Sie Ihr Kind für die Offene Ganztagsschule (OGS) des Ziel e.V. an.
   
   Bitte füllen Sie alle Pflichtfelder (*) vollständig aus.
   ```

### 1.3 Design anpassen (optional)
1. Klicken Sie oben rechts auf das **Palette-Symbol** 🎨
2. Wählen Sie eine Farbe (z.B. Blau oder Grün)
3. Optional: Laden Sie ein Kopfbild hoch

---

## 2. Formularfelder hinzufügen

> **Wichtig:** Für jedes Feld klicken Sie auf das **+ Symbol** in der rechten Seitenleiste.

### ABSCHNITT 1: Angaben zum Kind

#### Abschnittsüberschrift hinzufügen
1. Klicken Sie auf **Tt** (Titel und Beschreibung hinzufügen) in der Seitenleiste
2. Titel: `Angaben zum Kind`
3. Beschreibung: `Bitte geben Sie die Daten Ihres Kindes ein.`

#### Feld 1: Vorname des Kindes
1. Klicken Sie auf **+** → **Kurzantwort**
2. Frage: `Vorname des Kindes`
3. Aktivieren Sie **"Erforderlich"** (unten rechts, Schieberegler)

#### Feld 2: Nachname des Kindes
1. **+** → **Kurzantwort**
2. Frage: `Nachname des Kindes`
3. ✓ Erforderlich

#### Feld 3: Geburtsdatum
1. **+** → **Datum**
2. Frage: `Geburtsdatum`
3. ✓ Erforderlich

#### Feld 4: Nationalität
1. **+** → **Kurzantwort**
2. Frage: `Nationalität`
3. ✓ Erforderlich

---

### ABSCHNITT 2: Anschrift des Kindes

#### Neuen Abschnitt hinzufügen
1. Klicken Sie auf **═══** (Abschnitt hinzufügen) in der Seitenleiste
2. Titel: `Anschrift des Kindes`

#### Feld 5: Straße und Hausnummer
1. **+** → **Kurzantwort**
2. Frage: `Straße und Hausnummer`
3. ✓ Erforderlich

#### Feld 6: Postleitzahl
1. **+** → **Kurzantwort**
2. Frage: `Postleitzahl`
3. ✓ Erforderlich
4. **Drei Punkte (⋮)** → **Antwortvalidierung**
5. Wählen Sie: **Regulärer Ausdruck** → **Stimmt überein mit**
6. Muster: `^[0-9]{5}$`
7. Fehlertext: `Bitte geben Sie eine 5-stellige Postleitzahl ein`

#### Feld 7: Ort
1. **+** → **Kurzantwort**
2. Frage: `Ort`
3. ✓ Erforderlich

---

### ABSCHNITT 3: Schulinformationen

#### Neuen Abschnitt hinzufügen
1. **═══** → Titel: `Schulinformationen`

#### Feld 8: Klasse
1. **+** → **Dropdown**
2. Frage: `Klasse`
3. Optionen (je eine Zeile):
   ```
   1a
   1b
   2a
   2b
   3a
   3b
   4a
   4b
   ```
4. ✓ Erforderlich

#### Feld 9: Klassenlehrer/in
1. **+** → **Kurzantwort**
2. Frage: `Klassenlehrer/in`
3. ✓ Erforderlich

---

### ABSCHNITT 4: Erziehungsberechtigte/r 1 (Mutter)

#### Neuen Abschnitt hinzufügen
1. **═══** → Titel: `Erziehungsberechtigte/r 1`
2. Beschreibung: `Bitte geben Sie die Daten der Mutter oder eines Erziehungsberechtigten an.`

#### Feld 10: Vorname
1. **+** → **Kurzantwort**
2. Frage: `Erziehungsberechtigte/r 1 - Vorname`
3. ✓ Erforderlich

#### Feld 11: Nachname
1. **+** → **Kurzantwort**
2. Frage: `Erziehungsberechtigte/r 1 - Nachname`
3. ✓ Erforderlich

#### Feld 12: Telefon
1. **+** → **Kurzantwort**
2. Frage: `Erziehungsberechtigte/r 1 - Telefon`
3. ✓ Erforderlich

#### Feld 13: Beruf (optional)
1. **+** → **Kurzantwort**
2. Frage: `Erziehungsberechtigte/r 1 - Beruf`
3. ✗ NICHT erforderlich

#### Feld 14: Anschrift (falls abweichend)
1. **+** → **Absatz** (für längere Eingaben)
2. Frage: `Erziehungsberechtigte/r 1 - Anschrift (falls abweichend vom Kind)`
3. ✗ NICHT erforderlich

---

### ABSCHNITT 5: Erziehungsberechtigte/r 2 (Vater)

#### Neuen Abschnitt hinzufügen
1. **═══** → Titel: `Erziehungsberechtigte/r 2 (optional)`
2. Beschreibung: `Falls vorhanden, geben Sie die Daten des zweiten Erziehungsberechtigten an.`

#### Feld 15-19: Analog zu Abschnitt 4
- `Erziehungsberechtigte/r 2 - Vorname` (nicht erforderlich)
- `Erziehungsberechtigte/r 2 - Nachname` (nicht erforderlich)
- `Erziehungsberechtigte/r 2 - Telefon` (nicht erforderlich)
- `Erziehungsberechtigte/r 2 - Beruf` (nicht erforderlich)
- `Erziehungsberechtigte/r 2 - Anschrift` (nicht erforderlich)

---

### ABSCHNITT 6: Kontakt & Zahlung

#### Neuen Abschnitt hinzufügen
1. **═══** → Titel: `Kontakt & Zahlungsdaten`

#### Feld 20: E-Mail-Adresse
1. **+** → **Kurzantwort**
2. Frage: `E-Mail-Adresse`
3. ✓ Erforderlich
4. **⋮** → **Antwortvalidierung**
5. Wählen Sie: **Text** → **E-Mail-Adresse**

#### Feld 21: IBAN
1. **+** → **Kurzantwort**
2. Frage: `IBAN`
3. ✓ Erforderlich
4. **⋮** → **Antwortvalidierung**
5. **Regulärer Ausdruck** → **Stimmt überein mit**
6. Muster:
   ```
   ^DE[0-9]{2}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{2}$
   ```
7. Fehlertext: `Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Ziffern)`

#### Feld 22: Kontoinhaber
1. **+** → **Kurzantwort**
2. Frage: `Kontoinhaber (falls abweichend)`
3. ✗ NICHT erforderlich

---

### ABSCHNITT 7: Förderung & Einwilligung

#### Neuen Abschnitt hinzufügen
1. **═══** → Titel: `Förderung & Datenschutz`

#### Feld 23: Jobcenter-Förderung
1. **+** → **Kästchen** (Checkboxen)
2. Frage: `Jobcenter-Förderung`
3. Beschreibung: `Falls Sie Leistungen vom Jobcenter beziehen, können Sie Unterstützung beantragen.`
4. Option 1: `Ja, ich beziehe Leistungen vom Jobcenter und benötige das Antragsformular`
5. ✗ NICHT erforderlich

#### Feld 24: DSGVO-Einwilligung
1. **+** → **Kästchen**
2. Frage: `Datenschutzeinwilligung`
3. Option 1:
   ```
   Ich stimme der Verarbeitung meiner Daten zum Zweck der Anmeldung bei der OGS Ziel e.V. zu. Mir ist bekannt, dass ich diese Einwilligung jederzeit widerrufen kann.
   ```
4. ✓ Erforderlich
5. **⋮** → **Antwortvalidierung** → **Mindestens auswählen** → `1`

---

## 3. Google Sheets verknüpfen

1. Klicken Sie oben auf **"Antworten"**
2. Klicken Sie auf das **grüne Sheets-Symbol** (Tabelle verknüpfen)
3. Wählen Sie: **Neue Tabelle erstellen**
4. Name: `Anmeldungen_OGS_Ziel`
5. Klicken Sie auf **Erstellen**

✓ Alle Formularantworten werden jetzt automatisch in diese Tabelle geschrieben!

---

## 4. Google Apps Script einrichten

### 4.1 Apps Script öffnen
1. Öffnen Sie die verknüpfte Google Sheets Tabelle
2. Klicken Sie auf **Erweiterungen** → **Apps Script**
3. Ein neuer Tab öffnet sich mit dem Script-Editor

### 4.2 Code einfügen
1. **Löschen** Sie den vorhandenen Code (`function myFunction() {}`)
2. Öffnen Sie die Datei: `c:\DEVOPS\Ziel\scripts\FormularAutomation.gs`
3. **Kopieren** Sie den gesamten Inhalt
4. **Fügen** Sie ihn in den Apps Script Editor ein
5. Klicken Sie auf **💾 Speichern** (Strg+S)
6. Geben Sie dem Projekt einen Namen: `Ziel_Anmelde_Automation`

### 4.3 Konfiguration anpassen
Suchen Sie den Abschnitt `const CONFIG = {` und passen Sie diese Werte an:

```javascript
const CONFIG = {
  ADMIN_EMAIL: 'info.zielev@gmail.com',  // ✓ Bereits korrekt
  BACKUP_FOLDER_ID: 'HIER_IHRE_ORDNER_ID_EINFUEGEN',  // → Siehe Schritt 6
  JOBCENTER_PDF_ID: 'HIER_IHRE_PDF_ID_EINFUEGEN',     // → Später ersetzen
  // ... restliche Einstellungen
};
```

---

## 5. Trigger konfigurieren

### 5.1 Formular-Trigger (E-Mails bei neuer Anmeldung)
1. Im Apps Script Editor: Klicken Sie links auf **⏰ Trigger**
2. Klicken Sie unten rechts auf **+ Trigger hinzufügen**
3. Einstellungen:
   - Funktion: `onFormSubmit`
   - Bereitstellung: `Head`
   - Ereignisquelle: `Aus Tabelle`
   - Ereignistyp: `Bei Formularübermittlung`
4. Klicken Sie auf **Speichern**
5. **Autorisierung:** Google fragt nach Berechtigungen
   - Klicken Sie auf **Erweitert** → **Zu Ziel_Anmelde_Automation wechseln (unsicher)**
   - Klicken Sie auf **Zulassen**

### 5.2 Backup-Trigger (Wöchentlich)
1. **+ Trigger hinzufügen**
2. Einstellungen:
   - Funktion: `createWeeklyBackup`
   - Bereitstellung: `Head`
   - Ereignisquelle: `Zeitgesteuert`
   - Zeitbasierter Trigger: `Wochentimer`
   - Wochentag: `Sonntag`
   - Uhrzeit: `00:00 bis 01:00 Uhr`
3. Klicken Sie auf **Speichern**

---

## 6. Backup-Ordner erstellen

### 6.1 Ordner in Google Drive anlegen
1. Öffnen Sie **https://drive.google.com**
2. Klicken Sie auf **+ Neu** → **Neuer Ordner**
3. Name: `Ziel_eV_Anmeldungen_Archiv`
4. Klicken Sie auf **Erstellen**

### 6.2 Ordner-ID kopieren
1. Öffnen Sie den neuen Ordner
2. Schauen Sie in die **Adressleiste** Ihres Browsers
3. Die URL sieht so aus:
   ```
   https://drive.google.com/drive/folders/1ABC...XYZ
   ```
4. Kopieren Sie den Teil nach `folders/` → Das ist Ihre **Ordner-ID**

### 6.3 ID im Script eintragen
1. Zurück zum Apps Script Editor
2. Ersetzen Sie `'HIER_IHRE_ORDNER_ID_EINFUEGEN'` durch Ihre ID:
   ```javascript
   BACKUP_FOLDER_ID: '1ABC...XYZ',
   ```
3. **Speichern** (Strg+S)

---

## 7. Jimdo-Einbettung

### 7.1 Formular-Link kopieren
1. Öffnen Sie das Google Formular
2. Klicken Sie oben rechts auf **Senden**
3. Klicken Sie auf das **Link-Symbol** 🔗
4. Deaktivieren Sie: **URL kürzen**
5. Kopieren Sie die URL

### 7.2 In Jimdo einfügen
1. Melden Sie sich bei Jimdo an
2. Bearbeiten Sie die gewünschte Seite
3. Fügen Sie ein **Widget/HTML** Element hinzu
4. Fügen Sie diesen Code ein (ersetzen Sie IHRE_URL):

```html
<div style="max-width: 700px; margin: 0 auto;">
  <iframe 
    src="IHRE_GOOGLE_FORMS_URL?embedded=true" 
    width="100%" 
    height="2500" 
    frameborder="0" 
    marginheight="0" 
    marginwidth="0"
    style="border: none;">
    Wird geladen…
  </iframe>
</div>
```

5. Ersetzen Sie `IHRE_GOOGLE_FORMS_URL` durch die kopierte URL
6. **Speichern**

---

## 8. Testen

### 8.1 Formular testen
1. Öffnen Sie das Formular (Vorschau-Symbol 👁️)
2. Füllen Sie alle Felder mit Testdaten aus:
   - E-Mail: Ihre echte E-Mail (für Bestätigung)
   - IBAN: `DE89370400440532013000` (Test-IBAN)
3. Senden Sie das Formular ab

### 8.2 Prüfen
- [ ] Eintrag erscheint in Google Sheets
- [ ] Bestätigungs-E-Mail empfangen
- [ ] Admin-Benachrichtigung an info.zielev@gmail.com empfangen

### 8.3 Backup manuell testen
1. Apps Script Editor öffnen
2. Funktion `createWeeklyBackup` auswählen (Dropdown oben)
3. ▶️ Ausführen
4. Prüfen Sie den Archiv-Ordner in Google Drive

---

## ✅ Checkliste

- [ ] Formular erstellt mit allen Feldern
- [ ] Google Sheets verknüpft
- [ ] Apps Script eingefügt und konfiguriert
- [ ] Trigger eingerichtet (onFormSubmit + wöchentliches Backup)
- [ ] Backup-Ordner erstellt und ID eingetragen
- [ ] In Jimdo eingebettet
- [ ] Testformular erfolgreich abgesendet
- [ ] E-Mails empfangen

---

## 🔧 Fehlerbehebung

| Problem | Lösung |
|---------|--------|
| Keine E-Mail erhalten | Apps Script → Ausführungen prüfen |
| IBAN wird nicht akzeptiert | Nur deutsche IBANs (DE...) |
| Formular in Jimdo zu klein | `height` Wert erhöhen |
| Trigger funktioniert nicht | Berechtigungen erneut erteilen |

---

## 📞 Nächste Schritte

1. **Jobcenter-PDF hochladen:**
   - PDF in Google Drive hochladen
   - Datei-ID kopieren (aus Freigabe-Link)
   - In CONFIG.JOBCENTER_PDF_ID eintragen

2. **Formular-Design anpassen:**
   - Logo hinzufügen
   - Farben anpassen
   - Bestätigungstext ändern

3. **Weitere Felder ergänzen:**
   - Allergien/Unverträglichkeiten
   - Abholberechtigte Personen
   - Gewünschte Betreuungszeiten
