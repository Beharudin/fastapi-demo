
# FastAPI Demo - Products API

A simple FastAPI application demonstrating GET and POST endpoints for product management and inventory tracking.

## Features

- **GET /**: Welcome endpoint
- **GET /products/**: Get all products
- **GET /products/{product_id}**: Get a specific product by ID
- **POST /products/**: Create a new product
- **PUT /products/{id}**: Update a product
- **DELETE /products/{id}**: Delete a product

## Setup

1. **Create and activate virtual environment:**
   ```bash
   python -m venv myenv
   myenv\Scripts\activate.ps1  # Windows PowerShell
   ```

2. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy python-dotenv
   ```

3. **Run the application:**
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Project Structure

```
fastapi-demo/
├── main.py          # FastAPI application with endpoints
├── models.py        # SQLAlchemy models
├── schema.py        # Pydantic schemas
├── database.py      # DB connection & session
├── frontend/
│   ├── src/
│   │   ├── App.js          # React app with product management
│   │   ├── components/ui/  # Shadcn UI components
│   │   └── lib/utils.js    # Utility functions
│   ├── public/
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── .gitignore       # Git ignore file
└── README.md        # This file
```

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

4. **Access the frontend:**
   - Frontend: http://localhost:3000

## API Usage Examples

### Get all products
```bash
curl http://localhost:8000/products/
```

### Get product by ID
```bash
curl http://localhost:8000/products/1
```

### Create a new product
```bash
curl -X POST "http://localhost:8000/products/" \
     -H "Content-Type: application/json" \
     -d '{
       "id": 5,
       "name": "Monitor",
       "description": "4K monitor",
       "price": 299.99,
       "quantity": 15
     }'
```

### Update product
```bash
curl -X PUT "http://localhost:8000/products/{id}" \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Monitor",
  "description": "Updated",
  "price": 399.99,
  "quantity": 10
}'
```

### Delete product
```bash
curl -X DELETE http://localhost:8000/products/{id}
```


## Models

### Product
- `id`: UUID
- `name`: string
- `description`: string
- `price`: float
- `quantity`: integer


### Tech Stack
- `FastAPI`
- `SQLAlchemy`
- `Pydantic`
- `Uvicorn`
- `React (frontend)`
- `TailwindCSS`

## Built With

- [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework for building APIs
- [Pydantic](https://pydantic-docs.helpmanual.io/) - Data validation using Python type hints
- [Uvicorn](https://www.uvicorn.org/) - ASGI server implementation