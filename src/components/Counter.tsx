import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>ตัวนับ (Counter)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="text-6xl tabular-nums">{count}</div>
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setCount(count - 1)}
          >
            <Minus className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setCount(0)}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={() => setCount(count + 1)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
