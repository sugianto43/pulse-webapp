"""FastAPI app entrypoint — wraps Pulse-CLI core analysis logic."""

import asyncio
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import analyze, broker, plan, sapta, screen
from app.settings import CORS_ORIGINS, THREAD_POOL_WORKERS


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.get_running_loop().set_default_executor(
        ThreadPoolExecutor(max_workers=THREAD_POOL_WORKERS)
    )
    yield


app = FastAPI(title="Pulse Web API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(broker.router)
app.include_router(plan.router)
app.include_router(sapta.router)
app.include_router(screen.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
