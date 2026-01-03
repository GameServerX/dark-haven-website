import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  button1Text: string;
  button2Text: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
}

const EditableHero = ({ isEditing }: { isEditing: boolean }) => {
  const [content, setContent] = useState<HeroContent>({
    title: 'DARK HAVEN',
    subtitle: 'Space Station 14',
    description: 'Dark Haven | Space Station 14 – это симуляция жизни в космосе, разворачивающаяся за пределами космических станций. Проект ставит своей целью предоставить игрокам максимальную свободу взаимодействия с окружающим миром, основанную на оригинальном лоре Space Station 14. Мы стремимся расширить возможности игроков и превратить игру в масштабную MMO, опираясь на лучшую сборку Frontier от MK.',
    button1Text: 'Начать играть',
    button2Text: 'Узнать больше',
    feature1Title: 'Сообщество',
    feature1Desc: 'Присоединяйся к активному игровому сообществу',
    feature2Title: 'Динамика',
    feature2Desc: 'Постоянные обновления и новый контент',
    feature3Title: 'Свобода',
    feature3Desc: 'Максимальная свобода действий в игре'
  });

  const [localEdit, setLocalEdit] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkHavenHeroContent');
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('darkHavenHeroContent', JSON.stringify(content));
    setLocalEdit(false);
  };

  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        {isEditing && !localEdit && (
          <Button onClick={() => setLocalEdit(true)} className="mb-4">
            <Icon name="Edit" size={16} className="mr-2" />
            Редактировать Hero
          </Button>
        )}

        {localEdit ? (
          <div className="space-y-4 text-left max-w-4xl mx-auto mb-8">
            <Input value={content.title} onChange={(e) => setContent({...content, title: e.target.value})} placeholder="Заголовок" />
            <Input value={content.subtitle} onChange={(e) => setContent({...content, subtitle: e.target.value})} placeholder="Подзаголовок" />
            <Textarea value={content.description} onChange={(e) => setContent({...content, description: e.target.value})} placeholder="Описание" className="min-h-[150px]" />
            <div className="grid grid-cols-2 gap-4">
              <Input value={content.button1Text} onChange={(e) => setContent({...content, button1Text: e.target.value})} placeholder="Кнопка 1" />
              <Input value={content.button2Text} onChange={(e) => setContent({...content, button2Text: e.target.value})} placeholder="Кнопка 2" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Input value={content.feature1Title} onChange={(e) => setContent({...content, feature1Title: e.target.value})} placeholder="Фича 1" className="mb-2" /><Textarea value={content.feature1Desc} onChange={(e) => setContent({...content, feature1Desc: e.target.value})} /></div>
              <div><Input value={content.feature2Title} onChange={(e) => setContent({...content, feature2Title: e.target.value})} placeholder="Фича 2" className="mb-2" /><Textarea value={content.feature2Desc} onChange={(e) => setContent({...content, feature2Desc: e.target.value})} /></div>
              <div><Input value={content.feature3Title} onChange={(e) => setContent({...content, feature3Title: e.target.value})} placeholder="Фича 3" className="mb-2" /><Textarea value={content.feature3Desc} onChange={(e) => setContent({...content, feature3Desc: e.target.value})} /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>Сохранить</Button>
              <Button onClick={() => setLocalEdit(false)} variant="outline">Отмена</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 animate-float">
              <div className="">
                <Icon name="Rocket" size={80} className="text-primary" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold glow-cyan animate-fade-in my-[139px]">{content.title}</h1>
            <div className="text-xl md:text-2xl text-secondary mb-4 glow-purple">{content.subtitle}</div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">{content.description}</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="text-lg px-8 animate-pulse-glow">
                <Icon name="Play" size={20} className="mr-2" />
                {content.button1Text}
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-secondary text-secondary hover:bg-secondary/10">
                <Icon name="Info" size={20} className="mr-2" />
                {content.button2Text}
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-primary transition-all duration-300">
                <Icon name="Users" size={40} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{content.feature1Title}</h3>
                <p className="text-muted-foreground">{content.feature1Desc}</p>
              </div>

              <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-secondary transition-all duration-300">
                <Icon name="Zap" size={40} className="text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{content.feature2Title}</h3>
                <p className="text-muted-foreground">{content.feature2Desc}</p>
              </div>

              <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-accent transition-all duration-300">
                <Icon name="Globe" size={40} className="text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{content.feature3Title}</h3>
                <p className="text-muted-foreground">{content.feature3Desc}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EditableHero;