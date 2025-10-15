import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Trash2 } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>รายการสิ่งที่ต้องทำ (To-Do List)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="เพิ่มรายการใหม่..."
          />
          <Button onClick={addTodo}>เพิ่ม</Button>
        </div>
        <div className="flex-1 space-y-2 overflow-auto">
          {todos.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              ไม่มีรายการ
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                  {todo.text}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
