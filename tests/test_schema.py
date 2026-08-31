import sys
import pathlib

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from models.ciudad import Ciudad, MesInfo

_VALID_CIUDAD = {
    "id": "test",
    "nombre": "TestCity",
    "lat": 40.0,
    "lon": -3.5,
    "telefono_emergencias": "112",
    "policia": "091",
    "bomberos": "080",
    "meses": {
        mes: {"riesgos": [], "recomendaciones": [], "kit": []}
        for mes in [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ]
    }
}


def test_pydantic_valida_ciudad_correcta():
    pass  # TODO: Ciudad(**_VALID_CIUDAD) should not raise


def test_pydantic_rechaza_lat_invalida():
    pass  # TODO: pass lat=999, expect ValidationError


def test_estados_permitidos():
    pass  # TODO: verify MesInfo only accepts list fields (no extra status field validation needed here)
