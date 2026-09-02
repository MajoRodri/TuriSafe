
<div align="center">

<img src="assets/images/logo.png" alt="TuriSafe logo" width="80"/>

# TuriSafe

### Viaja preparado. La información salva vidas.

TuriSafe es una aplicación web que ayuda a los viajeros a conocer el estado climático y los riesgos de su destino antes y durante el viaje. Combina datos meteorológicos en tiempo real, recomendaciones personalizadas por mes y un sistema de coordinación ciudadana en caso de emergencia.

</div>

---

## ¿Qué hace TuriSafe?

Cuando planeas un viaje, TuriSafe te muestra en un solo lugar todo lo que necesitas saber sobre tu destino:

- 🗺️ **Mapa interactivo** con los destinos disponibles y acceso rápido a cada perfil de ciudad
- 🌤️ **Clima en tiempo real** : Temperatura, precipitación, viento y humedad actualizados al momento
- 📅 **Predicción a 3 días** con nivel de riesgo estimado para cada día
- 🎒 **Kit del viajero** personalizado según el destino y el mes en que viajes
- 📞 **Contactos de emergencia** de cada ciudad (emergencias, policía y bomberos)
- 📋 **Reportes de incidencias** enviados por otros usuarios (carreteras cortadas, inundaciones, etc.)
- ❤️ **Coordinación de donaciones** que se activa automáticamente cuando hay una alerta grave

<details>
<summary><strong>Ver más detalle de cada funcionalidad</strong></summary>

<br/>

**Mapa y buscador**
El mapa usa la librería Leaflet con datos de OpenStreetMap. Cada ciudad tiene un marcador en el mapa y un panel lateral que muestra un resumen rápido. También hay un buscador en la página de inicio que filtra por nombre de ciudad y abre directamente su perfil.

**Clima y predicción**
El clima se obtiene en tiempo real desde Open-Meteo, una API meteorológica gratuita que no requiere registro. Se muestra el estado actual (temperatura, sensación térmica, viento, humedad y precipitación) y una predicción para los próximos 3 días con nivel de riesgo calculado para cada jornada.

**Kit del viajero**
Cada ciudad tiene un kit diferente para cada mes del año, almacenado en un archivo JSON local. El kit se adapta a la climatología típica de ese destino en esa época: por ejemplo, en Madrid en enero el kit incluye abrigo térmico y calzado impermeable; en verano, protector solar y ventilador portátil.

**Contactos de emergencia**
Cada ciudad tiene sus propios números: emergencias generales, policía y bomberos. En Madrid el 112, en Nueva York el 911, en Tokio el 119, en Sídney el 000. Son enlaces directos para llamar desde móvil con un solo toque.

**Reportes de incidencias**
Cualquier usuario puede reportar una incidencia: carretera cortada, fuente sin agua, inundación leve u otro. Los reportes se guardan en el navegador y se muestran en el perfil de la ciudad correspondiente.

**Donaciones en alerta**
Cuando el nivel de riesgo llega a ALERTA, aparece un formulario donde los usuarios pueden ofrecer ayuda: ropa, comida no perecedera, parafarmacia, alojamiento temporal o información sobre puntos de recogida. El formulario se envía por correo al equipo coordinador a través de Formspree.

**Simulación de alerta**
Desde el panel de ciudad en el mapa hay un botón para simular una alerta de terremoto. Esto permite probar el comportamiento de la aplicación (donaciones, banners de emergencia) sin necesidad de que haya un evento real.

</details>

---

## Destinos disponibles

Actualmente TuriSafe cubre 4 ciudades:

| Ciudad | País | Emergencias | Policía | Bomberos |
| :--- | :--- | :---: | :---: | :---: |
| Madrid | 🇪🇸 España | 112 | 092 | 112 |
| New York | 🇺🇸 Estados Unidos | 911 | 911 | 911 |
| Tokyo | 🇯🇵 Japón | 119 | 110 | 119 |
| Sidney | 🇦🇺 Australia | 000 | 131444 | 000 |

---

## Sistema de riesgo

El nivel de riesgo se calcula automáticamente a partir del viento y la precipitación del momento:

| Nivel | Condición |
| :--- | :--- |
| 🟢 **NORMAL** | Sin incidencias meteorológicas destacables |
| 🟡 **PRECAUCIÓN** | Viento ≥ 50 km/h o precipitación ≥ 20 mm |
| 🔴 **ALERTA** | Viento ≥ 80 km/h o precipitación ≥ 50 mm |

Cuando el nivel llega a **ALERTA**, la aplicación activa automáticamente el módulo de donaciones para coordinar ayuda ciudadana.

---

## Herramientas utilizadas

### Frontend

