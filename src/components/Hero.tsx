import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-8 animate-float">
          <div className="inline-block p-8 rounded-full bg-primary/10 border-2 border-primary animate-pulse-glow">
            <Icon name="Rocket" size={80} className="text-primary" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-cyan animate-fade-in">
          DARK HAVEN
        </h1>

        <div className="text-xl md:text-2xl text-secondary mb-4 glow-purple">
          Space Station 14
        </div>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
          Dark Haven | Space Station 14 – это симуляция жизни в космосе, разворачивающаяся за пределами 
          космических станций. Проект ставит своей целью предоставить игрокам максимальную свободу 
          взаимодействия с окружающим миром, основанную на оригинальном лоре Space Station 14. 
          Мы стремимся расширить возможности игроков и превратить игру в масштабную MMO, 
          опираясь на лучшую сборку Frontier от MK.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="text-lg px-8 animate-pulse-glow">
            <Icon name="Play" size={20} className="mr-2" />
            Начать играть
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 border-secondary text-secondary hover:bg-secondary/10">
            <Icon name="Info" size={20} className="mr-2" />
            Узнать больше
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-primary transition-all duration-300">
            <Icon name="Users" size={40} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Сообщество</h3>
            <p className="text-muted-foreground">Присоединяйся к активному игровому сообществу</p>
          </div>

          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-secondary transition-all duration-300">
            <Icon name="Zap" size={40} className="text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Динамика</h3>
            <p className="text-muted-foreground">Постоянные обновления и новый контент</p>
          </div>

          <div className="p-6 rounded-lg bg-card/50 border border-border backdrop-blur-sm hover:border-accent transition-all duration-300">
            <Icon name="Globe" size={40} className="text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Свобода</h3>
            <p className="text-muted-foreground">Максимальная свобода действий в игре</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
