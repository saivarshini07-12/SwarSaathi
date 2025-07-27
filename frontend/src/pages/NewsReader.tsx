import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Newspaper, Play, Pause, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MurfService } from '../services/MurfService';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
}

const NewsReader: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState('headlines');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNews, setCurrentNews] = useState<NewsItem | null>(null);

  // Mock news data
  const newsData: Record<string, NewsItem[]> = {
    today: [
      {
        id: '1',
        title: 'Technology Breakthrough in Healthcare',
        summary: 'Scientists develop new AI-powered diagnostic tool that can detect diseases earlier than traditional methods.',
        category: 'health',
        date: 'Today'
      },
      {
        id: '2',
        title: 'Economic Growth Shows Positive Trends',
        summary: 'Latest economic indicators suggest steady growth across multiple sectors.',
        category: 'business',
        date: 'Today'
      },
      {
        id: '3',
        title: 'Weather Update: Clear Skies Expected',
        summary: 'Meteorological department forecasts pleasant weather for the week ahead.',
        category: 'weather',
        date: 'Today'
      }
    ],
    yesterday: [
      {
        id: '4',
        title: 'Local Community Initiative Launched',
        summary: 'New program aims to support elderly residents with daily activities and healthcare.',
        category: 'local',
        date: 'Yesterday'
      },
      {
        id: '5',
        title: 'Sports Championship Results',
        summary: 'Local team advances to finals after exciting victory in semi-final match.',
        category: 'sports',
        date: 'Yesterday'
      }
    ]
  };

  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' }
  ];

  const categoryOptions = [
    { value: 'headlines', label: 'Headlines' },
    { value: 'health', label: 'Health' },
    { value: 'business', label: 'Business' },
    { value: 'sports', label: 'Sports' },
    { value: 'weather', label: 'Weather' }
  ];

  const getFilteredNews = () => {
    const news = newsData[selectedDate] || [];
    if (selectedCategory === 'headlines') {
      return news;
    }
    return news.filter(item => item.category === selectedCategory);
  };

  const handlePlayNews = async (newsItem: NewsItem) => {
    if (isPlaying && currentNews?.id === newsItem.id) {
      setIsPlaying(false);
      setCurrentNews(null);
      return;
    }

    setCurrentNews(newsItem);
    setIsPlaying(true);

    const newsText = `Here is today's news. ${newsItem.title}. ${newsItem.summary}`;
    await MurfService.playText(newsText, currentLanguage.code);
    
    setIsPlaying(false);
    setCurrentNews(null);
  };

  const handlePlayAllNews = async () => {
    const news = getFilteredNews();
    if (news.length === 0) return;

    setIsPlaying(true);
    
    let allNewsText = `Here are the ${selectedCategory} for ${selectedDate}. `;
    news.forEach((item, index) => {
      allNewsText += `Story ${index + 1}: ${item.title}. ${item.summary}. `;
    });

    await MurfService.playText(allNewsText, currentLanguage.code);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center p-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-4"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <Newspaper className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{t('newsReader')}</h1>
              <p className="text-sm text-gray-600">Listen to latest news</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Play All Button */}
            <button
              onClick={handlePlayAllNews}
              disabled={isPlaying}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              <span>{isPlaying ? 'Playing...' : 'Play All News'}</span>
            </button>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {getFilteredNews().map(newsItem => (
              <div key={newsItem.id} className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => handlePlayNews(newsItem)}
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isPlaying && currentNews?.id === newsItem.id
                        ? 'bg-red-100 hover:bg-red-200'
                        : 'bg-blue-100 hover:bg-blue-200'
                    }`}
                  >
                    {isPlaying && currentNews?.id === newsItem.id ? (
                      <Pause className="text-red-600" size={20} />
                    ) : (
                      <Play className="text-blue-600" size={20} />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {newsItem.category}
                      </span>
                      <span className="text-xs text-gray-500">{newsItem.date}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{newsItem.title}</h3>
                    <p className="text-sm text-gray-600">{newsItem.summary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getFilteredNews().length === 0 && (
            <div className="text-center py-12">
              <Newspaper className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-gray-600">No news available</p>
              <p className="text-sm text-gray-500">Try selecting a different date or category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsReader;