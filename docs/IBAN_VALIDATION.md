# IBAN-Validierung - Technische Dokumentation

## Übersicht

Die IBAN-Validierung erfolgt in zwei Stufen:

1. **Format-Prüfung** (Google Forms) - Regulärer Ausdruck
2. **Prüfsummen-Validierung** (Apps Script) - ISO 13616 Algorithmus

---

## Stufe 1: Format-Prüfung (Google Forms)

### Regulärer Ausdruck für deutsche IBAN

```regex
^DE[0-9]{2}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{4}[\s]?[0-9]{2}$
```

### Erklärung

| Teil | Bedeutung |
|------|-----------|
| `^DE` | Beginnt mit "DE" (Länderkennzeichen) |
| `[0-9]{2}` | 2 Prüfziffern |
| `[\s]?` | Optionales Leerzeichen |
| `[0-9]{4}` | 4-stellige Zifferngruppen |
| `$` | Ende der Eingabe |

### Beispiele

| Eingabe | Gültig? |
|---------|---------|
| `DE89370400440532013000` | ✓ |
| `DE89 3704 0044 0532 0130 00` | ✓ |
| `FR7630006000011234567890189` | ✗ |
| `DE123` | ✗ |

---

## Stufe 2: Prüfsummen-Validierung (Apps Script)

### ISO 13616 Algorithmus

```javascript
function validateIBAN(iban) {
  // 1. Bereinigung
  iban = iban.replace(/[\s-]/g, '').toUpperCase();
  
  // 2. Format prüfen
  if (!/^DE[0-9]{20}$/.test(iban)) return false;
  
  // 3. Umstellen: Erste 4 Zeichen ans Ende
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  
  // 4. Buchstaben → Zahlen (A=10, B=11, ..., Z=35)
  let numericString = '';
  for (let char of rearranged) {
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }
  
  // 5. Modulo 97 berechnen
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  // 6. Gültig wenn Rest = 1
  return remainder === 1;
}
```

### Beispielrechnung

**IBAN:** `DE89370400440532013000`

1. **Umstellen:** `370400440532013000DE89`
2. **Buchstaben umwandeln:** D=13, E=14 → `3704004405320130001314 89`
3. **Modulo 97:** `370400440532013000131489 mod 97 = 1` ✓

---

## Fehlermeldungen im Formular

Bei ungültiger IBAN zeigt Google Forms:
> "Bitte geben Sie eine gültige deutsche IBAN ein (DE + 20 Ziffern)"

Bei Prüfsummen-Fehler wird der Admin per Log benachrichtigt.
