import pathlib
import sys

import pytest
from pydantic import ValidationError

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
    """Comprueba que una ciudad con estructura válida es aceptada."""
    ciudad = Ciudad(**_VALID_CIUDAD)

    assert ciudad.id == "test"
    assert ciudad.nombre == "TestCity"
    assert ciudad.lat == 40.0
    assert ciudad.lon == -3.5
    assert len(ciudad.meses) == 12


def test_pydantic_rechaza_lat_invalida():
    """Comprueba que Pydantic rechaza una latitud fuera del rango válido."""
    ciudad_invalida = _VALID_CIUDAD.copy()
    ciudad_invalida["lat"] = 999

    with pytest.raises(ValidationError):
        Ciudad(**ciudad_invalida)


def test_estados_permitidos():
    """Comprueba que MesInfo no acepta campos adicionales."""
    with pytest.raises(ValidationError):
        MesInfo(
            riesgos=[],
            recomendaciones=[],
            kit=[],
            estado="ALERTA"
        )