| Herramienta | Para qué se usa |
| :--- | :--- |
| **HTML5 + CSS3** | Estructura y estilos de la aplicación |
| **JavaScript (ES6 Modules)** | Toda la lógica de la app, sin ningún framework |
| **[Leaflet 1.9.4](https://leafletjs.com/)** | Mapa interactivo con marcadores de ciudad |

### APIs y servicios externos

| Servicio | Para qué se usa |
| :--- | :--- |
| **[Open-Meteo](https://open-meteo.com/)** | Datos meteorológicos en tiempo real y predicción a 3 días. Gratuito, sin registro |
| **[Formspree](https://formspree.io/)** | Envío de formularios de donación por correo. Sin servidor propio |
| **[OpenStreetMap](https://www.openstreetmap.org/)** | Tiles del mapa (usado a través de Leaflet) |

### Almacenamiento de datos

| Mecanismo | Qué almacena |
| :--- | :--- |
| **Archivo JSON local** (`data/ciudades.json`) | Datos estáticos: ciudades, coordenadas, kit mensual, recomendaciones, contactos |
| **localStorage del navegador** | Reportes de incidencias enviados por el usuario |
| **sessionStorage del navegador** | Estado de simulación de alerta (se borra al cerrar la pestaña) |

<details>
<summary><strong>¿Por qué sin framework ni backend?</strong></summary>

<br/>

TuriSafe es una aplicación completamente estática: no tiene servidor propio ni base de datos. Esto significa que:

- Se puede alojar en cualquier servicio de hosting gratuito (GitHub Pages, Netlify, Vercel...)
- No hay coste de infraestructura
- No se almacena ningún dato personal en ningún servidor propio
- El único punto de entrada de datos externos es Open-Meteo (solo lectura) y Formspree (solo para donaciones)

La decisión de no usar un framework como React o Vue responde a priorizar un MVP inicial ligero y funcional. El equipo tiene planteadas mejoras futuras que escalarán la arquitectura según las necesidades del producto.

</details>

---

## Estructura del proyecto

```
TuriSafe/
├── index.html              ← Página principal (mapa + buscador)
├── pages/
│   └── city.html           ← Perfil completo de cada ciudad
├── css/
│   ├── style.css           ← Estilos globales
│   └── city.css            ← Estilos de la página de ciudad
├── js/
│   ├── main.js             ← Lógica principal (mapa, búsqueda, panel)
│   ├── city-page.js        ← Lógica del perfil de ciudad
│   ├── weather.js          ← Conexión con la API de clima
│   ├── risk.js             ← Cálculo del nivel de riesgo
│   ├── map.js              ← Configuración del mapa Leaflet
│   ├── reports.js          ← Sistema de reportes de incidencias
│   ├── donations.js        ← Lógica del módulo de donaciones
│   ├── alerts.js           ← Banners de alerta
│   └── offline.js          ← Guardado local de ciudades visitadas
├── data/
│   └── ciudades.json       ← Datos de ciudades, kits y recomendaciones
└── assets/
    ├── images/             ← Imágenes de ciudades y logo
    └── beach-footer.svg    ← Ilustración del footer
```

<details>
<summary><strong>¿Qué contiene ciudades.json?</strong></summary>

<br/>

Cada ciudad en `ciudades.json` tiene:

- **Datos básicos:** nombre, id, coordenadas (latitud y longitud), descripción
- **Teléfonos de emergencia:** emergencias, policía, bomberos
- **Datos mensuales (12 meses):** para cada mes del año se definen:
  - `riesgos` Lista de riesgos típicos de ese mes (ej: "Frío", "Lluvias intensas")
  - `recomendaciones` Consejos de seguridad y preparación
  - `kit` Lista de objetos que se recomienda llevar

Esta información es estática y fue elaborada manualmente por el equipo para cada combinación ciudad-mes.

</details>

---

## Cómo ejecutarlo en local

> ⚠️ El archivo `index.html` **no puede abrirse directamente con doble clic**. El navegador bloquea las peticiones de datos (clima, ciudades) por seguridad cuando el archivo se abre desde el sistema de archivos. Es necesario usar un servidor local.

**Opción 1 → VS Code con Live Server (recomendado):**
1. Instala la extensión **Live Server** en VS Code
2. Clic derecho sobre `index.html` → **Open with Live Server**
3. Se abrirá automáticamente en `http://127.0.0.1:5500`

**Opción 2 → Python:**
```bash
python -m http.server 8000
```
Luego abre `http://localhost:8000` en tu navegador.

---

## Equipo

<div align="center">

| [**Laura S.R**](https://github.com/LauraSilRu) | [**María Roldán**](https://github.com/Mary1922) | [**Mariajose Alvarez**](https://github.com/MajoRodri) | [**Maria Isabel durango**](https://github.com/MariaIsaDurango) | [**Jose Gregorio**](https://github.com/GregDev08) |
| :---: | :---: | :---: | :---: | :---: |
| Scrum Master | Product Owner | Developer | Developer | Developer |

<br/>

<img src="assets/beach-footer.svg" alt="Playa pixel art — TuriSafe" width="100%"/>

</div>
