from fastapi import FastAPI
from models import Product

app = FastAPI()

@app.get('/')
def greet():
    return "Hello, World!"


# This is when we dont use pydantic models and we just use a list of dictionaries to represent our products
# products = [
#     Product(1, 'Laptop', 999.99, 'A high-performance laptop', 10),
#     Product(2, 'Smartphone', 499.99, 'A latest model smartphone', 20),
#     Product(3, 'Headphones', 199.99, 'Noise-cancelling headphones', 15)
# ]

products= [
    Product(id=1, name='Laptop', price=999.99, description='A high-performance laptop', quantity=10),
    Product(id=2, name='Smartphone', price=499.99, description='A latest model smartphone', quantity=20),
    Product(id=3, name='Headphones', price=199.99, description='Noise-cancelling headphones', quantity=15),
    Product(id=4, name='Tablet', price=299.99, description='A lightweight tablet', quantity=25)
]

@app.get('/products')
def getAllProducts():
    return products

@app.get("/product/{id}")
def getProductById(id: int):
    for product in products:
        if product.id==id:
            return product
    return {"message": "Product not found", "status": 404}


@app.post('/product')
def createProduct(product: Product):
    products.append(product)
    return {"message": "Product created successfully", "status": 201}

@app.put('/product/{id}')
def updateProduct(id: int, updated_product: Product):
    for index, product in enumerate(products):
        if product.iud==id:
            products[index]=updated_product
            return {"message": "Product updated successfully", "status": 200}
    return {"message": "Product not found", "status": 404}


@app.delete('/product/{id}')
def deleteProduct(id: int):
    for index, product in enumerate(products):
        if product.id==id:
            del products[index]
            return {"message": "Product deleted successfully", "status": 200}
    return {"message": "Product not found", "status": 404}

