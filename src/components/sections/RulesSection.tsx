import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface Rule {
  id: number;
  title: string;
  content: string;
}

const RulesSection = () => {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    const savedRules = localStorage.getItem('darkHavenRules');
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    } else {
      const defaultRules = [
        {
          id: 1,
          title: 'Основные правила поведения',
          content: 'Уважайте других игроков. Запрещены любые формы дискриминации, оскорблений и токсичного поведения.'
        },
        {
          id: 2,
          title: 'Правила ролевой игры',
          content: 'Играйте в соответствии с выбранной ролью. Помните о реализме действий вашего персонажа.'
        },
        {
          id: 3,
          title: 'Метагейминг',
          content: 'Запрещено использование информации, полученной вне игры, для принятия решений в игре.'
        },
        {
          id: 4,
          title: 'Гриферство',
          content: 'Запрещены действия, направленные на порчу игрового опыта других игроков без ролевой причины.'
        },
        {
          id: 5,
          title: 'Администрация',
          content: 'Решения администрации окончательны. При несогласии обращайтесь в Discord сервера.'
        }
      ];
      setRules(defaultRules);
      localStorage.setItem('darkHavenRules', JSON.stringify(defaultRules));
    }
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold glow-cyan mb-2">Правила</h2>
        <p className="text-muted-foreground">Правила поведения на сервере Dark Haven</p>
      </div>

      <Card className="bg-card/50 border-primary/30 backdrop-blur-sm mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3 text-sm text-muted-foreground">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <p>
              Незнание правил не освобождает от ответственности. Пожалуйста, внимательно ознакомьтесь 
              со всеми правилами перед началом игры на сервере.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="bg-card/50 border-border backdrop-blur-sm hover:border-accent transition-all duration-300">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                  {rule.id}
                </div>
                <CardTitle className="text-lg">{rule.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{rule.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RulesSection;
