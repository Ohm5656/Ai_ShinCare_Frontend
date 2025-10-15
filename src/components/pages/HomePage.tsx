import { Counter } from "../Counter";
import { ColorPicker } from "../ColorPicker";
import { TodoList } from "../TodoList";
import { Timer } from "../Timer";

export function HomePage() {
  return (
    <div className="pb-20 px-4 pt-4 space-y-4">
      <div className="text-center mb-6">
        <h1>แอพพลิเคชัน 4 ฟังก์ชัน</h1>
        <p className="text-muted-foreground">เลือกเครื่องมือที่คุณต้องการใช้งาน</p>
      </div>
      
      {/* Asymmetrical grid layout */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Large card - spans 2 columns */}
        <div className="col-span-2">
          <TodoList />
        </div>
        
        {/* Two cards in a row */}
        <div className="col-span-1">
          <Counter />
        </div>
        <div className="col-span-1">
          <Timer />
        </div>
        
        {/* Full width card */}
        <div className="col-span-2">
          <ColorPicker />
        </div>
      </div>
    </div>
  );
}
