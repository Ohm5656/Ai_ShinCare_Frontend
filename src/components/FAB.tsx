import { Plus } from "lucide-react";
import { Button } from "./ui/button";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full shadow-2xl z-40 hover:scale-110 transition-transform"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}
