import { Button, Dialog, Input } from 'erxes-ui';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { decodeQrFromImage } from '~/modules/booking/utils/decodeQrApi';

const DECODE_THROTTLE_MS = 400;
const QRCODE_RAPTOR_URL = 'https://qrcoderaptor.com/';

interface ScanBookingQrDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (customerId: string) => void;
}

export function ScanBookingQrDialog({
  open,
  onOpenChange,
  onScanSuccess,
}: ScanBookingQrDialogProps) {
  const [mode, setMode] = useState<'camera' | 'file' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [manualCustomerId, setManualCustomerId] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastDecodeTimeRef = useRef<number>(0);
  const decodeInProgressRef = useRef<boolean>(false);

  useEffect(() => {
    if (!open) {
      stopScanning();
      setMode(null);
      setError(null);
      setManualCustomerId('');
      return;
    }
    setError(null);
    return () => {
      stopScanning();
    };
  }, [open]);

  useEffect(() => {
    if (mode !== 'camera' || !open) {
      return;
    }

    async function startCameraScan() {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        function scanFrame() {
          if (!video || !context) {
            return;
          }

          try {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              const now = Date.now();
              if (
                !decodeInProgressRef.current &&
                now - lastDecodeTimeRef.current >= DECODE_THROTTLE_MS
              ) {
                lastDecodeTimeRef.current = now;
                decodeInProgressRef.current = true;

                canvas.toBlob(
                  (blob) => {
                    if (!blob || mode !== 'camera' || !open) {
                      decodeInProgressRef.current = false;
                      if (mode === 'camera' && open) {
                        animationFrameRef.current =
                          requestAnimationFrame(scanFrame);
                      }
                      return;
                    }

                    decodeQrFromImage(blob)
                      .then((result) => {
                        if ('value' in result) {
                          stopScanning();
                          onScanSuccess(result.value);
                          onOpenChange(false);
                          return;
                        }
                      })
                      .catch(() => {
                        // Ignore per-frame errors, continue scanning
                      })
                      .finally(() => {
                        decodeInProgressRef.current = false;
                        if (mode === 'camera' && open) {
                          animationFrameRef.current =
                            requestAnimationFrame(scanFrame);
                        }
                      });
                  },
                  'image/jpeg',
                  0.9,
                );
              } else {
                if (mode === 'camera' && open) {
                  animationFrameRef.current = requestAnimationFrame(scanFrame);
                }
              }
            } else {
              if (mode === 'camera' && open) {
                animationFrameRef.current = requestAnimationFrame(scanFrame);
              }
            }
          } catch {
            if (mode === 'camera' && open) {
              animationFrameRef.current = requestAnimationFrame(scanFrame);
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(scanFrame);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to start camera';
        if (
          err instanceof Error &&
          (err.name === 'NotAllowedError' ||
            err.name === 'PermissionDeniedError')
        ) {
          setError(
            'Camera permission denied. Please allow camera access and try again.',
          );
        } else if (
          err instanceof Error &&
          (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')
        ) {
          setError('No camera found. Please connect a camera and try again.');
        } else {
          setError(message);
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
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function handleCameraScan() {
    setError(null);
    setMode('camera');
  }

  async function handleFileScan(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setFileLoading(true);

    try {
      const result = await decodeQrFromImage(file);

      if ('value' in result) {
        onScanSuccess(result.value);
        onOpenChange(false);
      } else {
        setError(result.error || 'No QR code found in the image');
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to scan QR code from file';
      setError(message);
    } finally {
      setFileLoading(false);
      event.target.value = '';
    }
  }

  function handleClose() {
    stopScanning();
    setMode(null);
    setError(null);
    setManualCustomerId('');
    onOpenChange(false);
  }

  function handleManualLookup() {
    const id = manualCustomerId.trim();
    if (!id) {
      setError('Please enter a customer ID');
      return;
    }
    setError(null);
    onScanSuccess(id);
    setManualCustomerId('');
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>Scan Customer ID</Dialog.Title>
          <Dialog.Description>
            Scan a customer QR or enter customer ID to mark booking attendance
          </Dialog.Description>
        </Dialog.Header>

        <div className="flex flex-col gap-4 py-4">
          {!mode && (
            <div className="flex flex-col gap-4">
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
                    disabled={fileLoading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full pointer-events-none"
                    disabled={fileLoading}
                  >
                    {fileLoading ? 'Decoding...' : 'Upload Image'}
                  </Button>
                </label>
              </div>

              <div className="border-t pt-4 flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  If the QR reader doesn&apos;t work, decode your QR code at{' '}
                  <a
                    href={QRCODE_RAPTOR_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    QRCodeRaptor
                  </a>{' '}
                  (qrcoderaptor.com), then paste the customer ID below.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter customer ID"
                    value={manualCustomerId}
                    onChange={(e) => setManualCustomerId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleManualLookup();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleManualLookup}
                    disabled={!manualCustomerId.trim()}
                  >
                    Look up
                  </Button>
                </div>
              </div>
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
