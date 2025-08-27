import { useState, useRef } from "react";
import GlassCard from "../components/Glasscard";

const FACES = [
  { id: "U", name: "Up (White)", placeholder: "White center" },
  { id: "R", name: "Right (Red)", placeholder: "Red center" },
  { id: "F", name: "Front (Green)", placeholder: "Green center" },
  { id: "D", name: "Down (Yellow)", placeholder: "Yellow center" },
  { id: "L", name: "Left (Orange)", placeholder: "Orange center" },
  { id: "B", name: "Back (Blue)", placeholder: "Blue center" },
];

export default function Solve() {
  // State management
  const [uploadedFaces, setUploadedFaces] = useState({});
  const [solveSteps, setSolveSteps] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRefs = useRef(FACES.map(() => useRef()));

  // Handle individual face upload
  const handleFaceUpload = (faceId, file) => {
    if (!file) return;
    setUploadedFaces(prev => ({
      ...prev,
      [faceId]: { file, preview: URL.createObjectURL(file) }
    }));
  };

  // Handle cube analysis and solution
  const analyzeCube = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Check if all faces are uploaded
      if (Object.keys(uploadedFaces).length !== 6) {
        throw new Error("Please upload all 6 faces before analyzing");
      }

      // Check if all faces are present
      const requiredFaces = ['U', 'R', 'F', 'D', 'L', 'B'];
      const missingFaces = requiredFaces.filter(face => !uploadedFaces[face]);
      
      if (missingFaces.length > 0) {
        throw new Error(`Missing faces: ${missingFaces.join(', ')}`);
      }

      // Create form data with images
      const formData = new FormData();
      
      // Add each face image
      for (const face of requiredFaces) {
        const data = uploadedFaces[face];
        const file = data.file;
        
        // Ensure we have a valid file
        if (!file || !(file instanceof File)) {
          throw new Error(`Invalid file object for face ${face}`);
        }
        
        // Log original file details
        console.log(`Original file for face ${face}:`, {
          name: file.name,
          type: file.type,
          size: file.size
        });

        // Ensure the file is an image and has a valid type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File for face ${face} is not an image`);
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type.toLowerCase())) {
          throw new Error(`Invalid image type for face ${face}. Supported types: JPG, PNG, GIF, WebP`);
        }

        // Create a new file with a proper name to help with debugging
        const extension = file.type.split('/')[1].replace('jpeg', 'jpg');
        const renamedFile = new File([file], `${face}_face.${extension}`, {
          type: file.type
        });
        
        console.log(`Adding face ${face}:`, {
          name: renamedFile.name,
          type: renamedFile.type,
          size: renamedFile.size
        });
        
        // Add the file to the form data
        formData.append(face, renamedFile);
      }

      console.log('FormData created with faces:', Object.keys(uploadedFaces));

      // Send to backend API
      const response = await fetch("/api/analyze-cube", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Backend error:', responseData);
        throw new Error(responseData.detail || "Failed to analyze cube");
      }
      
      const solution = await response.json();
      setSolveSteps(solution.steps);
      setCurrentStep(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pt-28 pb-24">
      <h1 className="text-4xl font-extrabold mb-6">Upload Your Cube</h1>
      <p className="text-gray-700 mb-8">Upload images for U, R, F, D, L, B. We’ll analyze, validate and solve.</p>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <GlassCard title="Upload Faces" className="hover-force">
          <div className="grid gap-4">
            {FACES.map((face, i) => (
              <div key={face.id} className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFaceUpload(face.id, e.target.files[0])}
                  ref={fileInputRefs.current[i]}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRefs.current[i].current?.click()}
                  className="glass px-4 py-3 cursor-pointer grid grid-cols-[1fr,80px] gap-4 items-center"
                >
                  <div>
                    <strong className="block text-sm">{face.name}</strong>
                    <span className="text-sm text-gray-600">
                      {uploadedFaces[face.id] ? "✓ Uploaded" : face.placeholder}
                    </span>
                  </div>
                  {uploadedFaces[face.id]?.preview && (
                    <img 
                      src={uploadedFaces[face.id].preview} 
                      alt={`Face ${face.id}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            ))}
            <button 
              onClick={analyzeCube}
              disabled={isProcessing}
              className="glass px-4 py-3 hover-force disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Analyze Cube"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </GlassCard>

        {/* Solution Steps */}
        <GlassCard title="Solution Steps" className="hover-force">
          {solveSteps ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {solveSteps.length}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
                    className="glass px-3 py-1 text-sm hover-force disabled:opacity-50"
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setCurrentStep(p => Math.min(solveSteps.length - 1, p + 1))}
                    className="glass px-3 py-1 text-sm hover-force disabled:opacity-50"
                    disabled={currentStep === solveSteps.length - 1}
                  >
                    Next
                  </button>
                </div>
              </div>
              
              <div className="glass p-4">
                <div className="font-mono text-lg mb-2">{solveSteps[currentStep].move}</div>
                <p className="text-gray-700">{solveSteps[currentStep].reason}</p>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Target Pieces:</strong>
                <ul className="list-disc ml-5 mt-1">
                  {solveSteps[currentStep].targetPieces.map((piece, i) => (
                    <li key={i}>{piece}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-gray-700">
              <p className="mb-4">Upload all faces to get step-by-step solution with:</p>
              <ul className="list-disc ml-5 space-y-2">
                <li>Move notation and plain English instructions</li>
                <li>Visual explanation of each step's purpose</li>
                <li>Highlighting of pieces being affected</li>
              </ul>
            </div>
          )}
        </GlassCard>
      </div>

      {/* 3D Visualizer */}
      <GlassCard title="3D Visualizer" className="hover-force">
        <div className="h-[400px] relative">
          {solveSteps ? (
            <div className="absolute inset-0">
              {/* Three.js cube visualization will go here */}
              <div className="glass p-4 absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <strong>Current Move:</strong> {solveSteps[currentStep].move}
                  </div>
                  <div className="flex gap-2">
                    <button className="glass px-3 py-1 text-sm hover-force">Play</button>
                    <button className="glass px-3 py-1 text-sm hover-force">Reset</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              Upload cube faces to see 3D visualization
            </div>
          )}
        </div>
      </GlassCard>
    </section>
  );
}
