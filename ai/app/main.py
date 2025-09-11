from app.application import create_application
from app.configs import get_settings


app = create_application()
settings = get_settings()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080, reload=False)
