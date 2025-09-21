'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react'

interface PanoramaViewerProps {
  imageUrl: string
  audioUrl?: string
  title: string
  description: string
}

export default function PanoramaViewer({ imageUrl, audioUrl, title, description }: PanoramaViewerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastRotation, setLastRotation] = useState({ x: 0, y: 0 })
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastRotation(rotation)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setRotation({
      x: lastRotation.x + deltaY * 0.5,
      y: lastRotation.y - deltaX * 0.5
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({ x: touch.clientX, y: touch.clientY })
    setLastRotation(rotation)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStart.x
    const deltaY = touch.clientY - dragStart.y

    setRotation({
      x: lastRotation.x + deltaY * 0.5,
      y: lastRotation.y - deltaX * 0.5
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const resetView = () => {
    setRotation({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    const handleGlobalTouchEnd = () => setIsDragging(false)

    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('touchend', handleGlobalTouchEnd)

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="relative">
        {/* 360° Viewer Container */}
        <div
          ref={containerRef}
          className="relative w-full h-96 bg-gray-900 overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Panoramic Image */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `translateX(-50%) translateY(-50%) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformOrigin: 'center center',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '200%',
              height: '200%',
              left: '50%',
              top: '50%'
            }}
          />
          
          {/* Overlay Instructions */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
            Drag to explore 360° view
          </div>

          {/* Audio Controls */}
          {audioUrl && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleAudio}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          )}

          {/* Reset View Button */}
          <Button
            size="sm"
            variant="secondary"
            onClick={resetView}
            className="absolute bottom-4 left-4 bg-black/50 hover:bg-black/70 text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            onEnded={() => setIsPlaying(false)}
          />
        )}

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Card>
  )
}
