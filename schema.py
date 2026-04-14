from pydantic import BaseModel
from uuid import UUID
from typing import List, Generic, TypeVar

# -----------------------------
# Request Schema
# -----------------------------
class CreateProduct(BaseModel):
    name: str
    price: float
    description: str
    quantity: int


# -----------------------------
# Generic Base Response
# -----------------------------
T = TypeVar("T")

class BaseResponse(BaseModel, Generic[T]):
    message: str
    status: str
    data: T


# -----------------------------
# Product Response Schema
# -----------------------------
class ProductResponse(BaseModel):
    id: UUID
    name: str
    price: float
    description: str
    quantity: int

    class Config:
        from_attributes = True


# -----------------------------
# Final Typed Responses
# -----------------------------
class SingleProductResponse(BaseResponse[ProductResponse]):
    pass


class ProductListResponse(BaseResponse[List[ProductResponse]]):
    pass