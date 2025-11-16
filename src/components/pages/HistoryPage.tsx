// ---- NEW STATES ----
const [scoreSummary, setScoreSummary] = useState({
  totalScans: 0,
  averageScore: 0,
  latestScore: 0,
  improvement: 0,
});

const [chartData, setChartData] = useState([]);
const [pastScans, setPastScans] = useState([]);
const [galleryData, setGalleryData] = useState([]);

// ---- FETCH REAL DATA FROM BACKEND ----
useEffect(() => {
  async function loadData() {
    try {
      // 1) Summary
      const resSummary = await fetch(`${import.meta.env.VITE_API_URL}/history/summary`);
      const summary = await resSummary.json();
      setScoreSummary(summary);

      // 2) Chart
      const resChart = await fetch(
        `${import.meta.env.VITE_API_URL}/history/scores?range=${selectedTimeframe}`
      );
      const chart = await resChart.json();
      setChartData(chart);

      // 3) Past scans
      const resScans = await fetch(`${import.meta.env.VITE_API_URL}/history/scans`);
      const scans = await resScans.json();
      setPastScans(scans);

      // 4) Before/After
      const resGallery = await fetch(`${import.meta.env.VITE_API_URL}/history/progress`);
      const gallery = await resGallery.json();
      setGalleryData(gallery);

    } catch (err) {
      console.error("History load error:", err);
    }
  }

  loadData();
}, [selectedTimeframe]);

// ---- Timeframe options remain the same ----
const timeframes = [
  { id: "7days" as Timeframe, label: t.days7, emoji: "📅", color: "from-pink-400 to-pink-500" },
  { id: "15days" as Timeframe, label: t.days15, emoji: "📊", color: "from-lavender-400 to-lavender-500" },
  { id: "30days" as Timeframe, label: t.days30, emoji: "📈", color: "from-blue-400 to-blue-500" },
];

// Metrics ไม่ต้องแก้
const metrics = [
  { id: "overall", label: t.overview, icon: TrendingUp, color: "#FF99CB", gradient: "from-pink-400 to-pink-500" },
  { id: "wrinkles", label: t.wrinkles, icon: Waves, color: "#73FFA3", gradient: "from-mint-400 to-mint-500" },
  { id: "sagging", label: t.sagging, icon: ChevronsDown, color: "#7DB8FF", gradient: "from-blue-400 to-blue-500" },
  { id: "darkSpots", label: t.darkSpots, icon: CircleDot, color: "#FFB350", gradient: "from-amber-400 to-amber-500" },
  { id: "acne", label: t.acne, icon: Sparkles, color: "#B79DFF", gradient: "from-purple-400 to-purple-500" },
  { id: "redness", label: t.redness, icon: Flame, color: "#FF8B94", gradient: "from-rose-400 to-rose-500" },
  { id: "pores", label: t.pores, icon: Circle, color: "#6DD5ED", gradient: "from-cyan-400 to-cyan-500" },
  { id: "evenness", label: t.skinEvenness, icon: Palette, color: "#FED766", gradient: "from-yellow-400 to-yellow-500" },
];

