from pydantic import BaseModel
from typing import Dict, List


class MesInfo(BaseModel):
    riesgos: List[str]
    recomendaciones: List[str]
    kit: List[str]


class Ciudad(BaseModel):
    id: str
    nombre: str
    lat: float
    lon: float
    telefono_emergencias: str
    policia: str
    bomberos: str
    meses: Dict[str, MesInfo]
