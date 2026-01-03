import { useEffect } from 'react';

const AIChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://timeweb.cloud/api/v1/cloud-ai/agents/a26d62cb-d2f5-437b-b097-8d32f04e6dec/embed.js?collapsed=true';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src*="timeweb.cloud"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      const chatWidget = document.querySelector('[data-timeweb-chat]');
      if (chatWidget) {
        chatWidget.remove();
      }
    };
  }, []);

  return null;
};

export default AIChat;
