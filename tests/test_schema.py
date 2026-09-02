import pathlib
import sys

import pytest
from pydantic import ValidationError

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

from models.ciudad import City, MonthInfo


_VALID_CITY = {
    "id": "test",
    "nombre": "TestCity",
    "lat": 40.0,
    "lon": -3.5,
    "telefono_emergencias": "112",
    "policia": "091",
    "bomberos": "080",
    "meses": {
        month: {"riesgos": [], "recomendaciones": [], "kit": []}
        for month in [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ]
    }
}


def test_pydantic_valid_city():
    """Checks that a city with a valid structure is accepted."""
    city = City(**_VALID_CITY)

    assert city.id == "test"
    assert city.nombre == "TestCity"
    assert city.lat == 40.0
    assert city.lon == -3.5
    assert len(city.meses) == 12


def test_pydantic_rejects_invalid_latitude():
    """Checks that Pydantic rejects a latitude outside the valid range."""
    invalid_city = _VALID_CITY.copy()
    invalid_city["lat"] = 999

    with pytest.raises(ValidationError):
        City(**invalid_city)


def test_allowed_fields():
    """Checks that MonthInfo rejects additional fields."""
    with pytest.raises(ValidationError):
        MonthInfo(
            riesgos=[],
            recomendaciones=[],
            kit=[],
            estado="ALERTA"
        )