import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calendar, Camera, Image as ImageIcon, FilterX, Grid3x3, Rows3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useLanguage } from '../../contexts/LanguageContext';
import { Dialog, DialogContent } from '../ui/dialog';
import { Progress } from '../ui/progress';

interface GalleryPageProps {
  onBack: () => void;
  onViewScanDetail?: (scanId: number) => void;
  filterDateRange?: string; // e.g., "Oct 1 → Oct 14" to filter by date range
}

type ViewMode = 'grid' | 'list';

interface ScanSession {
  sessionId: string;
  date: string;
  time: string;
  score: number;
  improvement: string;
  dateGroup: string;
  photos: {
    front: string;
    left: string;
    right: string;
  };
  metrics: {
    wrinkles: number;
    sagging: number;
    darkSpots: number;
    acne: number;
    redness: number;
    pores: number;
    skinEvenness: number;
  };
}

export function GalleryPage({ onBack, onViewScanDetail, filterDateRange }: GalleryPageProps) {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSession, setSelectedSession] = useState<ScanSession | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock scan sessions with metrics
  const allScanSessions: ScanSession[] = useMemo(() => [
    {
      sessionId: 'session-1',
      date: t.today,
      time: '9:30 ' + t.am,
      score: 87,
      improvement: '+2',
      dateGroup: language === 'th' ? '1 ต.ค. → 14 ต.ค.' : language === 'en' ? 'Oct 1 → Oct 14' : '10月1日 → 10月14日',
      photos: {
        front: 'https://images.unsplash.com/photo-1610983262851-b6193a8daa17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        left: 'https://images.unsplash.com/photo-1628501023521-48cece9a6909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwZmFjZXxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        right: 'https://images.unsplash.com/photo-1752245818739-890854ca3b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXJsJTIwZmFjZSUyMGNsb3NlfGVufDF8fHx8MTc2MTE0MDcwNHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      metrics: {
        wrinkles: 92,
        sagging: 88,
        darkSpots: 85,
        acne: 90,
        redness: 84,
        pores: 86,
        skinEvenness: 87
      }
    },
    {
      sessionId: 'session-2',
      date: t.yesterday,
      time: '8:15 ' + t.am,
      score: 85,
      improvement: '+1',
      dateGroup: language === 'th' ? '1 ต.ค. → 14 ต.ค.' : language === 'en' ? 'Oct 1 → Oct 14' : '10月1日 → 10月14日',
      photos: {
        front: 'https://images.unsplash.com/photo-1623753700066-cd6fda8896ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNraW5jYXJlJTIwZmFjZXxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        left: 'https://images.unsplash.com/photo-1647957867246-278e4d0f23fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBmYWNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxMTQwNzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        right: 'https://images.unsplash.com/photo-1675194085165-70274e53812b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG5hdHVyYWwlMjBmYWNlfGVufDF8fHx8MTc2MTE0MDcwNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      metrics: {
        wrinkles: 90,
        sagging: 86,
        darkSpots: 83,
        acne: 88,
        redness: 82,
        pores: 84,
        skinEvenness: 85
      }
    },
    {
      sessionId: 'session-3',
      date: language === 'th' ? '1 ก.ย. 2025' : language === 'en' ? 'Sep 1, 2025' : '2025年9月1日',
      time: '10:00 ' + t.am,
      score: 84,
      improvement: '+2',
      dateGroup: language === 'th' ? '1 ก.ย. → 30 ก.ย.' : language === 'en' ? 'Sep 1 → Sep 30' : '9月1日 → 9月30日',
      photos: {
        front: 'https://images.unsplash.com/photo-1610983262851-b6193a8daa17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        left: 'https://images.unsplash.com/photo-1628501023521-48cece9a6909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwZmFjZXxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        right: 'https://images.unsplash.com/photo-1752245818739-890854ca3b81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXJsJTIwZmFjZSUyMGNsb3NlfGVufDF8fHx8MTc2MTE0MDcwNHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      metrics: {
        wrinkles: 88,
        sagging: 84,
        darkSpots: 81,
        acne: 86,
        redness: 80,
        pores: 82,
        skinEvenness: 83
      }
    },
    {
      sessionId: 'session-4',
      date: language === 'th' ? '1 ส.ค. 2025' : language === 'en' ? 'Aug 1, 2025' : '2025年8月1日',
      time: '7:45 ' + t.am,
      score: 82,
      improvement: '0',
      dateGroup: language === 'th' ? '1 ส.ค. → 31 ส.ค.' : language === 'en' ? 'Aug 1 → Aug 31' : '8月1日 → 8月31日',
      photos: {
        front: 'https://images.unsplash.com/photo-1623753700066-cd6fda8896ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNraW5jYXJlJTIwZmFjZXxlbnwxfHx8fDE3NjExNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
        left: 'https://images.unsplash.com/photo-1647957867246-278e4d0f23fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBmYWNlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxMTQwNzA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        right: 'https://images.unsplash.com/photo-1675194085165-70274e53812b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG5hdHVyYWwlMjBmYWNlfGVufDF8fHx8MTc2MTE0MDcwNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      metrics: {
        wrinkles: 86,
        sagging: 82,
        darkSpots: 79,
        acne: 84,
        redness: 78,
        pores: 80,
        skinEvenness: 81
      }
    },
  ], [language, t]);

  // Filter sessions based on date range if provided
  const [currentFilter, setCurrentFilter] = useState<string | undefined>(filterDateRange);
  
  // Update filter when filterDateRange prop changes
  useEffect(() => {
    setCurrentFilter(filterDateRange);
  }, [filterDateRange]);
  
  const scanSessions = currentFilter 
    ? allScanSessions.filter(session => session.dateGroup === currentFilter)
    : allScanSessions;

  const getAngleLabel = (angle: string) => {
    const labels = {
      'front': language === 'th' ? 'หน้าตรง' : language === 'en' ? 'Front' : '正面',
      'left': language === 'th' ? 'ซ้าย' : language === 'en' ? 'Left' : '左侧',
      'right': language === 'th' ? 'ขวา' : language === 'en' ? 'Right' : '右侧',
    };
    return labels[angle as keyof typeof labels];
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-mint-500 to-mint-600';
    if (score >= 80) return 'from-blue-500 to-blue-600';
    if (score >= 70) return 'from-lavender-500 to-lavender-600';
    return 'from-pink-500 to-pink-600';
  };

  const clearFilter = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentFilter(undefined);
  };

  const handleSessionClick = (session: ScanSession) => {
    setSelectedSession(session);
    setSelectedImageIndex(0); // Start with front view
  };

  const imageAngles = ['front', 'left', 'right'] as const;

  const metricKeys = ['wrinkles', 'sagging', 'darkSpots', 'acne', 'redness', 'pores', 'skinEvenness'] as const;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-lavender-50/50 to-blue-50/30 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-blue-100">
          <div className="px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-blue-600" />
                </button>
                <div>
                  <h2 className="text-gray-800">{t.gallery}</h2>
                  <p className="text-xs text-gray-500">
                    {currentFilter ? currentFilter : (language === 'th' ? 'ทั้งหมด' : language === 'en' ? 'All Time' : '全部')} • {scanSessions.length} {language === 'th' ? 'การสแกน' : language === 'en' ? 'scans' : '扫描'}
                  </p>
                </div>
              </div>

              {/* View Mode Toggle & Clear Filter */}
              <div className="flex gap-2">
                {currentFilter && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter();
                    }}
                    className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-all shadow-cute-sm"
                  >
                    <FilterX className="w-5 h-5" />
                  </motion.button>
                )}
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-br from-pink-500 to-lavender-500 text-white shadow-cute-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-br from-pink-500 to-lavender-500 text-white shadow-cute-md'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Rows3 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filter Info Banner - Show when filtered */}
        <AnimatePresence mode="wait">
          {currentFilter && (
            <motion.div
              key="filter-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pt-3"
            >
              <Card className="bg-gradient-to-r from-blue-100 to-lavender-100 border-0 rounded-[20px] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 font-medium">
                        {language === 'th' ? 'กรองตามช่วง' : language === 'en' ? 'Filtered by period' : '按时段筛选'}
                      </p>
                      <p className="text-xs text-gray-600">{currentFilter}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilter();
                    }}
                    className="rounded-full bg-white/80 hover:bg-white text-blue-600"
                  >
                    <FilterX className="w-4 h-4 mr-2" />
                    {language === 'th' ? 'ยกเลิก' : language === 'en' ? 'Clear' : '清除'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-5"
        >
          <Card className="bg-gradient-to-br from-lavender-100 via-pink-100 to-peach-100 border-0 rounded-[24px] p-5">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 text-lavender-600" />
                </div>
                <div className="bg-gradient-to-br from-lavender-600 to-purple-600 bg-clip-text text-transparent">{scanSessions.length}</div>
                <p className="text-xs text-gray-600">
                  {currentFilter 
                    ? (language === 'th' ? 'สแกนในช่วงนี้' : language === 'en' ? 'Scans in Period' : '本期扫描')
                    : (language === 'th' ? 'สแกนทั้งหมด' : language === 'en' ? 'Total Scans' : '总扫描')}
                </p>
              </div>
              <div className="border-x border-pink-200/50">
                <div className="flex items-center justify-center mb-2">
                  <ImageIcon className="w-6 h-6 text-pink-600" />
                </div>
                <div className="bg-gradient-to-br from-pink-600 to-pink-500 bg-clip-text text-transparent">{scanSessions.length * 3}</div>
                <p className="text-xs text-gray-600">{language === 'th' ? 'รูปทั้งหมด' : language === 'en' ? 'Total Photos' : '总照片'}</p>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 bg-clip-text text-transparent">{allScanSessions.length}</div>
                <p className="text-xs text-gray-600">{language === 'th' ? 'ครั้งทั้งหมด' : language === 'en' ? 'All Sessions' : '全部记录'}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Empty State when filtered and no results */}
        {scanSessions.length === 0 && currentFilter ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 pb-6"
          >
            <Card className="bg-white rounded-[32px] p-12 text-center border border-blue-100">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-lavender-100 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-gray-800 mb-2">
                {language === 'th' ? 'ไม่พบการสแกนในช่วงนี้' : language === 'en' ? 'No scans in this period' : '此时段没有扫描记录'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {language === 'th' ? 'ลองเลือกช่วงเวลาอื่น หรือดูการสแกนทั้งหมด' : language === 'en' ? 'Try selecting another period or view all scans' : '尝试选择其他时段或查看所有扫描'}
              </p>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  clearFilter();
                }}
                className="bg-gradient-to-r from-pink-500 to-lavender-500 text-white rounded-full px-6"
              >
                <FilterX className="w-4 h-4 mr-2" />
                {language === 'th' ? 'ดูทั้งหมด' : language === 'en' ? 'View All' : '查看全部'}
              </Button>
            </Card>
          </motion.div>
        ) : (
          /* Gallery Grid or List */
          <div className="px-6 pb-6">
            {viewMode === 'grid' ? (
            // Grid View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-3"
            >
              {scanSessions.map((session, index) => (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                  onClick={() => handleSessionClick(session)}
                  className="relative aspect-[3/4] rounded-[24px] overflow-hidden cursor-pointer group"
                >
                  <ImageWithFallback
                    src={session.photos.front}
                    alt={`Scan ${session.sessionId}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">{session.date}</p>
                      <Badge className="bg-white/20 backdrop-blur-sm border-0 text-white text-xs">
                        3 {language === 'th' ? 'มุม' : language === 'en' ? 'angles' : '角度'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs opacity-80">{session.time}</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{session.score}</span>
                        {session.improvement !== '0' && (
                          <span className="text-xs text-mint-300">{session.improvement}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score Badge - Top Right */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-cute-md">
                    <span className="bg-gradient-to-br from-pink-600 to-lavender-600 bg-clip-text text-transparent font-semibold text-sm">
                      {session.score}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // List View
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-3"
            >
              {scanSessions.map((session, index) => (
                <motion.div
                  key={session.sessionId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.03 }}
                  onClick={() => handleSessionClick(session)}
                  className="cursor-pointer"
                >
                  <Card className="bg-white rounded-[24px] p-3 shadow-cute-md border border-blue-100 hover:shadow-cute-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-20 h-24 rounded-[16px] overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={session.photos.front}
                          alt={`Scan ${session.sessionId}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <span className="bg-gradient-to-br from-pink-600 to-lavender-600 bg-clip-text text-transparent font-semibold text-xs">
                            {session.score}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-gray-800 font-medium">{session.date}</p>
                          <Badge className="bg-lavender-100 text-lavender-700 border-0 text-xs">
                            3 {language === 'th' ? 'มุม' : language === 'en' ? 'angles' : '角度'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">{session.time}</p>
                        {session.improvement !== '0' && (
                          <Badge className="bg-mint-100 text-mint-700 border-0 text-xs">
                            {session.improvement}
                          </Badge>
                        )}
                      </div>

                      {/* View Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 flex-shrink-0"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
          </div>
        )}

        {/* Bottom Info - Only show when there are scans */}
        {scanSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-6 pb-6"
          >
            <div className="bg-white rounded-[28px] p-5 shadow-cute-md border border-blue-100 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-blue-500" />
                <p className="text-gray-700 font-medium">
                  {language === 'th' ? 'เก็บความทรงจำผิวสวย' : language === 'en' ? 'Keep Your Glow Memories' : '保存美肤记忆'}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {language === 'th' 
                  ? 'ทุกรูปภาพเก็บไว้ให้คุณติดตามความก้าวหน้า' 
                  : language === 'en' 
                  ? 'All photos saved to track your progress' 
                  : '所有照片已保存以跟踪您的进展'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scan Session Detail Dialog */}
      <AnimatePresence>
        {selectedSession && (
          <Dialog open={!!selectedSession} onOpenChange={(open) => !open && setSelectedSession(null)}>
            <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-lavender-50 border-2 border-blue-100 rounded-[32px] p-0">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-100 rounded-t-[32px] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900">
                      {language === 'th' ? 'รายละเอียดการสแกน' : language === 'en' ? 'Scan Details' : '扫描详情'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">{selectedSession.date}</p>
                      <span className="text-gray-400">•</span>
                      <p className="text-sm text-gray-600">{selectedSession.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-full bg-gradient-to-br from-pink-100 to-lavender-100">
                      <span className="bg-gradient-to-br from-pink-600 to-lavender-600 bg-clip-text text-transparent font-semibold">
                        {language === 'th' ? 'คะแนน' : language === 'en' ? 'Score' : '分数'} {selectedSession.score}
                      </span>
                    </div>
                    {selectedSession.improvement !== '0' && (
                      <Badge className="bg-mint-100 text-mint-700 border-0">
                        {selectedSession.improvement}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Image Viewer */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <motion.div 
                    key={selectedImageIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-[3/4] rounded-[24px] overflow-hidden bg-gray-100"
                  >
                    <ImageWithFallback
                      src={selectedSession.photos[imageAngles[selectedImageIndex]]}
                      alt={`${getAngleLabel(imageAngles[selectedImageIndex])} view`}
                      className="w-full h-full object-cover"
                    />
                    {/* Angle Label */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                      <span className="text-gray-800 font-medium">
                        {getAngleLabel(imageAngles[selectedImageIndex])}
                      </span>
                    </div>
                  </motion.div>

                  {/* Image Navigation */}
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : imageAngles.length - 1))}
                      className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 w-10 h-10 p-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    
                    {/* Thumbnail Selector */}
                    <div className="flex gap-2">
                      {imageAngles.map((angle, index) => (
                        <button
                          key={angle}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative w-16 h-20 rounded-[12px] overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-pink-500 scale-110'
                              : 'border-gray-200 hover:border-lavender-300'
                          }`}
                        >
                          <ImageWithFallback
                            src={selectedSession.photos[angle]}
                            alt={getAngleLabel(angle)}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1">
                            <p className="text-[8px] text-white text-center font-medium">
                              {getAngleLabel(angle)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImageIndex((prev) => (prev < imageAngles.length - 1 ? prev + 1 : 0))}
                      className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 w-10 h-10 p-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                <Card className="bg-white rounded-[24px] p-5 border border-blue-100">
                  <h4 className="text-gray-900 mb-4">
                    {language === 'th' ? 'ผลการวิเคราะห์' : language === 'en' ? 'Analysis Results' : '分析结果'}
                  </h4>
                  <div className="space-y-4">
                    {metricKeys.map((metricKey) => {
                      const metricValue = selectedSession.metrics[metricKey];
                      const metricLabels = {
                        wrinkles: t.wrinkles,
                        sagging: t.sagging,
                        darkSpots: t.darkSpots,
                        acne: t.acne,
                        redness: t.redness,
                        pores: t.pores,
                        skinEvenness: t.skinEvenness,
                      };
                      const metricLabel = metricLabels[metricKey];

                      return (
                        <div key={metricKey} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{metricLabel}</span>
                            <span className={`text-sm font-semibold bg-gradient-to-br ${getScoreColor(metricValue)} bg-clip-text text-transparent`}>
                              {metricValue}
                            </span>
                          </div>
                          <Progress value={metricValue} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Overall Summary */}
                <Card className="bg-gradient-to-br from-lavender-100 via-pink-100 to-peach-100 border-0 rounded-[24px] p-5 text-center">
                  <div className="mb-3">
                    <div className={`text-4xl font-bold bg-gradient-to-br ${getScoreColor(selectedSession.score)} bg-clip-text text-transparent`}>
                      {selectedSession.score}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === 'th' ? 'คะแนนรวม' : language === 'en' ? 'Overall Score' : '总分'}
                    </p>
                  </div>
                  {selectedSession.improvement !== '0' && (
                    <Badge className="bg-white/80 text-mint-700 border-0">
                      {language === 'th' ? 'ปรับปรุง' : language === 'en' ? 'Improvement' : '改善'} {selectedSession.improvement}
                    </Badge>
                  )}
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
