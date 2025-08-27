from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
from io import BytesIO
import logging
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
from fastapi.requests import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import RequestValidationError as FastAPIRequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cube-backend")

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Gemini Vision and Pro integration (fixed for latest SDK)
import google.generativeai as genai
import json

def get_gemini_vision_model():
    return genai.GenerativeModel("gemini-pro-vision")

def get_gemini_text_model():
    return genai.GenerativeModel("gemini-pro")

# Helper: Extract 9 colors from a face image using Gemini Vision
async def extract_colors_from_image(image_bytes):
    from PIL import Image
    img = Image.open(BytesIO(image_bytes))
    img = img.convert('RGB')
    prompt = (
        "Analyze this Rubik's cube face image. Return ONLY a JSON array of 9 colors representing the face from top-left to bottom-right "
        "(e.g., ['white', 'red', 'blue', ...]). Use ONLY these color names: white, yellow, red, orange, blue, green."
    )
    model = genai.GenerativeModel("gemini-pro-vision")
    response = model.generate_content([prompt, img])
    response.resolve()
    try:
        colors = json.loads(response.text)
        if not isinstance(colors, list) or len(colors) != 9:
            raise ValueError("Invalid response format - expected array of 9 colors")
        return colors
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI color extraction failed: {str(e)} | Raw: {response.text}")

# Helper: Generate solution steps using Gemini Pro
async def get_solution_steps(faces):
    cube_state = json.dumps(faces, indent=2)
    prompt = f"""You are a Rubik's cube solving expert. Given a cube state, provide a step-by-step solution using standard notation (R, U, L, D, F, B, with ' for counterclockwise and 2 for double turns).\n\nHere's a Rubik's cube state represented as a dictionary of faces:\n{cube_state}\n\nProvide a solution in this JSON format:\n[{{'move': 'R', 'description': 'Turn right face clockwise', 'reason': 'Setting up white cross', 'targetPieces': ['white edge', 'red-white edge']}}]"""
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    response.resolve()
    try:
        steps = json.loads(response.text)
        return steps
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI solution generation failed: {str(e)} | Raw: {response.text}")

@app.post("/api/analyze-cube")
async def analyze_cube(
    U: UploadFile = File(...),
    R: UploadFile = File(...),
    F: UploadFile = File(...),
    D: UploadFile = File(...),
    L: UploadFile = File(...),
    B: UploadFile = File(...)
):
    faces = {'U': U, 'R': R, 'F': F, 'D': D, 'L': L, 'B': B}
    face_colors = {}
    for face, file in faces.items():
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail=f"No data for face {face}")
        try:
            img = Image.open(BytesIO(content))
            img.verify()
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid image for face {face}")
        # AI color extraction
        face_colors[face] = await extract_colors_from_image(content)
    # AI solution
    solution = await get_solution_steps(face_colors)
    return {"status": "ok", "faces": face_colors, "steps": solution}

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    import traceback
    tb = traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}", "traceback": tb}
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(FastAPIRequestValidationError)
async def validation_exception_handler(request: Request, exc: FastAPIRequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )
