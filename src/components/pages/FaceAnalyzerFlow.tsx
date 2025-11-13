// src/pages/FaceAnalyzerFlow.tsx
import { useState } from "react";
import { FaceScanScreen } from "./FaceScanScreen";
import { AnalyzingScreen } from "./AnalyzingScreen";
import { SkinAnalysisResult } from "./SkinAnalysisResult";

export function FaceAnalyzerFlow() {
  const [step, setStep] = useState<"scan" | "analyze" | "result">("scan");
  const [capturedImages, setCapturedImages] = useState<any>(null);
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);

  if (step === "scan") {
    return (
      <FaceScanScreen
        onAnalyze={(images) => {
          setCapturedImages(images);
          setStep("analyze");
        }}
        onBack={() => window.history.back()}
      />
    );
  }

  if (step === "analyze") {
    return (
      <AnalyzingScreen
        capturedImages={capturedImages}
        onComplete={(result) => {
          setAnalyzeResult(result);
          setStep("result");
        }}
      />
    );
  }

  if (step === "result") {
    return (
      <SkinAnalysisResult
        result={analyzeResult} // ✅ ส่งผลจริงจาก backend
        onChatWithAI={() => console.log("ไปหน้า DrSkinAI Chat")}
        onBack={() => setStep("scan")}
      />
    );
  }

  return null;
}
