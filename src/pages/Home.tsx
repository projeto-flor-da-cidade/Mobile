import { IonContent, IonPage, IonButton, IonModal } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import logoPrefeitura from '../assets/logo-prefeitura.png';
import logoProjeto from '../assets/logo-projeto.png';
import bannerProjeto from '../assets/banner-pricipal.svg';

const Home: React.FC = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  return (
    <IonPage className="BakgroundPagina">
      <IonContent className="ion-padding centralizar-conteudo BakgroundPagina">
        <div className="header-logos">
          {/* Logo Prefeitura: redireciona para um site */}
          <a href="https://www2.recife.pe.gov.br/" target="_blank" rel="noopener noreferrer">
            <img src={logoPrefeitura} alt="Logo Prefeitura" className="logo-prefeitura" />
          </a>
          {/* Logo Projeto: imagem que abre o modal */}
          <img 
            src={logoProjeto} 
            alt="Logo Projeto" 
            className="logo-projeto" 
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }} 
          />
        </div>

        <div className="borda-arredondada-banner">
          <img src={bannerProjeto} alt="Banner Projeto" className="banner-projeto" />
        </div>
        <div className="caixa-inferior">
          <div className="borda-arredondada">
            <p className="titulo-login">Login:</p>
            <IonButton className="botao-personalizado" onClick={() => history.push('/cadastroresponsavel')}>
              Sou membro da secretaria
            </IonButton>
            <IonButton className="botao-personalizado" onClick={() => history.push('/serviços')}>
              Não sou membro da secretaria
            </IonButton>
          </div>
        </div>

        {/* Modal com os conteúdos */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent 
            className="ion-padding"
            style={{ textAlign: 'center', fontSize: '20px', fontFamily: 'Arial, sans-serif' }}
          >
            <h2>VISÃO</h2>
            <p>&nbsp;</p> {/* Espaço em branco para conteúdo futuro */}

            <h2>MISSÃO</h2>
            <p>
              Promover a agricultura urbana e desenvolvimento sustentável para a cidade, a partir da articulação, capacitação, fomento e execução de ações agroecológicas, que promovam uma mudança de paradigmas e a melhoria da qualidade de vida das pessoas com o envolvimento da população e o aproveitamento de áreas propícias ao cultivo.
            </p>

            <h2>PLANO DE AGROECOLOGIA URBANA</h2>
            <p>
              Implantação e apoio a 180 estruturas de produção, como hortas, pomares, roçados e hortas fitoterápicas e escolares;
            </p>
            <p>
              Desenvolvimento de parcerias com, no mínimo, 10 organizações sociais, acadêmicas e comunitárias por ano para projetos agroecológicos;
            </p>
            <p>
              Implantação da coleta de orgânicos e compostagem em 20 escolas municipais;
            </p>
            <p>
              Construção da política de agroecologia urbana do Recife.
            </p>

            <IonButton onClick={() => setShowModal(false)}>Fechar</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
