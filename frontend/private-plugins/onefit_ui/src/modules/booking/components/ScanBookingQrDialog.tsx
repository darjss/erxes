import { Button, Dialog } from 'erxes-ui';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

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
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scanAreaId = 'qr-scanner';

  useEffect(() => {
    if (!open) {
      stopScanning();
      setMode(null);
      setError(null);
      return;
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
      const element = document.getElementById(scanAreaId);
      if (!element) {
        return;
      }

      try {
        const html5QrCode = new Html5Qrcode(scanAreaId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            stopScanning();
            onScanSuccess(decodedText);
            onOpenChange(false);
          },
          () => {
            // Ignore scan errors while scanning
          },
        );
      } catch (err: any) {
        setError(err.message || 'Failed to start camera scanning');
        setMode(null);
      }
    }

    startCameraScan();

    return () => {
      stopScanning();
    };
  }, [mode, open, onScanSuccess, onOpenChange]);

  function stopScanning() {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          html5QrCodeRef.current?.clear();
          html5QrCodeRef.current = null;
        })
        .catch(() => {
          // Ignore stop errors
        });
    }
  }

  function handleCameraScan() {
    setError(null);
    setMode('camera');
  }

  async function handleFileScan(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);

    try {
      // Create a hidden div for file scanning if it doesn't exist
      const fileScanId = 'qr-file-scanner';
      let fileScanElement = document.getElementById(fileScanId);
      if (!fileScanElement) {
        fileScanElement = document.createElement('div');
        fileScanElement.id = fileScanId;
        fileScanElement.style.display = 'none';
        document.body.appendChild(fileScanElement);
      }

      const html5QrCode = new Html5Qrcode(fileScanId);
      const result = await html5QrCode.scanFile(file, false);
      
      // Clean up - scanFile doesn't require stop() but we should clear the instance
      html5QrCode.clear();
      
      onScanSuccess(result);
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
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

          {mode && (
            <div className="flex flex-col gap-2">
              <div id={scanAreaId} className="w-full min-h-[300px]" />
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
