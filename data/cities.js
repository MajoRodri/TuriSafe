export const cities = {

  madrid: {
    id: "madrid",
    name: "Madrid",
    country: "España",
    coords: [40.4168, -3.7038],
    image: "assets/images/madrid.jpg",
    summary: "Capital de España con siglos de historia, arte y gastronomía mediterránea. Veranos calurosos e inviernos fríos con riesgo de olas de calor en julio y agosto.",
    description: "Madrid es una de las ciudades más vibrantes de Europa, con una oferta cultural inigualable entre el Prado, el Reina Sofía y el Thyssen. Su clima continental genera veranos muy calurosos (hasta 40 °C) e inviernos fríos y secos. El viajero preparado consulta las alertas de calor extremo en verano y lleva siempre agua suficiente.",
    riskLevel: "NORMAL",
    contacts: { emergency: "112", police: "091", fire: "080" },
    kit: [
      "Protector solar FPS 50+ (verano obligatorio)",
      "Botella de agua reutilizable (mín. 1 litro)",
      "Mapa offline de la ciudad",
      "Seguro de viaje activo",
      "Adaptador eléctrico tipo F (ya estándar en España)",
      "Documentación en copia digital",
      "Calzado cómodo para largas caminatas"
    ]
  },

  newyork: {
    id: "newyork",
    name: "Nueva York",
    country: "Estados Unidos",
    coords: [40.7128, -74.0060],
    image: "assets/images/newyork.jpg",
    summary: "La ciudad que nunca duerme exige preparación: calor húmedo en verano, nevadas en invierno y emergencias sanitarias con costos médicos muy elevados.",
    description: "Nueva York es una megalópolis de contrastes extremos. El clima varía radicalmente entre estaciones: veranos húmedos y sofocantes, otoños suaves e inviernos con nevadas frecuentes. El sistema de salud privado hace que un seguro médico internacional sea absolutamente imprescindible. Conocer las rutas del metro y los servicios de emergencia acelera cualquier respuesta ante imprevistos.",
    riskLevel: "PRECAUCION",
    contacts: { emergency: "911", police: "911", fire: "911" },
    kit: [
      "Seguro médico internacional (imprescindible)",
      "Ropa en capas para cambios bruscos de temperatura",
      "Paraguas compacto",
      "MetroCard o tarjeta de crédito sin comisión",
      "Adaptador eléctrico tipo A/B",
      "Copia digital de pasaporte y visado",
      "Cargador portátil (powerbank)"
    ]
  },

  sydney: {
    id: "sydney",
    name: "Sídney",
    country: "Australia",
    coords: [-33.8688, 151.2093],
    image: "assets/images/sydney.jpg",
    summary: "Ciudad costera vibrante con playas icónicas y fauna salvaje única. El riesgo de incendios forestales en temporada seca (oct–mar) requiere seguimiento activo de alertas.",
    description: "Sídney combina una metrópolis moderna con naturaleza salvaje a pocos kilómetros del centro. La temporada de incendios forestales (octubre a marzo) puede afectar la calidad del aire y las rutas de acceso a parques nacionales. La fauna australiana (serpientes, arañas, medusas) requiere precaución básica. El sol es extremadamente intenso durante todo el año.",
    riskLevel: "PRECAUCION",
    contacts: { emergency: "000", police: "000", fire: "000" },
    kit: [
      "Protector solar FPS 50+ (uso diario obligatorio)",
      "Repelente de insectos con DEET",
      "Calzado cerrado para senderismo",
      "Kit básico de primeros auxilios",
      "App de alertas de incendios forestales (Hazards Near Me)",
      "Botella de agua con filtro",
      "Adaptador eléctrico tipo I"
    ]
  },

  tokyo: {
    id: "tokyo",
    name: "Tokio",
    country: "Japón",
    coords: [35.6762, 139.6503],
    image: "assets/images/tokyo.jpg",
    summary: "Megaciudad impecablemente organizada ubicada en una de las zonas sísmicas más activas del mundo. Conocer los protocolos de evacuación es esencial antes de llegar.",
    description: "Tokio es la ciudad más poblada del mundo y también una de las más preparadas ante desastres naturales. Los terremotos son frecuentes; la ciudad cuenta con sistemas de alerta temprana y estructuras antisísmicas avanzadas. Los tifones afectan la región en otoño. A pesar de su alta actividad sísmica, la organización ciudadana y la infraestructura de emergencias hacen de Tokio una ciudad muy segura para el viajero informado.",
    riskLevel: "ALERTA",
    contacts: { emergency: "119", police: "110", fire: "119" },
    kit: [
      "App de alertas sísmicas (YureKuru o NHK World)",
      "Guía de puntos de evacuación del distrito",
      "Botella de agua y snacks de emergencia (mín. 3 días)",
      "Linterna y batería externa cargada",
      "Tarjeta IC (Suica/Pasmo) para transporte",
      "Adaptador eléctrico tipo A",
      "Copia impresa del pasaporte y contactos de emergencia"
    ]
  }

};
