"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { SegmentationMask } from "../types";

interface UseMediaPipeReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  segment: (video: HTMLVideoElement, timestampMs: number) => SegmentationMask;
}

export function useMediaPipe(enabled: boolean): UseMediaPipeReturn {
  const segmenterRef = useRef<{
    segmentForVideo: (
      video: HTMLVideoElement,
      ts: number
    ) => {
      categoryMask?: { getAsUint8Array: () => Uint8Array } | null;
      close: () => void;
    };
  } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function load() {
      const { FilesetResolver, ImageSegmenter } = await import(
        "@mediapipe/tasks-vision"
      );
      if (cancelled) return;

      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
      );
      if (cancelled) return;

      const segmenter = await ImageSegmenter.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        outputCategoryMask: true,
        outputConfidenceMasks: false,
      });

      if (!cancelled) {
        segmenterRef.current = segmenter;
        setIsLoaded(true);
        setIsLoading(false);
      }
    }

    load().catch((e) => {
      if (!cancelled) {
        setError(String(e));
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const segment = useCallback(
    (video: HTMLVideoElement, timestampMs: number): SegmentationMask => {
      if (!segmenterRef.current) return null;
      try {
        const result = segmenterRef.current.segmentForVideo(video, timestampMs);
        const raw = result.categoryMask?.getAsUint8Array() ?? null;
        const copy = raw ? new Uint8Array(raw) : null;
        result.close();
        return copy;
      } catch {
        return null;
      }
    },
    []
  );

  return { isLoaded, isLoading, error, segment };
}
