import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface WikiPage {
  title: string;
  content: string;
  category: string;
}

const WikiSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [wikiPages, setWikiPages] = useState<Record<string, WikiPage>>({});
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const wikiCategories = [
    {
      title: 'Профессии',
      icon: 'Briefcase',
      items: ['Инженер', 'Медик', 'Охрана', 'Ученый', 'Капитан']
    },
    {
      title: 'Механики',
      icon: 'Cog',
      items: ['Атмосфера', 'Энергосистемы', 'Производство', 'Медицина', 'Исследования']
    },
    {
      title: 'Предметы',
      icon: 'Package',
      items: ['Инструменты', 'Оружие', 'Медикаменты', 'Еда', 'Экипировка']
    },
    {
      title: 'Лор',
      icon: 'BookOpen',
      items: ['История станции', 'Фракции', 'Технологии', 'Галактика', 'События']
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenWikiPages');
    if (saved) {
      setWikiPages(JSON.parse(saved));
    } else {
      const defaultPages: Record<string, WikiPage> = {};
      wikiCategories.forEach(cat => {
        cat.items.forEach(item => {
          defaultPages[item] = {
            title: item,
            content: `# ${item}\n\nОписание для ${item}. Здесь будет подробная информация об этой теме.\n\n## Основная информация\n\nДобавьте сюда основную информацию.\n\n## Детали\n\nПодробности и детали.`,
            category: cat.title
          };
        });
      });
      setWikiPages(defaultPages);
    }
  }, []);

  const handleItemClick = (item: string) => {
    setSelectedPage(item);
    setIsEditingPage(false);
    setEditedContent(wikiPages[item]?.content || '');
  };

  const handleStartEdit = () => {
    setIsEditingPage(true);
    setEditedContent(wikiPages[selectedPage!]?.content || '');
  };

  const handleSaveEdit = () => {
    if (!selectedPage) return;
    
    const updatedPages = {
      ...wikiPages,
      [selectedPage]: {
        ...wikiPages[selectedPage],
        content: editedContent
      }
    };
    
    setWikiPages(updatedPages);
    localStorage.setItem('darkHavenWikiPages', JSON.stringify(updatedPages));
    setIsEditingPage(false);
  };

  if (selectedPage && wikiPages[selectedPage]) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedPage(null)}
            className="mb-4 hover:border-accent transition-all"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к категориям
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold glow-cyan mb-2">{wikiPages[selectedPage].title}</h2>
              <p className="text-muted-foreground">Категория: {wikiPages[selectedPage].category}</p>
            </div>
            
            {!isEditingPage ? (
              <Button onClick={handleStartEdit} className="hover:border-accent transition-all">
                <Icon name="Edit" size={16} className="mr-2" />
                Редактировать
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSaveEdit} variant="default">
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
                <Button onClick={() => setIsEditingPage(false)} variant="outline">
                  Отмена
                </Button>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardContent className="pt-6">
            {!isEditingPage ? (
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {wikiPages[selectedPage].content}
                </div>
              </div>
            ) : (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[500px] font-mono"
                placeholder="Введите содержимое страницы..."
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Вики</h2>
        <p className="text-muted-foreground">База знаний о мире Space Station 14</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по вики..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wikiCategories.map((category, index) => (
          <Card key={index} className="bg-card/50 border-border backdrop-blur-sm hover:border-accent transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Icon name={category.icon as any} size={24} className="text-accent" />
                <CardTitle>{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, idx) => (
                  <li 
                    key={idx} 
                    onClick={() => handleItemClick(item)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary cursor-pointer transition-all hover:translate-x-2 group"
                  >
                    <Icon name="ChevronRight" size={16} className="group-hover:text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WikiSection;