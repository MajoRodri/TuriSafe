import json
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from models.ciudad import Ciudad

DATA_PATH = pathlib.Path(__file__).parent.parent / "data" / "ciudades.json"

with DATA_PATH.open(encoding="utf-8") as f:
    _RAW = json.load(f)

CIUDADES = _RAW["ciudades"]

MESES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]


def test_json_carga():
    """Comprueba que el JSON se ha cargado y contiene ciudades."""
    assert DATA_PATH.exists()
    assert isinstance(_RAW, dict)
    assert "ciudades" in _RAW
    assert isinstance(CIUDADES, list)
    assert CIUDADES


def test_hay_cuatro_ciudades():
    """Comprueba que existen exactamente las cuatro ciudades del MVP."""
    assert len(CIUDADES) == 4


def test_ids_unicos():
    """Comprueba que no existen ciudades con el mismo ID."""
    ids = [ciudad["id"] for ciudad in CIUDADES]
    assert len(set(ids)) == len(CIUDADES)


def test_coordenadas_validas():
    """Comprueba que las coordenadas están dentro de los rangos válidos."""
    for ciudad in CIUDADES:
        assert -90 <= ciudad["lat"] <= 90
        assert -180 <= ciudad["lon"] <= 180


def test_telefonos_presentes():
    """Comprueba que los tres teléfonos están presentes y no están vacíos."""
    for ciudad in CIUDADES:
        assert isinstance(ciudad["telefono_emergencias"], str)
        assert ciudad["telefono_emergencias"].strip()

        assert isinstance(ciudad["policia"], str)
        assert ciudad["policia"].strip()

        assert isinstance(ciudad["bomberos"], str)
        assert ciudad["bomberos"].strip()


def test_doce_meses():
    """Comprueba que cada ciudad contiene exactamente enero-diciembre."""
    for ciudad in CIUDADES:
        assert len(ciudad["meses"]) == 12
        assert set(ciudad["meses"].keys()) == set(MESES)


def test_estructura_mensual():
    """Comprueba la estructura de cada mes de cada ciudad."""
    for ciudad in CIUDADES:
        for mes in MESES:
            informacion = ciudad["meses"][mes]

            assert "riesgos" in informacion
            assert "recomendaciones" in informacion
            assert "kit" in informacion

            assert isinstance(informacion["riesgos"], list)
            assert isinstance(informacion["recomendaciones"], list)
            assert isinstance(informacion["kit"], list)
