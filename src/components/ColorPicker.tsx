import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Shuffle } from "lucide-react";

export function ColorPicker() {
  const [color, setColor] = useState("#3b82f6");

  const generateRandomColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>เลือกสี (Color Picker)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div
          className="w-32 h-32 rounded-lg border-4 border-border shadow-lg transition-colors duration-300"
          style={{ backgroundColor: color }}
        />
        <div className="space-y-3 w-full max-w-xs">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-12 rounded-lg cursor-pointer border border-border"
          />
          <Button
            className="w-full"
            variant="outline"
            onClick={generateRandomColor}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            สุ่มสี
          </Button>
          <div className="text-center text-muted-foreground">
            {color.toUpperCase()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
