from database import Base
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String)
    price = Column(Float)
    description = Column(String)
    quantity = Column(Integer)
    