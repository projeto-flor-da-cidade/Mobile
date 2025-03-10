import { IonPage, IonContent } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import './AnimeInicial.css';
import bannerProjeto from '../../assets/banner-pricipal.svg';

const AnimeInicial: React.FC = () => {
  const history = useHistory();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Inicia a animação de fade out após 2,5 segundos
    const timer = setTimeout(() => setFadeOut(true), 2500);
    // Redireciona para a Home após 5 segundos (aguarda a transição lenta)
    const navigateTimer = setTimeout(() => history.replace('/home'), 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(navigateTimer);
    };
  }, [history]);

  return (
    <IonPage>
      <IonContent 
        className={`splash ${fadeOut ? 'fade-out' : ''}`}
        
      >
        <div className="borda-arredondada-banner">
          <img src={bannerProjeto} alt="Banner Projeto" className="banner-projeto" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AnimeInicial;
