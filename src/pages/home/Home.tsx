import React from 'react';
import { IonPage, IonContent, IonFooter, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

/* Ajuste os imports de imagem conforme sua estrutura */
import logoPrefeitura from '../../assets/logo-prefeitura.jpg';
import logoDobanner from '../../assets/LogoFlordacidade.svg';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage className="page-container">
      {/* 
        IonContent com o fundo + overlay.
        Dentro dele, posicionamos a logo da prefeitura (top-left)
        e a circunferência centralizada (absoluta).
      */}
      <IonContent className="main-content">
        {/* 1) Logo da prefeitura no canto superior esquerdo */}
        <div className="logo-prefeitura-container">
          <a
            href="https://www2.recife.pe.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logoPrefeitura}
              alt="Logo Prefeitura"
              className="logo-prefeitura"
            />
          </a>
        </div>

        {/* 2) Circunferência no centro (posição absoluta), com a logo do banner */}
        <div className="borda-arredondada-banner">
          <img
            src={logoDobanner}
            alt="Banner Projeto"
            className="banner-projeto"
          />
        </div>
      </IonContent>

      {/* 
        3) IonFooter no rodapé, com a onda (wave) e os botões.
           A onda fica no topo do footer; em seguida, a "white-box" com botões.
      */}
      <IonFooter className="footer-container">
        <div className="wave-container">
          <svg
            className="wave-bottom"
            viewBox="0 0 450 150"
            preserveAspectRatio="none"
          >
            <path
              className="wavePath"
              d="M0,49 C150,150 349,0 500,49 L500,0 L0,0 Z"
            />
          </svg>
        </div>

        <div className="white-box">
          <IonButton
            className="botao-entrar"
            onClick={() => history.push('/cadastroresponsavel')}
          >
            Entrar
          </IonButton>
          <IonButton
            className="botao-convidado"
            onClick={() => history.push('/servicos')}
          >
            Entrar como convidado
          </IonButton>

          <p
            className="cadastro-text"
            onClick={() => history.push('/cadastroresponsavel')}
          >
            Não tem conta? <span>Cadastre-se</span>
          </p>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Home;
