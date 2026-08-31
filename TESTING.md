# TESTING.md — Guia de pruebas TuriSafe

## Como ejecutar los tests

```bash
# 1. Instalar dependencias
pip install -r requirements.txt

# 2. Ejecutar todos los tests
pytest tests/

# 3. Ejecutar con salida detallada
pytest tests/ -v

# 4. Ejecutar un archivo especifico
pytest tests/test_ciudades.py -v
pytest tests/test_schema.py -v
```

## Descripcion de cada test

### `tests/test_ciudades.py` — Tests de integridad del dataset

| Test | Que verifica |
|------|-------------|
| `test_json_carga` | El archivo `data/ciudades.json` existe y se puede parsear sin errores |
| `test_hay_cuatro_ciudades` | El array `ciudades` contiene exactamente 4 ciudades |
| `test_ids_unicos` | Cada ciudad tiene un campo `id` unico (sin duplicados) |
| `test_coordenadas_validas` | `lat` esta en [-90, 90] y `lon` en [-180, 180] para todas las ciudades |
| `test_telefonos_presentes` | Los campos `telefono_emergencias`, `policia` y `bomberos` son cadenas no vacias |
| `test_doce_meses` | El objeto `meses` de cada ciudad tiene exactamente 12 claves (enero-diciembre) |
| `test_estructura_mensual` | Cada mes contiene los campos `riesgos`, `recomendaciones` y `kit` como listas |

### `tests/test_schema.py` — Tests del modelo Pydantic

| Test | Que verifica |
|------|-------------|
| `test_pydantic_valida_ciudad_correcta` | Un diccionario valido es aceptado por `Ciudad` sin lanzar excepcion |
| `test_pydantic_rechaza_lat_invalida` | Un valor de latitud fuera de rango provoca `ValidationError` |
| `test_estados_permitidos` | `MesInfo` solo acepta los campos definidos (`riesgos`, `recomendaciones`, `kit`) |

## Salida esperada

Al ejecutar `pytest tests/ -v` con el dataset completo (4 ciudades) todos los tests deben pasar:

```
tests/test_ciudades.py::test_json_carga                    PASSED
tests/test_ciudades.py::test_hay_cuatro_ciudades           PASSED
tests/test_ciudades.py::test_ids_unicos                    PASSED
tests/test_ciudades.py::test_coordenadas_validas           PASSED
tests/test_ciudades.py::test_telefonos_presentes           PASSED
tests/test_ciudades.py::test_doce_meses                    PASSED
tests/test_ciudades.py::test_estructura_mensual            PASSED
tests/test_schema.py::test_pydantic_valida_ciudad_correcta PASSED
tests/test_schema.py::test_pydantic_rechaza_lat_invalida   PASSED
tests/test_schema.py::test_estados_permitidos              PASSED

========== 10 passed in X.XXs ==========
```

## Notas

- Los tests de `test_ciudades.py` asumen 4 ciudades en el dataset. Actualmente el JSON tiene 1 ciudad placeholder (Madrid). P1 debe completar las 4 ciudades antes de que `test_hay_cuatro_ciudades` pase.
- Los tests stub tienen cuerpo `pass`. P1 debe implementar las aserciones segun los criterios de la tabla.
- No se requiere conexion a internet para ninguna prueba.
