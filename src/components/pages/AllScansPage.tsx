import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useLanguage } from '../../contexts/LanguageContext';

interface AllScansPageProps {
  onBack: () => void;
  onViewScanDetail?: (scanId: number) => void;
}

type FilterType = 'all' | 'thisWeek' | 'thisMonth' | 'last3Months';

export function AllScansPage({ onBack, onViewScanDetail }: AllScansPageProps) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Mock data - รายการสแกนทั้งหมด
  const allScans = [
    {
      id: 1,
      date: `${t.today} 9:30 ${t.am}`,
      score: 87,
      improvement: '+2',
      thumbnail: '🌸',
      topIssue: t.excellentHydration,
      category: 'thisWeek'
    },
    {
      id: 2,
      date: `${t.yesterday} 8:15 ${t.am}`,
      score: 85,
      improvement: '+1',
      thumbnail: '🌺',
      topIssue: t.goodTexture,
      category: 'thisWeek'
    },
    {
      id: 3,
      date: t.language === 'th' ? '12 ต.ค. 2025' : t.language === 'en' ? 'Oct 12, 2025' : '2025年10月12日',
      score: 84,
      improvement: '+2',
      thumbnail: '🌼',
      topIssue: t.elasticityImproved,
      category: 'thisWeek'
    },
    {
      id: 4,
      date: t.language === 'th' ? '10 ต.ค. 2025' : t.language === 'en' ? 'Oct 10, 2025' : '2025年10月10日',
      score: 82,
      improvement: '0',
      thumbnail: '🌻',
      topIssue: t.steady,
      category: 'thisWeek'
    },
    {
      id: 5,
      date: t.language === 'th' ? '7 ต.ค. 2025' : t.language === 'en' ? 'Oct 7, 2025' : '2025年10月7日',
      score: 82,
      improvement: '+1',
      thumbnail: '🌷',
      topIssue: t.language === 'th' ? 'ผิวนุ่มขึ้น' : t.language === 'en' ? 'Smoother skin' : '皮肤更光滑',
      category: 'thisMonth'
    },
    {
      id: 6,
      date: t.language === 'th' ? '5 ต.ค. 2025' : t.language === 'en' ? 'Oct 5, 2025' : '2025年10月5日',
      score: 81,
      improvement: '+2',
      thumbnail: '🏵️',
      topIssue: t.language === 'th' ? 'รูขุมขนดีขึ้น' : t.language === 'en' ? 'Pores improved' : '毛孔改善',
      category: 'thisMonth'
    },
    {
      id: 7,
      date: t.language === 'th' ? '3 ต.ค. 2025' : t.language === 'en' ? 'Oct 3, 2025' : '2025年10月3日',
      score: 79,
      improvement: '+1',
      thumbnail: '🌹',
      topIssue: t.language === 'th' ? 'ความชุ่มชื้นดี' : t.language === 'en' ? 'Good moisture' : '水分充足',
      category: 'thisMonth'
    },
    {
      id: 8,
      date: t.language === 'th' ? '1 ต.ค. 2025' : t.language === 'en' ? 'Oct 1, 2025' : '2025年10月1日',
      score: 78,
      improvement: '+3',
      thumbnail: '💐',
      topIssue: t.language === 'th' ? 'ลดรอยแดง' : t.language === 'en' ? 'Less redness' : '减少红肿',
      category: 'thisMonth'
    },
    {
      id: 9,
      date: t.language === 'th' ? '28 ก.ย. 2025' : t.language === 'en' ? 'Sep 28, 2025' : '2025年9月28日',
      score: 75,
      improvement: '+2',
      thumbnail: '🌾',
      topIssue: t.language === 'th' ? 'ความยืดหยุ่น' : t.language === 'en' ? 'Elasticity' : '弹性',
      category: 'last3Months'
    },
    {
      id: 10,
      date: t.language === 'th' ? '25 ก.ย. 2025' : t.language === 'en' ? 'Sep 25, 2025' : '2025年9月25日',
      score: 73,
      improvement: '+1',
      thumbnail: '🍀',
      topIssue: t.language === 'th' ? 'สีผิวสม่ำเสมอ' : t.language === 'en' ? 'Even tone' : '色调均匀',
      category: 'last3Months'
    },
    {
      id: 11,
      date: t.language === 'th' ? '20 ก.ย. 2025' : t.language === 'en' ? 'Sep 20, 2025' : '2025年9月20日',
      score: 72,
      improvement: '0',
      thumbnail: '🪴',
      topIssue: t.language === 'th' ? 'คงที่' : t.language === 'en' ? 'Stable' : '稳定',
      category: 'last3Months'
    },
    {
      id: 12,
      date: t.language === 'th' ? '15 ก.ย. 2025' : t.language === 'en' ? 'Sep 15, 2025' : '2025年9月15日',
      score: 72,
      improvement: '+2',
      thumbnail: '🌿',
      topIssue: t.language === 'th' ? 'เนื้อผิวดี' : t.language === 'en' ? 'Good texture' : '质地良好',
      category: 'last3Months'
    },
  ];

  // Filter scans based on selected filter
  const filteredScans = filterType === 'all' 
    ? allScans 
    : allScans.filter(scan => scan.category === filterType);

  // Calculate statistics
  const totalScans = filteredScans.length;
  const averageScore = Math.round(
    filteredScans.reduce((sum, scan) => sum + scan.score, 0) / totalScans
  );
  const improvementCount = filteredScans.filter(
    scan => scan.improvement !== '0' && scan.improvement.startsWith('+')
  ).length;

  return (
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
                <h2 className="text-gray-800">{t.allScans}</h2>
                <p className="text-xs text-gray-500">{totalScans} {t.scans}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-5"
      >
        <div className="grid grid-cols-4 gap-2.5">
          <Card className="bg-gradient-to-br from-blue-50 to-lavender-50 border-blue-100 rounded-[24px] p-3.5 text-center">
            <div className="text-2xl text-blue-600 mb-1">{totalScans}</div>
            <p className="text-xs text-gray-600 leading-tight">{t.totalScans}</p>
          </Card>
          <Card className="bg-gradient-to-br from-pink-50 to-peach-50 border-pink-100 rounded-[24px] p-3.5 text-center">
            <div className="text-2xl text-pink-600 mb-1">{averageScore}</div>
            <p className="text-xs text-gray-600 leading-tight">{t.avgScore}</p>
          </Card>
          <Card className="bg-gradient-to-br from-lavender-50 to-purple-50 border-lavender-100 rounded-[24px] p-3.5 text-center">
            <div className="text-2xl text-lavender-600 mb-1">87</div>
            <p className="text-xs text-gray-600 leading-tight">{t.latestScore}</p>
          </Card>
          <Card className="bg-gradient-to-br from-mint-50 to-green-50 border-mint-100 rounded-[24px] p-3.5 text-center">
            <div className="text-2xl text-mint-600 mb-1">+{improvementCount}</div>
            <p className="text-xs text-gray-600 leading-tight">{t.improved}</p>
          </Card>
        </div>
      </motion.div>

      {/* Filter Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="px-6 mb-5"
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-10 h-10 rounded-full bg-lavender-50 flex items-center justify-center hover:bg-lavender-100 transition-colors cursor-pointer shadow-cute-sm hover:shadow-cute-md active:scale-95 transition-transform"
          >
            <Filter className="w-5 h-5 text-lavender-600" />
          </button>
          <Select 
            value={filterType} 
            onValueChange={(value) => setFilterType(value as FilterType)}
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <SelectTrigger className="flex-1 rounded-[20px] border-lavender-200 focus:border-lavender-400 h-12 bg-white shadow-cute-sm hover:shadow-cute-md transition-shadow">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTime}</SelectItem>
              <SelectItem value="thisWeek">{t.thisWeek}</SelectItem>
              <SelectItem value="thisMonth">{t.thisMonth}</SelectItem>
              <SelectItem value="last3Months">{t.last3Months}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Scans List */}
      <div className="px-6 space-y-3">
        {filteredScans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">{t.noScansFound}</p>
          </motion.div>
        ) : (
          filteredScans.map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.03 }}
            >
              <Card
                onClick={() => onViewScanDetail?.(scan.id)}
                className="bg-white rounded-[28px] p-4 shadow-cute-md border border-blue-100 hover:shadow-cute-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-pink-100 via-lavender-100 to-blue-100 flex items-center justify-center text-3xl shadow-cute-sm flex-shrink-0">
                    {scan.thumbnail}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-800 font-medium truncate">{scan.date}</p>
                      {scan.improvement !== '0' && (
                        <Badge className="bg-mint-100 text-mint-700 border-0 text-xs font-semibold flex-shrink-0">
                          {scan.improvement}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{scan.topIssue}</p>
                  </div>

                  {/* Score */}
                  <div className="text-center flex-shrink-0">
                    <div className="text-xl bg-gradient-to-br from-pink-500 to-lavender-500 bg-clip-text text-transparent font-semibold">
                      {scan.score}
                    </div>
                    <p className="text-xs text-gray-400">{t.score}</p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-pink-300 flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6 py-6 text-center"
      >
        <div className="bg-white rounded-[28px] p-5 shadow-cute-md border border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <p className="text-gray-700 font-medium">{t.keepTracking}</p>
          </div>
          <p className="text-sm text-gray-500">
            {t.language === 'th' 
              ? 'สแกนใบหน้าสม่ำเสมอเพื่อติดตามความก้าวหน้า' 
              : t.language === 'en' 
              ? 'Scan regularly to track your progress' 
              : '定期扫描以跟踪您的进展'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
