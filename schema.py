from pydantic import BaseModel
from uuid import UUID

# class Product:
class CreateProduct(BaseModel):
    name: str
    price: float
    description: str
    quantity: int
    
class ProductResponse(BaseModel):
    id: UUID
    name: str
    price: float
    description: str
    quantity: int
    
    class Config:
        from_attributes = True