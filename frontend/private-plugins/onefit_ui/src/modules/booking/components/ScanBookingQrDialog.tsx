import { Button, Dialog } from 'erxes-ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

// Type declarations for BarcodeDetector API
interface BarcodeDetectorOptions {
  formats: string[];
}

interface DetectedBarcode {
  format: string;
  rawValue: string;
  boundingBox: DOMRectReadOnly;
  cornerPoints: ReadonlyArray<{ x: number; y: number }>;
}

interface BarcodeDetectorInterface {
  detect(image: ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Promise<DetectedBarcode[]>;
}

declare class BarcodeDetector implements BarcodeDetectorInterface {
  constructor(options?: BarcodeDetectorOptions);
  detect(image: ImageBitmap | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Promise<DetectedBarcode[]>;
}

interface ScanBookingQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (bookingId: string) => void;
}

export function ScanBookingQrDialog({
  open,
  onOpenChange,
  onScanSuccess,
}: ScanBookingQrDialogProps) {
  const [mode, setMode] = useState<'camera' | 'file' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const barcodeDetectorRef = useRef<BarcodeDetector | null>(null);

  useEffect(() => {
    if (!open) {
      stopScanning();
      setMode(null);
      setError(null);
      return;
    }

    // Check if BarcodeDetector is supported
    if (!('BarcodeDetector' in window)) {
      setError(
        'BarcodeDetector API is not supported in this browser. Please use Chrome or Edge (version 94 or later).'
      );
    } else {
      try {
        barcodeDetectorRef.current = new BarcodeDetector({
          formats: ['qr_code'],
        });
      } catch (err: any) {
        setError(`Failed to initialize BarcodeDetector: ${err.message}`);
      }
    }

    return () => {
      stopScanning();
    };
  }, [open]);

  useEffect(() => {
    if (mode !== 'camera' || !open) {
      return;
    }

    async function startCameraScan() {
      if (!barcodeDetectorRef.current) {
        setError('BarcodeDetector is not available');
        setMode(null);
        return;
      }

      const video = videoRef.current;
      if (!video) {
        return;
      }

      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        // Create canvas for frame extraction
        if (!canvasRef.current) {
          const canvas = document.createElement('canvas');
          canvasRef.current = canvas;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Start scanning loop
        function scanFrame() {
          if (!video || !barcodeDetectorRef.current || !context) {
            return;
          }

          try {
            // Draw current video frame to canvas
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              // Detect QR codes in the frame
              barcodeDetectorRef.current
                .detect(canvas)
                .then((barcodes: DetectedBarcode[]) => {
                  if (barcodes && barcodes.length > 0) {
                    const qrCode = barcodes.find((barcode: DetectedBarcode) => barcode.format === 'qr_code');
                    if (qrCode && qrCode.rawValue) {
                      stopScanning();
                      onScanSuccess(qrCode.rawValue);
                      onOpenChange(false);
                      return;
                    }
                  }

                  // Continue scanning
                  if (mode === 'camera' && open) {
                    animationFrameRef.current = requestAnimationFrame(scanFrame);
                  }
                })
                .catch(() => {
                  // Ignore detection errors and continue scanning
                  if (mode === 'camera' && open) {
                    animationFrameRef.current = requestAnimationFrame(scanFrame);
                  }
                });
            } else {
              // Video not ready yet, try again
              if (mode === 'camera' && open) {
                animationFrameRef.current = requestAnimationFrame(scanFrame);
              }
            }
          } catch (err) {
            // Ignore frame extraction errors and continue
            if (mode === 'camera' && open) {
              animationFrameRef.current = requestAnimationFrame(scanFrame);
            }
          }
        }

        // Start the scanning loop
        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (err: any) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied. Please allow camera access and try again.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else {
          setError(err.message || 'Failed to start camera scanning');
        }
        setMode(null);
      }
    }

    startCameraScan();

    return () => {
      stopScanning();
    };
  }, [mode, open, onScanSuccess, onOpenChange]);

  function stopScanning() {
    // Stop animation frame
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function handleCameraScan() {
    setError(null);
    if (!('BarcodeDetector' in window)) {
      setError(
        'BarcodeDetector API is not supported in this browser. Please use Chrome or Edge (version 94 or later).'
      );
      return;
    }
    setMode('camera');
  }

  async function handleFileScan(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!barcodeDetectorRef.current) {
      setError('BarcodeDetector is not available');
      return;
    }

    setError(null);

    try {
      // Create ImageBitmap from file
      const imageBitmap = await createImageBitmap(file);

      // Detect QR codes in the image
      const barcodes = await barcodeDetectorRef.current.detect(imageBitmap);

      // Close image bitmap to free memory
      imageBitmap.close();

      if (barcodes && barcodes.length > 0) {
        const qrCode = barcodes.find((barcode: DetectedBarcode) => barcode.format === 'qr_code');
        if (qrCode && qrCode.rawValue) {
          onScanSuccess(qrCode.rawValue);
          onOpenChange(false);
        } else {
          setError('No QR code found in the image');
        }
      } else {
        setError('No QR code found in the image');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to scan QR code from file');
    } finally {
      // Reset file input
      event.target.value = '';
    }
  }

  function handleClose() {
    stopScanning();
    setMode(null);
    setError(null);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Scan Booking QR Code</Dialog.Title>
          <Dialog.Description>
            Scan a QR code to mark booking attendance
          </Dialog.Description>
        </Dialog.Header>

        <div className="flex flex-col gap-4 py-4">
          {!mode && (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={handleCameraScan}
                className="w-full"
              >
                Scan with Camera
              </Button>
              <label className="w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileScan}
                  className="hidden"
                />
                <Button type="button" variant="outline" className="w-full pointer-events-none">
                  Upload Image
                </Button>
              </label>
            </div>
          )}

          {mode === 'camera' && (
            <div className="flex flex-col gap-2">
              <div className="w-full min-h-[300px] relative rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  stopScanning();
                  setMode(null);
                  setError(null);
                }}
                className="w-full"
              >
                Cancel Scanning
              </Button>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
