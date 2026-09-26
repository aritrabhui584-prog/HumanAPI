import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not configured. Add it to the environment or .env file."
    )

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        print("PostgreSQL connection successful!")
except Exception as e:
    print("PostgreSQL connection failed!")
    print(e)