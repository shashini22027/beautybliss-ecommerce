import { useEffect, useRef, useState } from 'react';
import { Camera, Sparkles, Upload, X } from 'lucide-react';

const makeupTypes = {
  lipstick: {
    label: 'Lipstick',
    shades: [
      { name: 'Rosewood', color: '#a94d61' },
      { name: 'Soft Coral', color: '#d96b64' },
      { name: 'Berry', color: '#84334e' },
      { name: 'Classic Red', color: '#c62838' },
    ],
  },
  blush: {
    label: 'Blush',
    shades: [
      { name: 'Petal Pink', color: '#df7784' },
      { name: 'Peach Glow', color: '#e99570' },
      { name: 'Berry Flush', color: '#bd627a' },
      { name: 'Soft Mauve', color: '#b47988' },
    ],
  },
  foundation: {
    label: 'Foundation',
    shades: [
      { name: 'Warm Sand', color: '#d39b72' },
      { name: 'Golden Beige', color: '#bd8056' },
      { name: 'Honey', color: '#a96e48' },
      { name: 'Deep Cocoa', color: '#764a38' },
    ],
  },
};

const lipLandmarkIndices = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17,
  84, 181, 91, 146,
];

const faceLandmarkIndices = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162,
  21, 54, 103, 67, 109,
];

const createLandmarkPath = (landmarks, indices) => {
  const points = indices.map((index) => landmarks[index]).filter(Boolean);
  if (points.length < 3) return '';

  return `${points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')} Z`;
};

const VirtualMakeupTryOn = () => {
  const [makeupType, setMakeupType] = useState('lipstick');
  const [selectedShade, setSelectedShade] = useState(makeupTypes.lipstick.shades[0]);
  const [mediaSource, setMediaSource] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [mediaAspectRatio, setMediaAspectRatio] = useState(3 / 4);
  const [landmarks, setLandmarks] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const imageInputRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const lastDetectionAtRef = useRef(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      faceLandmarkerRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!mediaSource) return undefined;
    return () => URL.revokeObjectURL(mediaSource);
  }, [mediaSource]);

  const getFaceLandmarker = async (runningMode) => {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');

    if (!faceLandmarkerRef.current) {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm'
      );
      const baseOptions = {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
      };

      try {
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { ...baseOptions, delegate: 'GPU' },
          runningMode,
          numFaces: 1,
        });
      } catch {
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { ...baseOptions, delegate: 'CPU' },
          runningMode,
          numFaces: 1,
        });
      }
    } else {
      await faceLandmarkerRef.current.setOptions({ runningMode });
    }

    return faceLandmarkerRef.current;
  };

  const handleImageLoad = async () => {
    const image = imageRef.current;
    if (!image) return;

    setMediaAspectRatio(image.naturalWidth / image.naturalHeight || 3 / 4);
    setStatus('loading');
    setError('');

    try {
      const detector = await getFaceLandmarker('IMAGE');
      const result = detector.detect(image);
      const detectedLandmarks = result.faceLandmarks?.[0];
      if (!detectedLandmarks) {
        setLandmarks(null);
        setStatus('no-face');
        return;
      }

      setLandmarks(detectedLandmarks);
      setStatus('ready');
    } catch (detectionError) {
      console.error('Virtual makeup face detection failed', detectionError);
      setLandmarks(null);
      setStatus('error');
      setError('Face detection could not start. Check your connection and try again.');
    }
  };

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Choose an image file to start your virtual try-on.');
      setStatus('error');
      return;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setMediaType('photo');
    setLandmarks(null);
    setError('');
    setStatus('loading');
    setMediaSource((currentSource) => {
      if (currentSource) URL.revokeObjectURL(currentSource);
      return URL.createObjectURL(file);
    });
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setMediaType('none');
    setMediaSource('');
    setLandmarks(null);
    setStatus('idle');
  };

  const startCamera = async () => {
    setError('');
    setLandmarks(null);
    setStatus('loading');

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setError('Camera access is not available in this browser. Upload a photo instead.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: 'user' },
      });
      streamRef.current = stream;
      setMediaType('camera');
      setMediaSource('');
    } catch (cameraError) {
      console.error('Virtual makeup camera could not start', cameraError);
      setStatus('error');
      setError('Camera access was unavailable. Allow camera permission or upload a photo.');
    }
  };

  useEffect(() => {
    if (mediaType !== 'camera' || !streamRef.current || !videoRef.current) {
      return undefined;
    }

    let cancelled = false;
    const video = videoRef.current;
    video.srcObject = streamRef.current;

    const detectVideoFrame = async () => {
      try {
        const detector = await getFaceLandmarker('VIDEO');
        if (cancelled) return;

        await video.play();
        const detect = () => {
          if (cancelled) return;

          const now = performance.now();
          if (
            video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
            video.currentTime !== lastVideoTimeRef.current &&
            now - lastDetectionAtRef.current > 100
          ) {
            lastVideoTimeRef.current = video.currentTime;
            lastDetectionAtRef.current = now;
            setMediaAspectRatio(video.videoWidth / video.videoHeight || 3 / 4);

            try {
              const result = detector.detectForVideo(video, now);
              const detectedLandmarks = result.faceLandmarks?.[0];
              setLandmarks(detectedLandmarks || null);
              setStatus(detectedLandmarks ? 'ready' : 'no-face');
            } catch (detectionError) {
              console.error('Virtual makeup camera detection failed', detectionError);
              setStatus('error');
              setError('Face detection stopped. Try restarting the camera or upload a photo.');
              return;
            }
          }

          animationFrameRef.current = window.requestAnimationFrame(detect);
        };

        detect();
      } catch (cameraError) {
        if (cancelled) return;
        console.error('Virtual makeup camera setup failed', cameraError);
        setStatus('error');
        setError('Face detection could not start. Check your connection and try again.');
      }
    };

    detectVideoFrame();
    return () => {
      cancelled = true;
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mediaType]);

  const handleMakeupTypeChange = (nextType) => {
    setMakeupType(nextType);
    setSelectedShade(makeupTypes[nextType].shades[0]);
  };

  const lipPath = landmarks ? createLandmarkPath(landmarks, lipLandmarkIndices) : '';
  const facePath = landmarks ? createLandmarkPath(landmarks, faceLandmarkIndices) : '';
  const faceWidth =
    landmarks?.[234] && landmarks?.[454]
      ? Math.abs(landmarks[454].x - landmarks[234].x)
      : 0.3;

  return (
    <section className="border-t border-gray-200 bg-[#f6f6f6] py-20">
      <div className="mx-auto max-w-[1540px] px-6">
        <div className="mb-10 max-w-3xl border-b border-gray-200 pb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-pink-600">
            BeautyBliss Virtual Studio
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-950">
            Try makeup virtually
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            Upload a photo or turn on your camera to preview lipstick, blush, and foundation shades.
            Face analysis runs in your browser; your image is not uploaded.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="border border-gray-200 bg-white p-5 sm:p-7">
            <div
              className="relative mx-auto w-full max-w-[440px] overflow-hidden bg-[#f3f0ee]"
              style={{ aspectRatio: mediaAspectRatio }}
            >
              {mediaType === 'photo' && mediaSource ? (
                <img
                  ref={imageRef}
                  src={mediaSource}
                  alt="Your virtual makeup preview"
                  onLoad={handleImageLoad}
                  className="absolute inset-0 h-full w-full object-fill"
                />
              ) : mediaType === 'camera' ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-fill"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center text-gray-500">
                  <Camera className="h-12 w-12 text-pink-600" />
                  <p className="mt-4 text-lg font-bold text-gray-900">Your preview starts here</p>
                  <p className="mt-2 text-sm leading-6">
                    Use a clear, front-facing photo in good light for the best result.
                  </p>
                </div>
              )}

              {landmarks && (
                <svg
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <filter id="makeup-blur">
                      <feGaussianBlur stdDeviation="0.008" />
                    </filter>
                    <clipPath id="makeup-after-half">
                      <rect x="0.5" y="0" width="0.5" height="1" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#makeup-after-half)">
                    {makeupType === 'foundation' && facePath && (
                      <path d={facePath} fill={selectedShade.color} opacity="0.2" />
                    )}
                    {makeupType === 'blush' && landmarks[123] && landmarks[352] && (
                      <>
                        <ellipse
                          cx={landmarks[123].x}
                          cy={landmarks[123].y}
                          rx={faceWidth * 0.09}
                          ry={faceWidth * 0.045}
                          fill={selectedShade.color}
                          opacity="0.46"
                          filter="url(#makeup-blur)"
                        />
                        <ellipse
                          cx={landmarks[352].x}
                          cy={landmarks[352].y}
                          rx={faceWidth * 0.09}
                          ry={faceWidth * 0.045}
                          fill={selectedShade.color}
                          opacity="0.46"
                          filter="url(#makeup-blur)"
                        />
                      </>
                    )}
                    {makeupType === 'lipstick' && lipPath && (
                      <path d={lipPath} fill={selectedShade.color} opacity="0.58" />
                    )}
                  </g>
                </svg>
              )}
              {(mediaType === 'photo' || mediaType === 'camera') && (
                <>
                  <div
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px bg-white shadow-[0_0_3px_rgba(0,0,0,0.8)]"
                    aria-hidden="true"
                  />
                  <span className="pointer-events-none absolute left-3 top-3 z-10 bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Original
                  </span>
                  <span className="pointer-events-none absolute right-3 top-3 z-10 bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    With shade
                  </span>
                </>
              )}
            </div>

            <div className="mx-auto mt-5 flex max-w-[440px] flex-wrap gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleImageSelection}
                className="hidden"
                aria-label="Choose a photo for virtual makeup"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-gray-950 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-pink-600"
              >
                <Upload size={17} />
                Upload photo
              </button>
              {mediaType === 'camera' ? (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-gray-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-900 transition hover:border-gray-950"
                >
                  <X size={17} />
                  Stop camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-gray-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-900 transition hover:border-gray-950"
                >
                  <Camera size={17} />
                  Use camera
                </button>
              )}
            </div>

            {status === 'loading' && (
              <p className="mx-auto mt-4 max-w-[440px] text-sm font-semibold text-gray-600" role="status">
                Preparing face detection and makeup preview...
              </p>
            )}
            {status === 'no-face' && (
              <p className="mx-auto mt-4 max-w-[440px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800" role="status">
                No face detected. Try a front-facing photo with your face clearly visible.
              </p>
            )}
            {status === 'error' && error && (
              <p className="mx-auto mt-4 max-w-[440px] border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
            {status === 'ready' && (
              <p className="mx-auto mt-4 max-w-[440px] text-sm font-semibold text-green-700" role="status">
                Face detected — shade preview is ready.
              </p>
            )}
          </div>

          <div className="h-fit border border-gray-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-gray-950">
                Choose your look
              </h3>
            </div>

            <div className="mt-6 grid grid-cols-3 border border-gray-200">
              {Object.entries(makeupTypes).map(([type, makeup]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleMakeupTypeChange(type)}
                  aria-pressed={makeupType === type}
                  className={`px-3 py-3 text-xs font-bold uppercase tracking-wide transition ${
                    makeupType === type
                      ? 'bg-gray-950 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {makeup.label}
                </button>
              ))}
            </div>

            <p className="mt-7 text-sm font-bold text-gray-800">Select a shade</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {makeupTypes[makeupType].shades.map((shade) => (
                <button
                  key={shade.name}
                  type="button"
                  onClick={() => setSelectedShade(shade)}
                  aria-pressed={selectedShade.name === shade.name}
                  className={`flex items-center gap-3 border p-3 text-left transition ${
                    selectedShade.name === shade.name
                      ? 'border-gray-950 ring-1 ring-gray-950'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span
                    className="h-8 w-8 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: shade.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-gray-800">{shade.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-7 border-t border-gray-200 pt-5 text-sm leading-6 text-gray-500">
              This is a shade preview to help compare colors, not a guarantee of exact color or
              clinical skin analysis. Your photo stays on this device.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualMakeupTryOn;
