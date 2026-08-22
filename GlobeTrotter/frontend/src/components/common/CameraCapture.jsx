import { useState, useRef, useEffect } from 'react'
import { Camera, RefreshCw, Upload, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export default function CameraCapture({ photo, setPhoto }) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      })
      streamRef.current = stream
      setIsCameraActive(true)
    } catch (err) {
      console.error('Camera access error:', err)
      setCameraError('Unable to access webcam. Please allow camera permissions or upload a photo instead.')
      setIsCameraActive(false)
    }
  }

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(e => console.error('Video play error:', e))
    }
  }, [isCameraActive])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setPhoto(dataUrl)
    stopCamera()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a valid image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhoto(event.target.result)
      stopCamera()
    }
    reader.readAsDataURL(file)
  }

  const clearPhoto = () => {
    setPhoto('')
    stopCamera()
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
        Profile Photo / Webcam Snap
      </label>

      {photo ? (
        <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-900 group shadow-lg">
          <img src={photo} alt="User Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={clearPhoto}
              className="p-2 rounded-full bg-zinc-800 text-zinc-200 hover:bg-rose-600 hover:text-white transition"
              title="Remove Photo"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-1 right-1 bg-emerald-500 text-black p-1 rounded-full text-xs font-bold flex items-center gap-1 px-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Captured
          </div>
        </div>
      ) : isCameraActive ? (
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2 shadow-inner">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full max-h-56 object-cover rounded-xl border border-zinc-800"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={capturePhoto}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded-xl text-xs uppercase tracking-wider shadow transition"
            >
              <Camera className="w-4 h-4" /> Snap Photo
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs tracking-wider transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center p-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50">
          <button
            type="button"
            onClick={startCamera}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl text-xs font-medium border border-zinc-700 shadow-sm transition"
          >
            <Camera className="w-4 h-4 text-zinc-300" /> Take Photo with Camera
          </button>
          <span className="text-xs text-zinc-500 font-medium">OR</span>
          <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-medium border border-zinc-800 cursor-pointer transition">
            <Upload className="w-4 h-4 text-zinc-400" /> Upload File
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}

      {cameraError && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/50 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" /> {cameraError}
        </div>
      )}
    </div>
  )
}
