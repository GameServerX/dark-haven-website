import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('darkHavenNews');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      const defaultNews = [
        {
          id: 1,
          title: 'Запуск сервера Dark Haven',
          content: 'Мы рады объявить о запуске нового сервера Dark Haven на базе Space Station 14!',
          date: '2025-01-03',
          author: 'Admin'
        },
        {
          id: 2,
          title: 'Обновление механик игры',
          content: 'Добавлены новые механики взаимодействия с окружающим миром и улучшена производительность.',
          date: '2025-01-02',
          author: 'Dev Team'
        }
      ];
      setNews(defaultNews);
      localStorage.setItem('darkHavenNews', JSON.stringify(defaultNews));
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Новости</h2>
        <p className="text-muted-foreground">Последние обновления и события на сервере</p>
      </div>

      <div className="space-y-6">
        {news.map(item => (
          <Card key={item.id} className="bg-card/50 border-border backdrop-blur-sm hover:border-primary transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon name="Newspaper" size={24} className="text-primary mt-1" />
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>
                      {new Date(item.date).toLocaleDateString('ru-RU')} • {item.author}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
