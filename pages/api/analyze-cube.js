import formidable from 'formidable';
import { createReadStream } from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Receiving cube face images...');
    
    // Ensure the temporary upload directory exists
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.resolve('./tmp');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created temporary upload directory at ${uploadDir}`);
    }

    // Parse the multipart form data with improved options
    const form = formidable({
      keepExtensions: true,
      multiples: true, // Changed to true to handle array of files
      maxFileSize: 5 * 1024 * 1024, // 5MB max file size
      allowEmptyFiles: false,
      uploadDir, // Use the ensured temporary directory
      filename: (_name, _ext, part) => {
        // Use the original filename if available
        return part.originalFilename || `upload_${Date.now()}`;
      }
    });
    
    // Parse form data with proper error handling
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Form parsing error:', err);
          reject(new Error(`Failed to parse form data: ${err.message}`));
        } else {
          // Debug log the parsed files
          console.log('Parsed form data:', {
            fields: Object.keys(fields),
            files: Object.keys(files),
            fileDetails: Object.entries(files).map(([key, file]) => ({
              key,
              filename: file.originalFilename,
              filepath: file.filepath,
              type: file.mimetype,
              size: file.size
            }))
          });
          resolve([fields, files]);
        }
      });
    });

    console.log('Received files:', Object.keys(files));
    
    // Required face names and validation
    const requiredFaces = ['U', 'R', 'F', 'D', 'L', 'B'];
    const missingFaces = requiredFaces.filter(face => !files[face]);
    
    if (missingFaces.length > 0) {
      console.error('Missing faces:', missingFaces);
      return res.status(400).json({
        error: 'Missing faces',
        details: `Missing faces: ${missingFaces.join(', ')}`
      });
    }

    // Create form data for backend request
    const backendFormData = new FormData();
    
    // Add files to form data with validation
    for (const face of requiredFaces) {
      const file = files[face];
      
      // Handle potential array of files from formidable
      const fileData = Array.isArray(file) ? file[0] : file;
      
      if (!fileData) {
        throw new Error(`Missing file for face ${face}`);
      }

      console.log(`File details for face ${face}:`, {
        originalFilename: fileData.originalFilename,
        filepath: fileData.filepath,
        mimetype: fileData.mimetype,
        size: fileData.size
      });

      // Get file type from various possible sources
      let fileType = fileData.mimetype;
      
      if (!fileType && fileData.originalFilename) {
        // Try to detect from file extension
        const ext = fileData.originalFilename.split('.').pop()?.toLowerCase();
        const mimeTypes = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'gif': 'image/gif',
          'webp': 'image/webp'
        };
        fileType = mimeTypes[ext];
        
        if (fileType) {
          console.log(`Detected MIME type from extension for face ${face}:`, { ext, fileType });
        }
      }
      
      // If still no file type, try reading the first few bytes to detect image type
      if (!fileType && fileData.filepath) {
        try {
          const fs = require('fs');
          const buffer = fs.readFileSync(fileData.filepath, { length: 12 });
          
          // Magic numbers for common image formats
          if (buffer[0] === 0xFF && buffer[1] === 0xD8) fileType = 'image/jpeg';
          else if (buffer[0] === 0x89 && buffer[1] === 0x50) fileType = 'image/png';
          else if (buffer[0] === 0x47 && buffer[1] === 0x49) fileType = 'image/gif';
          
          if (fileType) {
            console.log(`Detected MIME type from file content for face ${face}:`, { fileType });
          }
        } catch (error) {
          console.error(`Failed to read file content for type detection:`, error);
        }
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!fileType || !validTypes.includes(fileType.toLowerCase())) {
        console.error(`Invalid file type for face ${face}:`, { fileType, validTypes });
        throw new Error(`Invalid file type for face ${face}. Got: ${fileType || 'unknown'}. Supported types: JPG, PNG, GIF, WebP`);
      }

      console.log(`Processing file for face ${face}:`, {
        name: file.originalFilename,
        type: fileType,
        size: file.size
      });

      // Always use fileData.filepath and guard against undefined
      if (!fileData.filepath) {
        throw new Error(`File for face ${face} does not have a valid filepath. Cannot create read stream.`);
      }

      try {
        const stream = createReadStream(fileData.filepath);
        backendFormData.append(face, stream, {
          filename: fileData.originalFilename,
          contentType: fileType,
        });
      } catch (error) {
        console.error(`Error processing file for face ${face}:`, error);
        throw new Error(`Failed to process file for face ${face}: ${error.message}`);
      }

      // Enhanced fallback for undefined filepath
      if (!fileData.filepath) {
        console.error(`Filepath is undefined for face ${face}. Attempting to handle in-memory buffer.`);

        // Check if formidable provides a buffer
        const buffer = fileData._writeStream?.buffer || fileData.toJSON?.().buffer;
        if (!buffer) {
          throw new Error(`Failed to process file for face ${face}: No valid filepath or buffer available.`);
        }

        // Save the buffer to a temporary file
        const tempFilePath = path.join(uploadDir, `${face}_temp_${Date.now()}.png`);
        try {
          fs.writeFileSync(tempFilePath, buffer);
          fileData.filepath = tempFilePath;
          console.log(`Saved in-memory buffer to temporary file: ${tempFilePath}`);
        } catch (error) {
          console.error(`Failed to save in-memory buffer to temporary file for face ${face}:`, error);
          throw new Error(`Failed to save buffer for face ${face}: ${error.message}`);
        }
      }
    }

    // Forward to FastAPI backend with timeout
    console.log('Forwarding files to backend');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze-cube', {
        method: 'POST',
        body: backendFormData,
        headers: backendFormData.getHeaders(),
        signal: controller.signal
      });

      clearTimeout(timeout);

      // Get response as text first
      const responseText = await response.text();
      console.log('Backend response status:', response.status);
      console.log('Backend response:', responseText);

      // Parse JSON response
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        throw new Error('Invalid JSON response from backend');
      }

      // Check for error response
      if (!response.ok) {
        throw new Error(responseData.detail || 'Backend error');
      }

      // Return success response
      return res.status(200).json(responseData);

    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Backend request timed out after 30 seconds');
      }
      throw error;
    }

  } catch (error) {
    console.error('Error in API route:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: error.message
    });
  }
}
