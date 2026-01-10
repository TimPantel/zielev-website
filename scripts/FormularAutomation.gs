/**
 * ============================================================
 * Ziel e.V. - Online-Anmelde-System
 * Google Apps Script für Formular-Automatisierung
 * ============================================================
 * 
 * Funktionen:
 * - Bestätigungs-E-Mail an Antragsteller
 * - Benachrichtigungs-E-Mail an Admin
 * - IBAN-Validierung (deutsches Format + Prüfsumme)
 * - Wöchentliche Backups (Sheet + JSON)
 * - PDF-Anhang bei Jobcenter-Förderung
 * 
 * Einrichtung:
 * 1. Diesen Code in Apps Script (Erweiterungen → Apps Script) einfügen
 * 2. CONFIG-Werte anpassen
 * 3. Trigger für onFormSubmit und createWeeklyBackup einrichten
 */

// ============================================================
// KONFIGURATION - BITTE ANPASSEN
// ============================================================

const CONFIG = {
  // E-Mail-Adresse des Vereins (Absender und Admin-Empfänger)
  ADMIN_EMAIL: 'info.zielev@gmail.com',
  
  // Google Drive Ordner-ID für Backups
  // So finden Sie die ID: Ordner öffnen → URL enthält "folders/XXXXX" → XXXXX kopieren
  BACKUP_FOLDER_ID: 'HIER_IHRE_ORDNER_ID_EINFUEGEN',
  
  // Google Drive Datei-ID des Jobcenter-PDFs
  // So finden Sie die ID: Datei → Freigeben → Link kopieren → ID ist zwischen "d/" und "/view"
  JOBCENTER_PDF_ID: 'HIER_IHRE_PDF_ID_EINFUEGEN',
  
  // Name des Formularfelds für E-Mail-Adresse (exakt wie im Formular)
  EMAIL_FIELD: 'E-Mail-Adresse',
  
  // Name des Formularfelds für Jobcenter-Förderung
  JOBCENTER_FIELD: 'Jobcenter-Förderung',
  
  // Name des Formularfelds für IBAN
  IBAN_FIELD: 'IBAN',
  
  // Name des Formularfelds für Kindname (für E-Mail-Personalisierung)
  CHILD_NAME_FIELD: 'Vorname des Kindes'
};

// ============================================================
// E-MAIL VORLAGEN
// ============================================================

const EMAIL_TEMPLATES = {
  // Bestätigungs-E-Mail an Antragsteller
  CONFIRMATION: {
    subject: 'Bestätigung Ihrer Anmeldung - OGS Ziel e.V.',
    body: `Sehr geehrte Damen und Herren,

hiermit bestätigen wir den Erhalt Ihrer Anfrage auf einen Platz bei der OGS Ziel e.V.

Es folgt zum späteren Zeitpunkt eine E-Mail mit der Zu- oder Absage.

Freundliche Grüße

Das Team vom Ziel e.V.

---
Dies ist eine automatisch generierte E-Mail. Bitte antworten Sie nicht direkt auf diese Nachricht.`
  },
  
  // Benachrichtigung an Admin
  NOTIFICATION: {
    subject: 'Neue Anmeldung eingegangen - OGS Ziel e.V.',
    bodyTemplate: (childName, timestamp) => `Neue Anmeldung eingegangen!

Zeitpunkt: ${timestamp}
Kind: ${childName}

Bitte prüfen Sie die Anmeldung in der Google Sheets Tabelle.

---
Automatische Benachrichtigung vom Anmeldesystem`
  }
};

// ============================================================
// HAUPTFUNKTION: Bei Formularübermittlung
// ============================================================

/**
 * Wird automatisch bei jeder Formularübermittlung ausgeführt.
 * Trigger einrichten: Trigger → + Trigger hinzufügen → Bei Formularübermittlung
 * 
 * @param {Object} e - Event-Objekt mit Formulardaten
 */
function onFormSubmit(e) {
  try {
    // Formulardaten auslesen
    const responses = e.namedValues;
    const timestamp = new Date().toLocaleString('de-DE');
    
    // E-Mail des Antragstellers
    const applicantEmail = responses[CONFIG.EMAIL_FIELD] ? 
                           responses[CONFIG.EMAIL_FIELD][0] : null;
    
    // Name des Kindes (für Personalisierung)
    const childName = responses[CONFIG.CHILD_NAME_FIELD] ? 
                      responses[CONFIG.CHILD_NAME_FIELD][0] : 'Nicht angegeben';
    
    // Jobcenter-Förderung ausgewählt?
    const jobcenterSelected = responses[CONFIG.JOBCENTER_FIELD] ? 
                              responses[CONFIG.JOBCENTER_FIELD][0].toLowerCase().includes('ja') : false;
    
    // IBAN validieren (falls vorhanden)
    const iban = responses[CONFIG.IBAN_FIELD] ? responses[CONFIG.IBAN_FIELD][0] : null;
    if (iban && !validateIBAN(iban)) {
      // IBAN ungültig - Admin benachrichtigen
      logError('IBAN-Validierung fehlgeschlagen', iban);
    }
    
    // 1. Bestätigungs-E-Mail an Antragsteller
    if (applicantEmail) {
      sendConfirmationEmail(applicantEmail, childName, jobcenterSelected);
    }
    
    // 2. Benachrichtigung an Admin
    sendNotificationEmail(childName, timestamp, responses);
    
    // Log für Debugging
    console.log(`Anmeldung verarbeitet: ${childName} (${timestamp})`);
    
  } catch (error) {
    logError('Fehler bei Formularverarbeitung', error.message);
  }
}

