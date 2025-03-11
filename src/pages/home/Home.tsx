import React, { useRef, useState } from 'react';
import { 
  IonPage, 
  IonContent, 
  IonFooter, 
  IonButton, 
  IonModal, 
  IonHeader, 
  IonToolbar, 
  IonTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInputPasswordToggle
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

/* Ajuste os imports de imagem conforme sua estrutura */
import logoPrefeitura from '../../assets/logo-prefeitura.jpg';
import logoDobanner from '../../assets/LogoFlordacidade.svg';

const Home: React.FC = () => {
  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);

  // Estados para os inputs do modal
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [salvar, setSalvar] = useState(false);

  const handleEntrar = () => {
    console.log('Dados do modal:', { cpf, senha, salvar });
    if (modal.current) {
      modal.current.dismiss();
    }
    history.push('/servicos');
  };

  const handleCancelar = () => {
    if (modal.current) {
      modal.current.dismiss();
    }
  };

  return (
    <IonPage className="page-container">
      <IonContent className="main-content">
        {/* Logo da prefeitura no canto superior esquerdo */}
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
        
        {/* Circunferência central com a logo do banner */}
        <div className="borda-arredondada-banner">
          <img
            src={logoDobanner}
            alt="Banner Projeto"
            className="banner-projeto"
          />
        </div>
      </IonContent>

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
          {/* Botão que dispara o modal */}
          <IonButton id="open-modal" className="botao-entrar">
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

      {/* IonModal com classe custom-modal para isolar os estilos */}
      <IonModal 
        ref={modal} 
        className="custom-modal"
        trigger="open-modal" 
        initialBreakpoint={1} 
        breakpoints={[0, 1]}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Insira os dados</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {/* Envolvemos o conteúdo do modal em um bloco */}
          <div className="block">
            <IonItem>
              <IonLabel position="floating">CPF</IonLabel>
              <IonInput
                value={cpf}
                placeholder="ex: 123.456.789-00"
                onIonChange={e => setCpf(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Senha</IonLabel>
              <IonInput
                value={senha}
                type="password"
                placeholder="Senha"
                onIonChange={e => setSenha(e.detail.value!)}
                
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
              

            </IonItem>

            <IonItem lines="none">
              <IonLabel>Deseja salvar os dados?</IonLabel>
              <IonCheckbox
                slot="start"
                checked={salvar}
                onIonChange={e => setSalvar(e.detail.checked)}
              />
            </IonItem>
            <div className="modal-buttons">
              <IonButton color="danger" onClick={handleCancelar}>
                Cancelar
              </IonButton>
              <IonButton color="success" onClick={handleEntrar}>
                Entrar
              </IonButton>
            </div>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Home;
