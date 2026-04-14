from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
import models
from uuid import UUID
from fastapi.middleware.cors import CORSMiddleware
from schema import CreateProduct, SingleProductResponse, ProductListResponse

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail, "status": "error", "data": None},
    )

@app.get('/')
def greet():
    return "Hello, World!"


products= [
    models.Product(name='Laptop', price=999.99, description='A high-performance laptop', quantity=10),
    models.Product(name='Smartphone', price=499.99, description='A latest model smartphone', quantity=20),
    models.Product(name='Headphones', price=199.99, description='Noise-cancelling headphones', quantity=15),
    models.Product(name='Tablet', price=299.99, description='A lightweight tablet', quantity=25)
]

# Initialize the database with the products
def init_db():
    db = SessionLocal()
    count = db.query(models.Product).count()
    if count == 0:
        for product in products:
            db.add(product)

    db.commit()


init_db()


def format_response(message: str, data=None, status_text: str = "success"):
    return {"message": message, "status": status_text, "data": data}

@app.get('/products', response_model=ProductListResponse)
def get_all_products(db: Session=Depends(get_db)):
    products = db.query(models.Product).all()
    message = "No products available" if not products else "Products retrieved successfully"
    return format_response(message=message, data=products)

@app.get("/products/{id}", response_model=SingleProductResponse)
def get_product_by_id(id: UUID, db: Session=Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return format_response(message="Product retrieved successfully", data=product)

@app.post('/products', response_model=SingleProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product: CreateProduct, db: Session=Depends(get_db)):
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return format_response(
        message="Product created successfully",
        data=new_product,
    )

@app.put('/products/{id}', response_model=SingleProductResponse)
def update_product(id: UUID, updated_product: CreateProduct, db: Session=Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for key, value in updated_product.model_dump().items():
        setattr(product, key, value)
    db.commit()
    return format_response(
        message="Product updated successfully",
        data=product,
    )


@app.delete('/products/{id}', response_model=SingleProductResponse, status_code=status.HTTP_200_OK)
def delete_product(id: UUID, db: Session=Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(product)
    db.commit()
    return format_response(
        message="Product deleted successfully",
        data=product,
    )

