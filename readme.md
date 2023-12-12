# Lösung der A3 (Volodymyr Drobitko)

# Achtung: Keine vollständige Lösung!

- app starten: node app.js
- die Tabelle wird nicht angezeigt
- main js und ajax wurden nicht verknüpft (wo kann die Infos dazu nachlesen?)

## Parse csv:

- ich benutzte die aktuelle Version csvtojson/v2 (Grund: v1 Converter.fromFile is not a function)
- parseCSV ist eine asynchrone Funktion, weil sonst sie undefined liefern würde
- die Funktion speichert das JSON-String zu world_data.json und gibt einen JS-Object mit den Daten zurück

## Rest:

- die Endpunkte bitte auf localhost:3000 mit den entsprechenden URL testen
- Post Anfrage wurde nicht implementiert
- properties starten mit Index 0
