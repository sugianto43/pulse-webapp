"""FastAPI app entrypoint — wraps Pulse-CLI core analysis logic."""

import asyncio
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.starlette import StarletteIntegration

from app.rate_limit import RateLimitExceeded, SlowAPIMiddleware, _rate_limit_exceeded_handler, limiter
from app.routers import analyze, broker, plan, sapta, screen
from app.settings import CORS_ORIGINS, SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE, THREAD_POOL_WORKERS

sentry_sdk.init(
    dsn=SENTRY_DSN,
    traces_sample_rate=SENTRY_TRACES_SAMPLE_RATE,
    integrations=[StarletteIntegration(), FastApiIntegration()],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.get_running_loop().set_default_executor(
        ThreadPoolExecutor(max_workers=THREAD_POOL_WORKERS)
    )
    yield


app = FastAPI(title="Radar Saham API", version="0.1.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# SlowAPIMiddleware added before CORSMiddleware so CORS ends up outermost —
# otherwise 429 rate-limit responses would skip CORS headers and the browser
# would block them as opaque errors instead of surfacing the real status.
app.add_middleware(SlowAPIMiddleware)

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