// CURRENT DATA USED FOR CHART
const currentData = chartData;
const currentMetric = metrics.find(m => m.id === selectedMetric);
const currentTimeframe = timeframes.find(t => t.id === selectedTimeframe);


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-28 relative">
      {/* Cute floating decorations - Simplified for performance */}
      <div className="absolute top-20 right-10 text-pink-200 opacity-20">
        <Sparkles className="w-16 h-16" />
      </div>

      {/* Header */}
      <div className="px-6 pt-12 pb-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-gray-800 mb-2">{t.progressHistory}</h2>
          <p className="text-sm text-gray-600">{t.trackYourProgress}</p>
        </motion.div>
      </div>

      <div className="px-6 space-y-5 relative z-10">

        {/* =========================
            1) SUMMARY CARDS (แก้เฉพาะค่านี้)
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="bg-white rounded-[32px] p-6 shadow-cute-xl border border-pink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/50 to-transparent rounded-full"></div>

            <div className="grid grid-cols-4 gap-3 relative z-10">
              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent mb-1 font-semibold">
                  {scoreSummary.totalScans}
                </div>
                <p className="text-xs text-gray-500">{t.totalScans}</p>
              </div>

              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-pink-500 to-pink-600 bg-clip-text text-transparent mb-1 font-semibold">
                  {scoreSummary.averageScore}
                </div>
                <p className="text-xs text-gray-500">{t.averageScore}</p>
              </div>

              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-lavender-500 to-purple-600 bg-clip-text text-transparent mb-1 font-semibold">
                  {scoreSummary.latestScore}
                </div>
                <p className="text-xs text-gray-500">{t.latestScore}</p>
              </div>

              <div className="text-center">
                <div className="text-3xl bg-gradient-to-br from-mint-500 to-mint-600 bg-clip-text text-transparent mb-1 font-semibold">
                  +{scoreSummary.improvement}
                </div>
                <p className="text-xs text-gray-500">{t.improved}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* =========================
            2) TIMEFRAME SELECTOR (ไม่ต้องแก้)
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {timeframes.map((timeframe, index) => {
              const isActive = selectedTimeframe === timeframe.id;
              return (
                <motion.button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={`relative rounded-[24px] p-4 transition-all duration-300 ${
                    isActive
                      ? "bg-white shadow-cute-lg scale-105"
                      : "bg-white/60 hover:bg-white/80 shadow-cute-sm hover:shadow-cute-md"
                  }`}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="timeframeGlow"
                        className={`absolute inset-0 bg-gradient-to-br ${timeframe.color} rounded-[24px] opacity-10`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                      <motion.div
                        layoutId="timeframeBorder"
                        className={`absolute inset-0 bg-gradient-to-br ${timeframe.color} rounded-[24px] p-[2px]`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="w-full h-full bg-white rounded-[23px]"></div>
                      </motion.div>
                    </>
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-2xl">{timeframe.emoji}</span>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-gradient-to-br " +
                            timeframe.color +
                            " bg-clip-text text-transparent"
                          : "text-gray-600"
                      }`}
                    >
                      {timeframe.label}
                    </span>

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-xs font-medium bg-gradient-to-br ${timeframe.color} text-white px-2 py-0.5 rounded-full`}
                      >
                        {timeframe.improvement}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* =========================
            3) METRIC FILTERS (ไม่ต้องแก้)
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* metrics UI unchanged */}
          {/** ... unchanged code ... */}
        </motion.div>

        {/* =========================
            4) PROGRESS CHART (ใช้ currentData — ถูกแล้ว)
        ========================== */}
        {/* ... unchanged chart code ... */}

        {/* =========================
            5) PAST SCANS TIMELINE (ไม่ต้องแก้ UI — ใช้ pastScans จาก API)
        ========================== */}
        {/* ... unchanged timeline code ... */}

        {/* =========================
            6) BEFORE / AFTER GALLERY (ต้องแก้ให้ใช้ galleryData)
        ========================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-lavender-100 via-pink-100 to-peach-100 rounded-[32px] p-6 shadow-cute-lg border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full"></div>

            <div className="flex items-center gap-2 mb-5 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-lavender-600" />
              </div>
              <h4 className="text-gray-800 font-semibold">{t.gallery}</h4>
            </div>

            <div className="grid grid-cols-1 gap-3 relative z-10">
              {galleryData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  onClick={() => onViewGallery?.(`${item.start} → ${item.end}`)}
                  className="bg-white/90 rounded-[24px] p-4 flex items-center justify-between hover:bg-white hover:shadow-cute-md transition-all cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-lavender-200 via-pink-200 to-peach-200 flex items-center justify-center text-2xl shadow-cute-sm">
                      {item.emoji || "✨"}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {item.start} → {item.end}
                      </p>

                      <p className="text-sm text-mint-600 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t.improvedBy} +{item.improvement} {t.points}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-lavender-400" />
                </motion.div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-lavender-300 text-lavender-700 hover:bg-white/80 rounded-[20px] h-12 font-semibold bg-white/80 shadow-cute-sm"
              onClick={() => onViewGallery?.()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              {t.viewAllGallery}
            </Button>
          </Card>
        </motion.div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center pb-4"
        >
          <div className="bg-white rounded-[32px] p-6 shadow-cute-lg border border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-lavender-50 opacity-50"></div>
            <p className="text-4xl mb-3 relative z-10">
              🎉
            </p>
            <p className="text-gray-700 mb-1 font-semibold relative z-10">{t.greatJobName.replace('{name}', userName)}</p>
            <p className="text-sm text-gray-500 relative z-10">
              {t.youImprovedPoints} <span className="font-semibold text-blue-600">+17 {t.points}</span> {t.improvementThis}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
