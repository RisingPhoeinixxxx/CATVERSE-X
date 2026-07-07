from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str
    guardian: str
    level: int