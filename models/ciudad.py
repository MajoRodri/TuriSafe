from typing import Dict, List

from pydantic import BaseModel, ConfigDict, Field


class MesInfo(BaseModel):
    model_config = ConfigDict(extra="forbid")

    riesgos: List[str]
    recomendaciones: List[str]
    kit: List[str]


class Ciudad(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    nombre: str
    lat: float = Field(ge=-90, le=90)
    lon: float = Field(ge=-180, le=180)
    telefono_emergencias: str
    policia: str
    bomberos: str
    meses: Dict[str, MesInfo]
