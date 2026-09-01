# TuriSafe

MVP de aplicacion web para turismo y asistencia ante desastres naturales. Permite visualizar ciudades en un mapa interactivo, consultar riesgos climaticos por mes, obtener el estado de riesgo en tiempo real y coordinar donaciones en situaciones de alerta.

## Como ejecutar

```bash
# Instalar dependencias Python
pip install -r requirements.txt

# Levantar servidor local
python -m http.server 8080
```

Abre tu navegador en http://localhost:8080

## Como ejecutar los tests

```bash
pip install -r requirements.txt
pytest tests/
```

## Estructura de carpetas

```
TuriSafe/
├── index.html          # Pagina principal (P3)
├── data/
│   └── ciudades.json   # Dataset de ciudades (P1)
├── css/
│   ├── style.css       # Estilos base (P3)
│   └── responsive.css  # Media queries (P3)
├── js/
│   ├── main.js         # Orquestador (P5)
│   ├── map.js          # Mapa Leaflet (P2)
│   ├── weather.js      # API meteorologica (P2)
│   ├── risk.js         # Calculo de riesgo (P2)
│   ├── donations.js    # Donaciones (P4)
│   ├── offline.js      # Almacenamiento local (P5)
│   ├── alerts.js       # Alertas (P5)
│   └── reports.js      # Reportes ciudadanos (P5)
├── models/
│   └── ciudad.py       # Modelos Pydantic (P1)
├── tests/
│   ├── test_ciudades.py  # Tests de datos (P1)
│   └── test_schema.py    # Tests de esquema (P1)
├── assets/
│   ├── images/
│   └── icons/
├── requirements.txt
├── package.json
└── TESTING.md
```

## Roles del equipo

| Persona | Rol              | Archivos principales                                          |
|---------|------------------|---------------------------------------------------------------|
| P1      | Datos / Backend  | ciudades.json, ciudad.py, test_ciudades.py, test_schema.py   |
| P2      | Mapas / Clima    | map.js, weather.js, risk.js                                   |
| P3      | UX / UI          | index.html, style.css, responsive.css                         |
| P4      | Donaciones       | donations.js                                                  |
| P5      | Frontend / Infra | main.js, offline.js, alerts.js, reports.js, README.md         |
