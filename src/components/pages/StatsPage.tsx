import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart3, TrendingUp, Activity, Clock } from "lucide-react";

export function StatsPage() {
  const stats = [
    {
      title: "งานที่เสร็จแล้ว",
      value: "24",
      change: "+12%",
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      title: "เวลาใช้งาน",
      value: "3.2 ชม.",
      change: "+5%",
      icon: Clock,
      color: "text-green-500",
    },
    {
      title: "ความเร็วเฉลี่ย",
      value: "95%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "กิจกรรม",
      value: "142",
      change: "+23%",
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="pb-20 px-4 pt-4 space-y-4">
      <div className="text-center mb-6">
        <h1>สถิติการใช้งาน</h1>
        <p className="text-muted-foreground">ข้อมูลการใช้งานของคุณ</p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} จากเดือนที่แล้ว</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle>กราฟการใช้งาน</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 70, 90].map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-primary rounded-t-md transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>จ</span>
            <span>อ</span>
            <span>พ</span>
            <span>พฤ</span>
            <span>ศ</span>
            <span>ส</span>
            <span>อา</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
