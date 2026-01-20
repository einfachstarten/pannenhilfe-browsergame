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
  // ========== CORRECT INDEX 0 (12 Fragen) ==========
  {
    scenario: 'Fahrzeug zieht beim Bremsen stark nach rechts.',
    options: [
      'Bremssattel blockiert rechts',
      'Reifendruck links zu niedrig',
      'Spurstange verbogen',
      'Differential defekt'
    ],
    correct: 0
  },
  {
    scenario: 'Blaue Rauchentwicklung beim Beschleunigen, Ölverbrauch erhöht.',
    options: [
      'Kolbenringe verschlissen',
      'Kraftstofffilter verstopft',
      'Lambdasonde defekt',
      'Turbolader undicht'
    ],
    correct: 0
  },
  {
    scenario: 'Metallisches Schleifen beim Bremsen, Bremsweg verlängert.',
    options: [
      'Bremsbeläge komplett abgenutzt',
      'Bremsflüssigkeit verunreinigt',
      'Handbremse nicht gelöst',
      'ABS-Sensor defekt'
    ],
    correct: 0
  },
  {
    scenario: 'Fahrzeug vibriert stark ab 100 km/h, Lenkrad schüttelt.',
    options: [
      'Räder unwuchtig',
      'Stoßdämpfer defekt',
      'Keilriemen lose',
      'Motorlager verschlissen'
    ],
    correct: 0
  },
  {
    scenario: 'Süßlicher Geruch im Innenraum, Scheiben beschlagen stark.',
    options: [
      'Wärmetauscher undicht',
      'Klimaanlage defekt',
      'Innenraumfilter verstopft',
      'Gebläsemotor überhitzt'
    ],
    correct: 0
  },
  {
    scenario: 'Motor ruckelt beim Beschleunigen, Motorkontrollleuchte blinkt.',
    options: [
      'Zündaussetzer in einem Zylinder',
      'Luftmassenmesser defekt',
      'Kupplung rutscht',
      'Einspritzventil verstopft'
    ],
    correct: 0
  },
  {
    scenario: 'Fahrzeugbeleuchtung flackert im Stand, Batterie-Symbol leuchtet.',
    options: [
      'Lichtmaschine defekt',
      'Batterie tiefentladen',
      'Sicherung durchgebrannt',
      'Massekabel korrodiert'
    ],
    correct: 0
  },
  {
    scenario: 'Lautes Heulen beim Beschleunigen, wird mit Geschwindigkeit lauter.',
    options: [
      'Radlager verschlissen',
      'Differential-Öl zu niedrig',
      'Auspuff lose',
      'Antriebswelle vibriert'
    ],
    correct: 0
  },
  {
    scenario: 'Kupplungspedal hat keinen Druckpunkt mehr, Gang lässt sich nicht einlegen.',
    options: [
      'Kupplungsgeberzylinder defekt',
      'Kupplungsscheibe verschlissen',
      'Schaltgestänge verbogen',
      'Getriebeöl zu niedrig'
    ],
    correct: 0
  },
  {
    scenario: 'Weißer Rauch aus dem Auspuff, Kühlmittelstand sinkt kontinuierlich.',
    options: [
      'Zylinderkopfdichtung defekt',
      'Wasserpumpe undicht',
      'Thermostat klemmt',
      'Kühler verstopft'
    ],
    correct: 0
  },
  {
    scenario: 'ESP-Leuchte dauerhaft an, Traktionskontrolle nicht aktivierbar.',
    options: [
      'Raddrehzahlsensor defekt',
      'ABS-Steuergerät defekt',
      'Reifendruck ungleich',
      'Lenkwinkelsensor falsch kalibriert'
    ],
    correct: 0
  },
  {
    scenario: 'Anlasser dreht, Motor springt nicht an, starker Benzingeruch.',
    options: [
      'Zündspule ausgefallen',
      'Kraftstoffpumpe defekt',
      'Luftfilter verstopft',
      'Nockenwellensensor defekt'
    ],
    correct: 0
  },

  // ========== CORRECT INDEX 1 (12 Fragen) ==========
  {
    scenario: 'Motor überhitzt bei Autobahnfahrt, Temperaturanzeige im roten Bereich.',
    options: [
      'Thermostat klemmt geschlossen',
      'Kühlmittel fehlt komplett',
      'Motoröl zu niedrig',
      'Lüfter defekt'
    ],
    correct: 1
  },
  {
    scenario: 'Warnleuchte "Öldruck" leuchtet rot während der Fahrt.',
    options: [
      'Ölfilter verstopft',
      'Öldruckschalter defekt oder Öldruck zu niedrig',
      'Ölstand zu hoch',
      'Ölpumpe läuft zu schnell'
    ],
    correct: 1
  },
  {
    scenario: 'Lautes Klackern vorne beim Einlenken in Kurven.',
    options: [
      'Spurstangenkopf lose',
      'Antriebswellengelenk defekt',
      'Radlager verschlissen',
      'Querlenker gebrochen'
    ],
    correct: 1
  },
  {
    scenario: 'Reifen sind außen stark abgefahren, innen fast wie neu.',
    options: [
      'Reifendruck zu hoch',
      'Sturz falsch eingestellt',
      'Spur verstellt',
      'Stoßdämpfer defekt'
    ],
    correct: 1
  },
  {
    scenario: 'Motor geht während Fahrt aus, Instrumente tot, kein Anlasser.',
    options: [
      'Zündschloss defekt',
      'Batterie komplett entladen',
      'Kraftstoffpumpe ausgefallen',
      'Wegfahrsperre aktiviert'
    ],
    correct: 1
  },
  {
    scenario: 'Schwarzer Rauch beim Beschleunigen (Dieselfahrzeug), Leistungsverlust.',
    options: [
      'AdBlue-System defekt',
      'Luftfilter stark verschmutzt',
      'DPF verstopft',
      'Turbolader defekt'
    ],
    correct: 1
  },
  {
    scenario: 'Gangschaltung lässt sich bei laufendem Motor schwer einlegen.',
    options: [
      'Getriebeöl falsche Viskosität',
      'Kupplung trennt nicht vollständig',
      'Schaltgestänge verstellt',
      'Synchronringe verschlissen'
    ],
    correct: 1
  },
  {
    scenario: 'Schlüssel lässt sich nicht im Zündschloss drehen.',
    options: [
      'Batterie komplett leer',
      'Lenkradsperre eingerastet',
      'Zündschloss vereist',
      'Wegfahrsperre aktiv'
    ],
    correct: 1
  },
  {
    scenario: 'Diesel springt morgens bei Kälte schlecht an, Vorglühlampe blinkt.',
    options: [
      'Kraftstofffilter vereist',
      'Glühkerzen defekt',
      'Batterie schwach',
      'Einspritzpumpe defekt'
    ],
    correct: 1
  },
  {
    scenario: 'Starkes Ruckeln beim Anfahren am Berg, Brandgeruch.',
    options: [
      'Motor überhitzt',
      'Kupplung rutscht durch',
      'Handbremse schleift',
      'Getriebe im falschen Gang'
    ],
    correct: 1
  },
  {
    scenario: 'Leerlauf sehr unruhig, Motor droht auszugehen, MKL leuchtet.',
    options: [
      'Zündkerzen verrußt',
      'Leerlaufregelventil defekt',
      'Kraftstoffpumpe schwach',
      'Nockenwelle verstellt'
    ],
    correct: 1
  },
  {
    scenario: 'ABS-Leuchte permanent an, Bremse funktioniert normal.',
    options: [
      'Bremsflüssigkeitsstand niedrig',
      'ABS-Sensor verschmutzt',
      'Hauptbremszylinder undicht',
      'Bremskraftverstärker defekt'
    ],
    correct: 1
  },

  // ========== CORRECT INDEX 2 (12 Fragen) ==========
  {
    scenario: 'Motor startet nicht, alle elektrischen Verbraucher funktionslos.',
    options: [
      'Anlasser defekt',
      'Zündschloss defekt',
      'Batterie komplett leer',
      'Sicherung Hauptstromkreis durch'
    ],
    correct: 2
  },
  {
    scenario: 'Pfeifen beim Beschleunigen, Leistungsverlust bei hohen Drehzahlen.',
    options: [
      'Auspuff undicht',
      'Ladeluftkühler undicht',
      'Turbolader-Leckage',
      'Ansaugkrümmer gerissen'
    ],
    correct: 2
  },
  {
    scenario: 'Starke Vibration beim Bremsen aus hoher Geschwindigkeit.',
    options: [
      'Bremsbeläge ungleichmäßig',
      'Bremssättel festgefressen',
      'Bremsscheiben verzogen',
      'Radlager defekt'
    ],
    correct: 2
  },
  {
    scenario: 'Klopfgeräusche aus dem Motor bei Volllast, Leistungsverlust.',
    options: [
      'Ventile falsch eingestellt',
      'Kraftstoff minderer Qualität',
      'Klopfsensor defekt',
      'Zündkerzen falsche Wärmewert'
    ],
    correct: 2
  },
  {
    scenario: 'Servolenkung ohne Funktion, Lenkung sehr schwergängig.',
    options: [
      'Lenkgetriebe defekt',
      'Spurstange verbogen',
      'Hydraulikpumpe defekt',
      'Lenksäule verklemmt'
    ],
    correct: 2
  },
  {
    scenario: 'Benzingeruch im Innenraum, Kraftstoffanzeige sinkt im Stand.',
    options: [
      'Tankdeckel undicht',
      'Aktivkohlefilter defekt',
      'Kraftstoffleitung undicht',
      'Tankentlüftung verstopft'
    ],
    correct: 2
  },
  {
    scenario: 'Airbag-Leuchte leuchtet permanent, Airbag deaktiviert.',
    options: [
      'Batterie Unterspannung',
      'Gurtstraffer defekt',
      'Airbag-Steuergerät Fehler',
      'Sitzbelegungsmatte defekt'
    ],
    correct: 2
  },
  {
    scenario: 'Automatikgetriebe schaltet ruckartig, Schaltpunkte verzögert.',
    options: [
      'Getriebeöl falsche Temperatur',
      'Drehmomentwandler defekt',
      'Getriebeöl zu niedrig',
      'Schaltschieber verklemmt'
    ],
    correct: 2
  },
  {
    scenario: 'Starker Ölgeruch nach längerer Fahrt, kein sichtbares Leck.',
    options: [
      'Ventildeckeldichtung undicht',
      'Ölwanne Steinschlag',
      'Turbolader-Ölleitungen undicht',
      'Kurbelwellendichtring porös'
    ],
    correct: 2
  },
  {
    scenario: 'Scheibenwischer bewegen sich extrem langsam, Motor summt.',
    options: [
      'Scheibenwischermotor verschlissen',
      'Gestänge verkantet',
      'Relais defekt',
      'Sicherung zu schwach'
    ],
    correct: 2
  },
  {
    scenario: 'Klimaanlage kühlt nicht, Kompressor läuft nicht an.',
    options: [
      'Kältemittel zu viel',
      'Klimakondensator verstopft',
      'Kältemittel komplett leer',
      'Innenraumtemperatursensor defekt'
    ],
    correct: 2
  },
  {
    scenario: 'Hupe funktioniert nicht, Airbag-Leuchte normal.',
    options: [
      'Lenkstockhebel defekt',
      'Hupe verschmutzt',
      'Schleifring im Lenkrad defekt',
      'Relais ausgefallen'
    ],
    correct: 2
  },

  // ========== CORRECT INDEX 3 (12 Fragen) ==========
  {
    scenario: 'Abgaswarnleuchte leuchtet, Motor läuft normal, kein Leistungsverlust.',
    options: [
      'Katalysator defekt',
      'Lambdasonde verrußt',
      'Partikelfilter verstopft',
      'Abgasrückführungsventil klemmt'
    ],
    correct: 3
  },
  {
    scenario: 'Rückwärtsgang lässt sich nicht einlegen, alle Vorwärtsgänge OK.',
    options: [
      'Kupplung trennt nicht',
      'Getriebeöl zu niedrig',
      'Synchronring verschlissen',
      'Schaltgabel Rückwärtsgang verbogen'
    ],
    correct: 3
  },
  {
    scenario: 'Batterieleuchte flackert bei niedrigen Drehzahlen.',
    options: [
      'Batterie defekt',
      'Lichtmaschine Reglerdefekt',
      'Keilriemen rutscht',
      'Keilriemen zu locker'
    ],
    correct: 3
  },
  {
    scenario: 'Tankanzeige bleibt auf "Voll" stehen, trotz Fahrt.',
    options: [
      'Tankdeckel undicht',
      'Kraftstoffpumpe defekt',
      'Kraftstofffilter zu',
      'Tankschwimmer klemmt'
    ],
    correct: 3
  },
  {
    scenario: 'Starkes Quietschen beim Kaltstart, verschwindet nach Warmlauf.',
    options: [
      'Lichtmaschine Lager defekt',
      'Wasserpumpe defekt',
      'Servopumpe undicht',
      'Keilriemen oder Spannrolle'
    ],
    correct: 3
  },
  {
    scenario: 'Fensterheber bewegt sich nur langsam nach unten.',
    options: [
      'Motor verschlissen',
      'Fensterheberschalter defekt',
      'Sicherung zu schwach',
      'Fensterführung verschmutzt'
    ],
    correct: 3
  },
  {
    scenario: 'Standheizung startet nicht, Display zeigt Fehlercode.',
    options: [
      'Batterie zu schwach',
      'Kraftstoffpumpe defekt',
      'Glühkerze verschlissen',
      'Steuergerät defekt'
    ],
    correct: 3
  },
  {
    scenario: 'Scheinwerfer beschlagen von innen, Lichtausbeute reduziert.',
    options: [
      'Leuchtmittel zu heiß',
      'Streuscheibe gerissen',
      'Reflektor oxidiert',
      'Entlüftung verstopft'
    ],
    correct: 3
  },
  {
    scenario: 'Tacho zeigt keine Geschwindigkeit an, Kilometer laufen weiter.',
    options: [
      'Tachowelle gebrochen',
      'ABS-Sensor defekt',
      'Kombiinstrument defekt',
      'Geschwindigkeitssensor defekt'
    ],
    correct: 3
  },
  {
    scenario: 'Zentralverriegelung öffnet nur Fahrerseite, Rest bleibt zu.',
    options: [
      'Fernbedienung Batterie leer',
      'Stellmotor Beifahrerseite defekt',
      'Steuergerät defekt',
      'Türschloss mechanisch blockiert'
    ],
    correct: 3
  },
  {
    scenario: 'AdBlue-Warnleuchte blinkt, Reichweite unter 1000 km.',
    options: [
      'AdBlue-Pumpe defekt',
      'SCR-Katalysator defekt',
      'AdBlue vereist',
      'AdBlue-Tank fast leer'
    ],
    correct: 3
  },
  {
    scenario: 'Reifendruck-Kontrollleuchte leuchtet, alle Reifen korrekt befüllt.',
    options: [
      'Ventil undicht',
      'Sensor Batterie leer',
      'Temperaturschwankung',
      'Sensor nicht angelernt nach Radwechsel'
    ],
    correct: 3
  }
];
