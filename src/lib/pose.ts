// src/lib/pose.ts
// โหลด MediaPipe Tasks Vision จาก CDN แบบ dynamic import (ไม่ bundle)
// ใช้ any เพื่อลดปัญหา type ตอน build

let MP: any = null;               // module ที่โหลดมาจาก CDN
let landmarker: any = null;       // FaceLandmarker instance

// type บางส่วนที่เราต้องใช้เองแบบเบา ๆ
export interface FaceLandmarkerResultLite {
  faceLandmarks?: Array<Array<{ x: number; y: number; z?: number }>>;
}

/** โหลดโมดูล + โมเดล (เรียกครั้งเดียวพอ) */
export async function initFaceLandmarker() {
  if (landmarker) return landmarker;

  // 1) โหลดโมดูลจาก CDN ตอน runtime
  if (!MP) {
    MP = await import(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14"
    );
  }

  // 2) ตัวช่วยโหลดไฟล์สำหรับ vision (รวม .wasm)
  const filesetResolver = await MP.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
  );

  // 3) สร้าง FaceLandmarker
  landmarker = await MP.FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      // ใช้โมเดล official (น้ำหนักอยู่บน Google Storage)
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
    },
    runningMode: "VIDEO",
    outputFaceBlendshapes: false,
    numFaces: 1,
  });

  return landmarker;
}

/** เรียก detect จาก video element (ต้องเรียกหลัง initFaceLandmarker) */
export async function estimate(videoEl: HTMLVideoElement) {
  if (!landmarker) throw new Error("FaceLandmarker not initialized.");
  const nowInMs = performance.now();
  const res = (await landmarker.detectForVideo(
    videoEl,
    nowInMs
  )) as FaceLandmarkerResultLite;
  return res;
}

/** คำนวณ yaw/pitch อย่างคร่าว ๆ จากจุด landmark ของตา/จมูก */
export function computeHeadPoseFromLandmarks(
  result: FaceLandmarkerResultLite
): { yaw: number; pitch: number; roll: number } | null {
  if (!result?.faceLandmarks?.length) return null;

  const lm = result.faceLandmarks[0];

  // index ของ mediapipe face mesh (mesh 468 จุด)
  const leftEyeIdxs = [33, 133, 159, 145];
  const rightEyeIdxs = [263, 362, 386, 374];

  const mean = (idxs: number[]) => {
    let x = 0,
      y = 0;
    idxs.forEach((i) => {
      x += lm[i].x;
      y += lm[i].y;
    });
    return { x: x / idxs.length, y: y / idxs.length };
  };

  const L = mean(leftEyeIdxs);
  const R = mean(rightEyeIdxs);

  // roll: ความเอียงหัวจากแนวนอน (ดวงตาซ้าย-ขวา)
  const rollRad = Math.atan2(R.y - L.y, R.x - L.x);
  const roll = (rollRad * 180) / Math.PI;

  // yaw: เอา roll มาใช้เป็น proxy (ซ้าย/ขวา) แบบง่าย ๆ
  const yaw = -roll;

  // pitch: ใช้ตำแหน่งจมูกเทียบกับแนวกลางตา
  const nose = lm[1]; // 1 = approximate nose tip
  const eyeMidY = (L.y + R.y) / 2;
  const pitch = (eyeMidY - nose.y) * 120; // สเกลให้เป็นองศาคร่าว ๆ

  return { yaw, pitch, roll };
}