// ============================================================
// E-MAIL FUNKTIONEN
// ============================================================

/**
 * Sendet Bestätigungs-E-Mail an den Antragsteller.
 * Bei Jobcenter-Förderung wird das PDF angehängt.
 */
function sendConfirmationEmail(recipientEmail, childName, attachJobcenterPdf) {
  try {
    let options = {
      name: 'Ziel e.V.',
      replyTo: CONFIG.ADMIN_EMAIL
    };
    
    // PDF anhängen wenn Jobcenter ausgewählt
    if (attachJobcenterPdf && CONFIG.JOBCENTER_PDF_ID !== 'HIER_IHRE_PDF_ID_EINFUEGEN') {
      try {
        const pdfFile = DriveApp.getFileById(CONFIG.JOBCENTER_PDF_ID);
        options.attachments = [pdfFile.getAs(MimeType.PDF)];
      } catch (pdfError) {
        logError('PDF-Anhang konnte nicht geladen werden', pdfError.message);
      }
    }
    
    MailApp.sendEmail(
      recipientEmail,
      EMAIL_TEMPLATES.CONFIRMATION.subject,
      EMAIL_TEMPLATES.CONFIRMATION.body,
      options
    );
    
    console.log(`Bestätigung gesendet an: ${recipientEmail}`);
    
  } catch (error) {
    logError('Fehler beim Senden der Bestätigungs-E-Mail', error.message);
  }
}

/**
 * Sendet Benachrichtigung an den Admin bei neuer Anmeldung.
 */
function sendNotificationEmail(childName, timestamp, allResponses) {
  try {
    const body = EMAIL_TEMPLATES.NOTIFICATION.bodyTemplate(childName, timestamp);
    
    MailApp.sendEmail(
      CONFIG.ADMIN_EMAIL,
      EMAIL_TEMPLATES.NOTIFICATION.subject,
      body,
      { name: 'Anmeldesystem Ziel e.V.' }
    );
    
    console.log('Admin-Benachrichtigung gesendet');
    
  } catch (error) {
    logError('Fehler beim Senden der Admin-Benachrichtigung', error.message);
  }
}

// ============================================================
// IBAN-VALIDIERUNG
// ============================================================

/**
 * Validiert eine deutsche IBAN nach ISO 13616.
 * Prüft Format UND mathematische Prüfsumme (Modulo 97).
 * 
 * @param {string} iban - Die zu prüfende IBAN
 * @returns {boolean} true wenn gültig, false wenn ungültig
 */
function validateIBAN(iban) {
  if (!iban) return false;
  
  // Leerzeichen und Bindestriche entfernen, Großbuchstaben
  iban = iban.replace(/[\s-]/g, '').toUpperCase();
  
  // 1. Format-Prüfung: Deutsche IBAN = DE + 2 Prüfziffern + 18 Ziffern = 22 Zeichen
  const germanIbanRegex = /^DE[0-9]{20}$/;
  if (!germanIbanRegex.test(iban)) {
    console.log('IBAN Format ungültig: ' + iban);
    return false;
  }
  
  // 2. Prüfsummen-Validierung (ISO 13616 / Modulo 97)
  // IBAN umstellen: Erste 4 Zeichen ans Ende
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  
  // Buchstaben in Zahlen umwandeln (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (let char of rearranged) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }
  
  // Modulo 97 berechnen (für große Zahlen in Teilen)
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  const isValid = remainder === 1;
  console.log(`IBAN ${iban}: ${isValid ? 'GÜLTIG' : 'UNGÜLTIG'}`);
  
  return isValid;
}

/**
 * Test-Funktion für IBAN-Validierung.
 * Zum Testen im Apps Script Editor ausführen.
 */
