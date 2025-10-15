import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ScanLine, Camera, QrCode } from "lucide-react";
import { useState } from "react";

export function ScanPage() {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="pb-20 px-4 pt-4 space-y-4">
      <div className="text-center mb-6">
        <h1>สแกน</h1>
        <p className="text-muted-foreground">สแกน QR Code หรือบาร์โค้ด</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div
                className={`w-64 h-64 border-4 border-dashed rounded-2xl flex items-center justify-center transition-all ${
                  scanning
                    ? "border-primary bg-primary/5 animate-pulse"
                    : "border-border bg-muted/30"
                }`}
              >
                {scanning ? (
                  <ScanLine className="w-24 h-24 text-primary animate-pulse" />
                ) : (
                  <QrCode className="w-24 h-24 text-muted-foreground" />
                )}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleScan}
                disabled={scanning}
              >
                <Camera className="w-5 h-5 mr-2" />
                {scanning ? "กำลังสแกน..." : "เริ่มสแกน"}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                วางกล้องตรงกับ QR Code หรือบาร์โค้ด
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ประวัติการสแกน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { text: "QR-20251014-001", date: "วันนี้ 14:30" },
                { text: "BAR-20251014-002", date: "วันนี้ 12:15" },
                { text: "QR-20251013-003", date: "เมื่อวาน 18:45" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-4 h-4 text-muted-foreground" />
                    <span>{item.text}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
