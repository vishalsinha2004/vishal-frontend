
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from '../hooks/useSound';

const SplashScreen = ({ onComplete, apiUrl }) => {
  const { playSound } = useSound();

  const [phase, setPhase] = useState('init');
  const [logs, setLogs] = useState([]);
  const [dots, setDots] = useState('');
  const [loaderIndex, setLoaderIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const isChecking = useRef(false);
  const isServerAwake = useRef(false);
  const completionTimer = useRef(null);

  const SPLASH_KEY = 'vishal_os_splash_seen';

  /*
   * ------------------------------------------------------------
   * SESSION CHECK
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY) === 'true') {
      onComplete();
    }

    return () => {
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * ------------------------------------------------------------
   * BOOT TERMINAL SEQUENCE
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY) === 'true') {
      return;
    }

    playSound('boot');

    const bootLogs = [
      'C:\\> CHECKING SYSTEM MEMORY........ OK',
      'C:\\> INITIALIZING DISPLAY.......... OK',
      'C:\\> INITIALIZING KEYBOARD......... OK',
      'C:\\> DETECTING STORAGE............. OK',
      'C:\\> LOADING SYSTEM DRIVERS........ OK',
      'C:\\> INITIALIZING AUDIO............ OK',
      'C:\\> DETECTING NETWORK............. OK',
      'C:\\> LOADING SYSTEM SERVICES....... OK',
    ];

    let index = 0;

    const logInterval = setInterval(() => {
      if (index < bootLogs.length) {
        setLogs((previous) => [...previous, bootLogs[index]]);
        index += 1;
      } else {
        clearInterval(logInterval);

        setTimeout(() => {
          setPhase('connecting');
        }, 450);
      }
    }, 140);

    return () => {
      clearInterval(logInterval);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * ------------------------------------------------------------
   * BACKEND HEALTH CHECK
   * ------------------------------------------------------------
   */

  const checkBackendHealth = useCallback(async () => {
    if (isChecking.current || isServerAwake.current) {
      return;
    }

    isChecking.current = true;

    setPhase((currentPhase) => {
      if (currentPhase === 'delayed') {
        return 'connecting';
      }

      return currentPhase;
    });

    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 3500);

      const response = await fetch(`${apiUrl}/system-apps/`, {
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      isServerAwake.current = true;

      setPhase('success');

      playSound('startup');

      completionTimer.current = setTimeout(() => {
        sessionStorage.setItem(SPLASH_KEY, 'true');
        onComplete();
      }, 2200);
    } catch (error) {
      setPhase('delayed');
    } finally {
      isChecking.current = false;
    }
  }, [apiUrl, onComplete, playSound]);

  /*
   * ------------------------------------------------------------
   * BACKEND CONNECTION / AUTOMATIC RETRY
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (phase === 'connecting') {
      checkBackendHealth();
    }

    let retryInterval;

    if (phase === 'delayed') {
      retryInterval = setInterval(() => {
        checkBackendHealth();
      }, 4000);
    }

    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
      }
    };
  }, [phase, checkBackendHealth]);

  /*
   * ------------------------------------------------------------
   * DOS DOT ANIMATION
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((previous) =>
        previous.length >= 3 ? '' : `${previous}.`
      );
    }, 450);

    return () => {
      clearInterval(dotInterval);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * SEGMENTED LOADER
   * ------------------------------------------------------------
   */

  useEffect(() => {
    let loaderInterval;

    if (phase === 'connecting' || phase === 'delayed') {
      loaderInterval = setInterval(() => {
        setLoaderIndex((previous) =>
          previous >= 15 ? 0 : previous + 1
        );
      }, 110);
    } else {
      setLoaderIndex(0);
    }

    return () => {
      if (loaderInterval) {
        clearInterval(loaderInterval);
      }
    };
  }, [phase]);

  /*
   * ------------------------------------------------------------
   * KEYBOARD SHORTCUT
   *
   * Enter / Escape can skip only after backend is confirmed awake.
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const handleSkip = (event) => {
      if (
        (event.key === 'Enter' || event.key === 'Escape') &&
        isServerAwake.current
      ) {
        if (completionTimer.current) {
          clearTimeout(completionTimer.current);
        }

        sessionStorage.setItem(SPLASH_KEY, 'true');
        onComplete();
      }
    };

    window.addEventListener('keydown', handleSkip);

    return () => {
      window.removeEventListener('keydown', handleSkip);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * ------------------------------------------------------------
   * MANUAL RETRY
   * ------------------------------------------------------------
   */

  const handleRetry = () => {
    if (isChecking.current || isServerAwake.current) {
      return;
    }

    setRetryCount((previous) => previous + 1);
    setLoaderIndex(0);
    setPhase('connecting');

    playSound('click');
  };

  /*
   * ------------------------------------------------------------
   * OFFLINE MODE
   * ------------------------------------------------------------
   */

  const handleOffline = () => {
    if (completionTimer.current) {
      clearTimeout(completionTimer.current);
    }

    playSound('startup');

    sessionStorage.setItem(SPLASH_KEY, 'true');

    onComplete();
  };

  /*
   * ------------------------------------------------------------
   * PREVENT RENDER AFTER SESSION SPLASH
   * ------------------------------------------------------------
   */

  if (sessionStorage.getItem(SPLASH_KEY) === 'true') {
    return null;
  }

  /*
   * ------------------------------------------------------------
   * DOS LOADER
   * ------------------------------------------------------------
   */

  const filled = '█'.repeat(loaderIndex);
  const empty = '░'.repeat(15 - loaderIndex);
  const loaderStr = `[${filled}${empty}]`;

  const isConnecting =
    phase === 'connecting' || phase === 'delayed';

  return (
    <div className="absolute inset-0 z-[9999] bg-black text-[#c0c0c0] font-terminal select-none overflow-hidden">
      <style>{`
        @keyframes dosCursor {
          0%,
          45% {
            opacity: 1;
          }

          46%,
          100% {
            opacity: 0;
          }
        }

        @keyframes crtFlicker {
          0% {
            opacity: 0.96;
          }

          5% {
            opacity: 1;
          }

          10% {
            opacity: 0.97;
          }

          15% {
            opacity: 1;
          }

          100% {
            opacity: 0.98;
          }
        }

        @keyframes screenPulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.0005);
          }
        }

        @keyframes bootFlash {
          0% {
            opacity: 0;
          }

          30% {
            opacity: 0.08;
          }

          100% {
            opacity: 0;
          }
        }

        .dos-blink {
          animation: dosCursor 1s steps(1) infinite;
        }

        .splash-crt {
          animation:
            crtFlicker 4s infinite,
            screenPulse 8s ease-in-out infinite;

          background:
            repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.025) 0px,
              rgba(255, 255, 255, 0.025) 1px,
              transparent 1px,
              transparent 3px
            );

          box-shadow:
            inset 0 0 100px rgba(0, 0, 0, 0.85),
            inset 0 0 30px rgba(0, 0, 0, 0.8);
        }

        .crt-vignette {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              ellipse at center,
              transparent 45%,
              rgba(0, 0, 0, 0.35) 75%,
              rgba(0, 0, 0, 0.85) 100%
            );
        }

        .crt-noise {
          pointer-events: none;
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(255, 255, 255, 0.08) 3px
            );
        }

        .boot-flash {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: white;
          animation: bootFlash 1.2s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-crt {
            animation: none;
          }

          .dos-blink {
            animation: none;
          }
        }
      `}</style>

      {/* CRT SCREEN */}
      <div className="absolute inset-0 splash-crt" />

      <div className="crt-vignette" />
      <div className="crt-noise" />

      {phase === 'success' && <div className="boot-flash" />}

      {/* MAIN DOS CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[620px]">

          {/* SYSTEM HEADER */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-white">
                VISHAL OS 98
              </span>

              <span className="text-[#808080]">
                SYSTEM STARTUP
              </span>
            </div>

            <div className="mt-2 h-px w-full bg-[#808080]" />

            <div className="mt-1 h-px w-[72%] bg-[#404040]" />
          </div>

          {/* TERMINAL AREA */}
          <div className="min-h-[270px] text-[12px] sm:text-[13px] leading-[1.65] tracking-normal">

            {logs.map((log, index) => (
              <div
                key={`${log}-${index}`}
                className="whitespace-pre"
              >
                {log}
              </div>
            ))}

            {/* INITIALIZATION */}
            {phase === 'init' && (
              <div className="mt-1 text-white">
                C:\&gt; <span className="dos-blink">_</span>
              </div>
            )}

            {/* CONNECTION */}
            {isConnecting && (
              <>
                <div className="mt-2">
                  C:\&gt; INITIALIZING NETWORK........ OK
                </div>

                <div>
                  C:\&gt; CHECKING VISHAL SERVER{dots}
                </div>

                <div className="mt-5 text-[#f0f0f0]">
                  C:\&gt; CONNECTION STATUS
                </div>

                <div className="mt-1 text-[#808080]">
                  {loaderStr}
                </div>

                <div className="mt-1 text-[#606060] text-[11px]">
                  PLEASE WAIT...
                </div>
              </>
            )}

            {/* SERVER DELAYED */}
            {phase === 'delayed' && (
              <div className="mt-5 w-full max-w-[430px] border border-[#808080] bg-[#c0c0c0] text-black font-dialog shadow-[3px_3px_0_#000]">

                {/* WINDOWS 98 TITLE BAR */}
                <div className="flex items-center justify-between bg-[#000080] px-1 py-[2px] text-[11px] font-bold text-white">

                  <span>
                    VISHAL OS 98 - NETWORK
                  </span>

                  <span className="border border-white px-[3px] leading-none">
                    X
                  </span>

                </div>

                {/* DIALOG CONTENT */}
                <div className="p-3">

                  <div className="flex gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#808080] bg-[#c0c0c0] text-sm font-bold shadow-[inset_1px_1px_#fff]">
                      !
                    </div>

                    <div className="text-[11px] leading-4">
                      <div className="font-bold">
                        The Vishal server is waking up.
                      </div>

                      <div className="mt-1">
                        Please wait while the remote system
                        becomes available.
                      </div>

                      <div className="mt-1 font-terminal text-[10px]">
                        C:\&gt; RETRY ATTEMPT: {retryCount + 1}
                      </div>
                    </div>

                  </div>

                  {/* BUTTONS */}
                  <div className="mt-4 flex flex-wrap justify-end gap-2">

                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={isChecking.current}
                      className="
                        retro-btn
                        min-w-[78px]
                        px-3
                        py-[3px]
                        text-[11px]
                        font-bold
                        outline-none
                        disabled:opacity-50
                        disabled:cursor-wait
                        focus:ring-1
                        focus:ring-black
                      "
                    >
                      RETRY
                    </button>

                    <button
                      type="button"
                      onClick={handleOffline}
                      className="
                        retro-btn
                        min-w-[120px]
                        px-3
                        py-[3px]
                        text-[11px]
                        font-bold
                        outline-none
                        focus:ring-1
                        focus:ring-black
                      "
                    >
                      CONTINUE OFFLINE
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {phase === 'success' && (
              <>
                <div className="mt-2">
                  C:\&gt; INITIALIZING NETWORK........ OK
                </div>

                <div className="text-[#00ff00]">
                  C:\&gt; REMOTE SERVER CONNECTION.... OK
                </div>

                <div className="text-[#00ff00]">
                  C:\&gt; LOADING PORTFOLIO DATA...... OK
                </div>

                <div className="text-[#00ff00]">
                  C:\&gt; SYSTEM INITIALIZATION....... OK
                </div>

                <div className="mt-6 text-white">
                  C:\&gt; STARTING VISHAL OS 98
                  <span className="dos-blink">_</span>
                </div>

                <div className="mt-1 text-[#808080] text-[11px]">
                  PRESS ENTER TO CONTINUE
                </div>
              </>
            )}

          </div>

          {/* FOOTER */}
          <div className="mt-6 border-t border-[#303030] pt-2 text-[10px] text-[#606060] flex justify-between">
            <span>
              VISHAL SYSTEMS
            </span>

            <span>
              COPYRIGHT 1998-{new Date().getFullYear()}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
