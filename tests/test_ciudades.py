import json
import pathlib
import sys

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
    pass  # TODO: assert CIUDADES is a non-empty list


def test_hay_cuatro_ciudades():
    pass  # TODO: assert len(CIUDADES) == 4


def test_ids_unicos():
    pass  # TODO: collect ids, assert len(set(ids)) == len(CIUDADES)


def test_coordenadas_validas():
    pass  # TODO: assert each ciudad has -90 <= lat <= 90 and -180 <= lon <= 180


def test_telefonos_presentes():
    pass  # TODO: assert telefono_emergencias, policia, bomberos are non-empty strings


def test_doce_meses():
    pass  # TODO: assert each ciudad.meses has exactly 12 keys matching MESES


def test_estructura_mensual():
    pass  # TODO: for each mes, assert riesgos/recomendaciones/kit are lists
