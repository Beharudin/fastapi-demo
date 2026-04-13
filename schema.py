from pydantic import BaseModel

# class Product:
class CreateProduct(BaseModel):
    name: str
    price: float
    description: str
    quantity: int
    
class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    quantity: int
    
    class Config:
        from_attributes = True