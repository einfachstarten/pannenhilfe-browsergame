export const baseSpeed = 5;
export const repairDuration = 50;
export const powerupDurationMs = 30000;

export const carColors = ['#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#ef4444', '#f97316'];

export const colorFallbacks = {
  shield: '#06b6d4',
  magnet: '#d946ef',
  success: '#10b981',
  danger: '#ef4444',
  default: '#ffffff'
};

export const fallbackLeaderboard = [
  { name: 'GelberEngel', score: 150 },
  { name: 'PannenPro', score: 120 },
  { name: 'TrafficKing', score: 95 }
];

export const diagnosticQuestions = [
  { scenario: 'Motor startet nicht, Licht & Radio funktionieren nicht. Kein Anlasser-Geräusch.', options: ['Lichtmaschine defekt', 'Batterie tiefentladen', 'Zündkerzen verschlissen', 'Tank leer'], correct: 1 },
  { scenario: 'Motor überhitzt, weißer Rauch steigt aus der Motorhaube auf.', options: ['Kühlmittelverlust', 'Zu wenig Öl', 'Reifenpanne', 'Klimaanlage defekt'], correct: 0 },
  { scenario: "Warnleuchte 'Ölkanne' leuchtet rot auf.", options: ['Wischwasser leer', 'Zu viel Öl', 'Öldruck zu niedrig', 'Bremsbeläge abgenutzt'], correct: 2 },
  { scenario: 'Fahrzeug zieht beim Bremsen stark nach links.', options: ['Radio zu laut', 'Bremssattel fest', 'Batterie schwach', 'Auspuff undicht'], correct: 1 },
  { scenario: 'Blaue Wolke kommt beim Gasgeben aus dem Auspuff.', options: ['Motor verbrennt Öl', 'Wasser im Tank', 'Katalysator neu', 'Reifen drehen durch'], correct: 0 },
  { scenario: 'Lautes Klackern vorne beim Einlenken und Anfahren.', options: ['Hupe defekt', 'Antriebswelle defekt', 'Fenster offen', 'Scheibenwischer trocken'], correct: 1 },
  { scenario: 'Motor läuft unrund, Motorkontrollleuchte blinkt gelb.', options: ['Zündaussetzer', 'Reifen platt', 'Kofferraum offen', 'Tank voll'], correct: 0 },
  { scenario: 'Reifen sind an den Außenkanten stark abgefahren.', options: ['Zu hoher Luftdruck', 'Falsche Spur/Sturz', 'Zu wenig Profil', 'Felge rostig'], correct: 1 },
  { scenario: 'Motor geht während der Fahrt einfach aus und springt nicht mehr an.', options: ['Lichtmaschine/Generator', 'Kühlwasser leer', 'Bremslicht defekt', 'Radio Sicherung'], correct: 0 },
  { scenario: 'Schwarzer Rauch aus dem Auspuff bei Diesel-Fahrzeug.', options: ['Luftfilter verstopft/Turbo', 'AdBlue leer', 'Falsch getankt (Benzin)', 'Zündkerzen nass'], correct: 0 },
  { scenario: 'Kupplungspedal bleibt am Boden liegen.', options: ['Seilzug/Hydraulik defekt', 'Gaspedal klemmt', 'Bremsflüssigkeit voll', 'Batterie leer'], correct: 0 },
  { scenario: 'Fahrzeug vibriert stark ab 100 km/h im Lenkrad.', options: ['Unwucht in Rädern', 'Motorlager defekt', 'Keilriemen lose', 'Auspuff lose'], correct: 0 },
  { scenario: 'Süßlicher Geruch im Innenraum, Scheiben beschlagen.', options: ['Wärmetauscher undicht', 'Klimaanlage leer', 'Duftbaum verfallen', 'Fenster offen'], correct: 0 },
  { scenario: 'Auto springt morgens schlecht an, \'Vorglüh\'-Lampe blinkt.', options: ['Glühkerzen defekt', 'Turbolader defekt', 'Ölwechsel fällig', 'Reifendruck niedrig'], correct: 0 },
  { scenario: 'Gangschaltung lässt sich bei laufendem Motor schwer einlegen.', options: ['Kupplung trennt nicht', 'Handbremse angezogen', 'Lenkradsperre drin', 'Licht an'], correct: 0 },
  { scenario: 'Metallisches Schleifen beim Bremsen.', options: ['Bremsbeläge runter', 'Rost an der Tür', 'Auspuff schleift', 'Radlager defekt'], correct: 0 },
  { scenario: 'ESP-Leuchte brennt dauerhaft.', options: ['ABS/Drehzahlsensor', 'Reifen zu neu', 'Motor zu warm', 'Radio kein Empfang'], correct: 0 },
  { scenario: 'Motor ruckelt stark beim Beschleunigen.', options: ['Kraftstofffilter zu', 'Scheibenwasser leer', 'Innenraumlicht an', 'Reifen unwuchtig'], correct: 0 },
  { scenario: 'Schlüssel dreht sich nicht im Zündschloss.', options: ['Lenkradschloss eingerastet', 'Falscher Schlüssel', 'Batterie leer', 'Anlasser defekt'], correct: 0 },
  { scenario: 'Fahrzeugbeleuchtung flackert im Leerlauf.', options: ['Spannungsregler defekt', 'Birne locker', 'Radio zu laut', 'Sicherung durch'], correct: 0 }
];
