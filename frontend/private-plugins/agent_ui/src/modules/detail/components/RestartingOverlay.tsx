import { useEffect, useState } from 'react';

interface RestartingOverlayProps {
  visible: boolean;
  // When true, skip the brief "Stopping..." phase and go straight to the
  // loading state — used when nothing is being stopped (e.g. a fresh assistant
  // that is just starting up for the first time).
  skipStopping?: boolean;
  stoppingTitle?: string;
  stoppingDescription?: string;
  loadingTitle?: string;
  loadingDescription?: string;
  footerText?: string;
}

export const RestartingOverlay = ({
  visible,
  skipStopping = false,
  stoppingTitle = 'Stopping...',
  stoppingDescription = 'Please wait while your assistant is being stopped',
  loadingTitle = '✨ Almost Ready!',
  loadingDescription = 'erxes Assistant is restarting',
  footerText = "This may take 1–2 minutes. You won't be able to chat during this time.",
}: RestartingOverlayProps) => {
  const [phase, setPhase] = useState<'stopping' | 'loading'>(
    skipStopping ? 'loading' : 'stopping',
  );

  useEffect(() => {
    if (!visible) {
      setPhase(skipStopping ? 'loading' : 'stopping');
      return;
    }

    if (skipStopping) {
      setPhase('loading');
      return;
    }

    const stopTimer = setTimeout(() => setPhase('loading'), 3000);
    return () => clearTimeout(stopTimer);
  }, [visible, skipStopping]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      {phase === 'stopping' ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="border-[3px] border-destructive border-t-transparent rounded-full w-12 h-12 animate-spin" />
          <h3 className="text-lg font-semibold">{stoppingTitle}</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            {stoppingDescription}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full px-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold">{loadingTitle}</span>
            <p className="text-muted-foreground text-sm">
              {loadingDescription}
            </p>
          </div>

          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <div className="border-[3px] border-primary border-t-transparent rounded-full w-8 h-8 animate-spin" />
          </div>

          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            Just a moment...
          </div>

          <p className="text-xs text-muted-foreground">
            {footerText}
          </p>
        </div>
      )}
    </div>
  );
};