function testIBANValidation() {
  // Test mit bekannten IBANs
  const testCases = [
    { iban: 'DE89 3704 0044 0532 0130 00', expected: true, name: 'Gültige Test-IBAN' },
    { iban: 'DE89370400440532013000', expected: true, name: 'Ohne Leerzeichen' },
    { iban: 'DE00123456789012345678', expected: false, name: 'Ungültige Prüfsumme' },
    { iban: 'FR7630006000011234567890189', expected: false, name: 'Französische IBAN' },
    { iban: 'DE1234', expected: false, name: 'Zu kurz' }
  ];
  
  console.log('=== IBAN Validierung Tests ===');
  for (let test of testCases) {
    const result = validateIBAN(test.iban);
    const status = result === test.expected ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${test.name}`);
  }
}

// ============================================================
// BACKUP-FUNKTIONEN
// ============================================================

/**
 * Erstellt wöchentliches Backup der Anmeldedaten.
 * Trigger einrichten: Zeitgesteuert → Wöchentlicher Timer
 * 
 * Erstellt:
 * 1. Kopie der Google Sheets Tabelle
 * 2. JSON-Export aller Daten
 */
function createWeeklyBackup() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Datum für Dateinamen
    const today = new Date();
    const dateString = Utilities.formatDate(today, 'Europe/Berlin', 'yyyy-MM-dd');
    
    // Backup-Ordner
    let backupFolder;
    if (CONFIG.BACKUP_FOLDER_ID === 'HIER_IHRE_ORDNER_ID_EINFUEGEN') {
      // Fallback: Backup im Root-Ordner
      backupFolder = DriveApp.getRootFolder();
      console.log('WARNUNG: Kein Backup-Ordner konfiguriert. Speichere im Root.');
    } else {
      backupFolder = DriveApp.getFolderById(CONFIG.BACKUP_FOLDER_ID);
    }
    
    // 1. Sheet-Kopie erstellen
    const backupName = `Anmeldungen_Backup_${dateString}`;
    const spreadsheetCopy = spreadsheet.copy(backupName);
    const copyFile = DriveApp.getFileById(spreadsheetCopy.getId());
    
    // In Backup-Ordner verschieben
    backupFolder.addFile(copyFile);
    DriveApp.getRootFolder().removeFile(copyFile);
    
    console.log(`Sheet-Backup erstellt: ${backupName}`);
    
    // 2. JSON-Backup erstellen
    createJSONBackup(data, dateString, backupFolder);
    
  } catch (error) {
    logError('Fehler beim Erstellen des Backups', error.message);
  }
}

/**
 * Erstellt JSON-Backup der Daten.
 * Erste Zeile = Header, Rest = Datensätze
 */
function createJSONBackup(data, dateString, folder) {
  try {
    if (data.length < 2) {
      console.log('Keine Daten für JSON-Backup vorhanden');
      return;
    }
    
    const headers = data[0];
    const records = [];
    
    // Daten in Objekte umwandeln
    for (let i = 1; i < data.length; i++) {
      const record = {};
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = data[i][j];
      }
      records.push(record);
    }
    
    const jsonContent = JSON.stringify({
      exportDate: dateString,
      totalRecords: records.length,
      data: records
    }, null, 2);
    
    // JSON-Datei erstellen
    const fileName = `Anmeldungen_Backup_${dateString}.json`;
    folder.createFile(fileName, jsonContent, MimeType.PLAIN_TEXT);
    
    console.log(`JSON-Backup erstellt: ${fileName} (${records.length} Einträge)`);
    
  } catch (error) {
    logError('Fehler beim JSON-Backup', error.message);
  }
}

// ============================================================
// HILFSFUNKTIONEN
// ============================================================

/**
 * Protokolliert Fehler in der Console und optional per E-Mail.
 */
function logError(context, message) {
  const errorLog = `[${new Date().toLocaleString('de-DE')}] ${context}: ${message}`;
  console.error(errorLog);
  
  // Optional: Fehler per E-Mail an Admin
  // MailApp.sendEmail(CONFIG.ADMIN_EMAIL, 'Fehler im Anmeldesystem', errorLog);
}

/**
 * Manueller Test der E-Mail-Funktionen.
 * In Apps Script ausführen zum Testen.
 */
function testEmailFunctions() {
  // Test Bestätigungs-E-Mail (an eigene Adresse)
  sendConfirmationEmail(CONFIG.ADMIN_EMAIL, 'Max Mustermann', false);
  
  // Test Admin-Benachrichtigung
  sendNotificationEmail('Test Kind', new Date().toLocaleString('de-DE'), {});
  
  console.log('Test-E-Mails gesendet an: ' + CONFIG.ADMIN_EMAIL);
}

/**
 * Setup-Funktion: Erstellt Backup-Ordner wenn nicht vorhanden.
 */
function initialSetup() {
  try {
    // Backup-Ordner erstellen
    const folderName = 'Ziel_eV_Anmeldungen_Archiv';
    const folders = DriveApp.getFoldersByName(folderName);
    
    let folder;
    if (folders.hasNext()) {
      folder = folders.next();
      console.log('Backup-Ordner existiert bereits');
    } else {
      folder = DriveApp.createFolder(folderName);
      console.log('Backup-Ordner erstellt: ' + folderName);
    }
    
    console.log('Ordner-ID für CONFIG: ' + folder.getId());
    console.log('Bitte diese ID in CONFIG.BACKUP_FOLDER_ID eintragen!');
    
  } catch (error) {
    logError('Fehler beim Setup', error.message);
  }
}
