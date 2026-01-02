import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

const WikiSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<Record<string, string>>({});

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

  const handleItemClick = (item: string) => {
    setSelectedPage(item);
    const saved = localStorage.getItem(`darkHavenWiki_${item}`);
    if (saved) {
      setPageContent(prev => ({ ...prev, [item]: saved }));
    } else {
      setPageContent(prev => ({ 
        ...prev, 
        [item]: `# ${item}\n\nЭто страница про ${item}. Содержимое можно редактировать через админ-панель.` 
      }));
    }
  };

  if (selectedPage) {
    return (
      <div className="animate-fade-in">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedPage(null)}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Назад к категориям
          </Button>
          <h2 className="text-4xl font-bold glow-cyan mb-2">{selectedPage}</h2>
          <p className="text-muted-foreground">Информация из вики Dark Haven</p>
        </div>

        <Card className="bg-card/50 border-border backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {pageContent[selectedPage] || `Содержимое страницы "${selectedPage}" пока не добавлено.`}
              </div>
            </div>
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
                    className="flex items-center space-x-2 text-muted-foreground hover:text-primary cursor-pointer transition-all hover:translate-x-2"
                  >
                    <Icon name="ChevronRight" size={16} />
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
