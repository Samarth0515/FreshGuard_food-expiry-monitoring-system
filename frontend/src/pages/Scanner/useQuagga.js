import { useEffect, useRef, useState } from "react";

const QUAGGA_SRC = "https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js";

function loadQuaggaScript() {
  return new Promise((resolve, reject) => {
    if (window.Quagga) {
      resolve(window.Quagga);
      return;
    }
    const existing = document.querySelector(`script[src="${QUAGGA_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Quagga));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = QUAGGA_SRC;
    script.async = true;
    script.onload = () => resolve(window.Quagga);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

/**
 * React hook wrapping QuaggaJS for live barcode scanning, mirroring the
 * behavior of the original scanning.html inline script. Returns refs/
 * state plus start/stop controls.
 */
export function useQuagga(viewportRef, onDetected) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const quaggaRef = useRef(null);

  const start = async () => {
    try {
      const Quagga = await loadQuaggaScript();
      quaggaRef.current = Quagga;

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: viewportRef.current,
            constraints: {
              width: 480,
              height: 300,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader", "upc_e_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error(err);
            setError("Failed to initialize scanner: " + err.message);
            return;
          }
          Quagga.start();
          setActive(true);
          setError("");
        }
      );

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        stop();
        onDetected(code);
      });
    } catch (err) {
      setError("Failed to load scanner library. Check your connection.");
    }
  };

  const stop = () => {
    if (quaggaRef.current && active) {
      quaggaRef.current.stop();
      setActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (quaggaRef.current) {
        quaggaRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { active, error, start, stop };
}
