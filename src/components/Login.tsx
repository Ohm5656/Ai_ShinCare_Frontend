import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!emailOrPhone.trim()) {
      setError("กรุณากรอกอีเมลหรือเบอร์โทรศัพท์");
      return;
    }
    
    if (!password.trim()) {
      setError("กรุณากรอกรหัสผ่าน");
      return;
    }

    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    // Mock login - in real app, this would call an API
    setError("");
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE5E5] via-[#FFF8E1] to-[#E1F5F0] p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-0 rounded-[2rem]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff6b6b] to-[#ffd93d] rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="mb-2">ยินดีต้อนรับ 👋</h1>
          <p className="text-muted-foreground">เข้าสู่ระบบเพื่อใช้งาน AI ของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="emailOrPhone">อีเมลหรือเบอร์โทรศัพท์</Label>
            <Input
              id="emailOrPhone"
              type="text"
              placeholder="example@email.com หรือ 0812345678"
              value={emailOrPhone}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setError("");
              }}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full rounded-full">
            <LogIn className="w-4 h-4 mr-2" strokeWidth={2.5} />
            เข้าสู่ระบบ
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Demo: ใช้อีเมลหรือเบอร์โทรใดก็ได้ และรหัสผ่านอย่างน้อย 6 ตัว</p>
          </div>
        </form>
      </Card>
    </div>
  );
}
