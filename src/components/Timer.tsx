import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

export function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>จับเวลา (Timer)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="text-5xl tabular-nums">{formatTime(seconds)}</div>
        <div className="flex gap-3">
          <Button
            size="lg"
            variant={isRunning ? "secondary" : "default"}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                หยุด
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                เริ่ม
              </>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={reset}
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            รีเซ็ต
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
