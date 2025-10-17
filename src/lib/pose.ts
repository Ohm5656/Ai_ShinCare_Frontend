import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";

let landmarker: FaceLandmarker | null = null;

export async function initFaceLandmarker() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );

  landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    runningMode: "VIDEO",
    outputFaceBlendshapes: false,
    numFaces: 1,
  });
  return landmarker!;
}

export async function estimate(videoEl: HTMLVideoElement) {
  if (!landmarker) throw new Error("FaceLandmarker not initialized");
  const nowInMs = performance.now();
  return await landmarker.detectForVideo(videoEl, nowInMs);
}

export function computeHeadPoseFromLandmarks(result: FaceLandmarkerResult) {
  if (!result.faceLandmarks?.length) return null;

  const lm = result.faceLandmarks[0];
  const leftEyeIdxs = [33, 133, 159, 145];
  const rightEyeIdxs = [263, 362, 386, 374];

  const mean = (idxs: number[]) => {
    let x = 0, y = 0;
    idxs.forEach(i => { x += lm[i].x; y += lm[i].y; });
    return { x: x / idxs.length, y: y / idxs.length };
  };

  const L = mean(leftEyeIdxs);
  const R = mean(rightEyeIdxs);

  const rollRad = Math.atan2((R.y - L.y), (R.x - L.x));
  const roll = rollRad * 180 / Math.PI;
  const yaw = -(roll);
  const nose = lm[1];
  const eyeMidY = (L.y + R.y) / 2;
  const pitch = (eyeMidY - nose.y) * 120;

  return { yaw, pitch, roll };
}
