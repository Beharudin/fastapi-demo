from pydantic import BaseModel

# class Product:
class Product(BaseModel):
    id: int
    name: str
    price: float
    description: str
    quantity: int
    
    
# This is when we dont use pydantic models and we just create a class constructor to represent our products
    # def __init__(self, id: int, name: str, price: float, description: str, quantity: int):
    #     self.id = id
    #     self.name = name
    #     self.price = price
    #     self.description = description
    #     self.quantity = quantity