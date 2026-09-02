import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent.parent))

DATA_PATH = pathlib.Path(__file__).parent.parent / "data" / "ciudades.json"

with DATA_PATH.open(encoding="utf-8") as f:
    _RAW = json.load(f)

CITIES = _RAW["ciudades"]

MONTHS = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
]


def test_json_load():
    """Checks that the JSON is loaded and contains cities."""
    assert DATA_PATH.exists()
    assert isinstance(_RAW, dict)
    assert "ciudades" in _RAW
    assert isinstance(CITIES, list)
    assert CITIES


def test_has_four_cities():
    """Checks that exactly the four MVP cities exist."""
    assert len(CITIES) == 4


def test_unique_ids():
    """Checks that there are no cities with duplicate IDs."""
    ids = [city["id"] for city in CITIES]
    assert len(set(ids)) == len(CITIES)


def test_valid_coordinates():
    """Checks that coordinates are within valid ranges."""
    for city in CITIES:
        assert -90 <= city["lat"] <= 90
        assert -180 <= city["lon"] <= 180


def test_emergency_phones_present():
    """Checks that the three emergency phone numbers are present and not empty."""
    for city in CITIES:
        assert isinstance(city["telefono_emergencias"], str)
        assert city["telefono_emergencias"].strip()

        assert isinstance(city["policia"], str)
        assert city["policia"].strip()

        assert isinstance(city["bomberos"], str)
        assert city["bomberos"].strip()


def test_twelve_months():
    """Checks that each city contains exactly January through December."""
    for city in CITIES:
        assert len(city["meses"]) == 12
        assert set(city["meses"].keys()) == set(MONTHS)


def test_monthly_structure():
    """Checks the structure of every month for every city."""
    for city in CITIES:
        for month in MONTHS:
            information = city["meses"][month]

            assert "riesgos" in information
            assert "recomendaciones" in information
            assert "kit" in information

            assert isinstance(information["riesgos"], list)
            assert isinstance(information["recomendaciones"], list)
            assert isinstance(information["kit"], list)
