import React from 'react';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonCardTitle,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent as IonMenuContent,
  IonList,
  IonItem,
  IonMenuToggle,
  IonLabel,
  IonButton,
  IonFooter
} from '@ionic/react';
import { menuController } from '@ionic/core/components';
import {
  personCircleOutline,
  heartCircleOutline,
  newspaperOutline,
  personOutline,
  settingsOutline,
  exitOutline,
  earthOutline,
  pencilOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import logoProjeto from '../../assets/logo-projeto.png';
import './Servicos.css';

const Servicos: React.FC = () => {
  const history = useHistory();

  // Array de objetos com URL e título para cada card
  const cardsData = [
    { img: 'https://picsum.photos/300/200?random=1', title: 'Curso Cultiva Recife 1' },
    { img: 'https://picsum.photos/300/200?random=2', title: 'Curso Cultiva Recife 2' },
    { img: 'https://picsum.photos/300/200?random=3', title: 'Curso Cultiva Recife 3' },
    { img: 'https://picsum.photos/300/200?random=4', title: 'Curso Cultiva Recife 4' }
  ];

  // Função para abrir o menu manualmente
  const abrirMenu = async () => {
    await menuController.open('menu');
  };

  return (
    <>
      {/**
       * ION MENU (Overlay)
       * Fica FORA do IonPage, mas aponta para contentId="main-content" (que é o IonPage)
       */}
      <IonMenu side="start" menuId="menu" contentId="main-content" type="overlay">
        <IonHeader>
          <IonToolbar>
            {/* Container superior: ícone grande + nome do usuário */}
            <div className="menu-top-container">
              <IonIcon icon={personCircleOutline} className="menu-user-icon" />
              <IonText className="menu-username">Guest_836481</IonText>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonMenuContent>
          {/** Lista de funções (apenas "Cadastrar minha Horta/Feira" estará ativa) */}
          <IonList className="menu-list">
            {/* 1) Favoritos (desativado) */}
            <IonMenuToggle autoHide={false}>
              <IonItem lines="none" disabled button={false}>
                <IonIcon slot="start" icon={heartCircleOutline} color="Dark" />
                <IonLabel>Favoritos</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {/* 2) Cadastrar minha Horta/Feira (ativo -> vai para /cadastroequipamento) */}
            <IonMenuToggle autoHide={false}>
              <IonItem
                lines="none"
                button
                onClick={() => history.push('/cadastroequipamento')}
              >
                <IonIcon slot="start" icon={pencilOutline} color="Dark" />
                <IonLabel>Cadastrar minha Horta/Feira</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {/* 3) Meus cursos (desativado) */}
            <IonMenuToggle autoHide={false}>
              <IonItem lines="none" disabled button={false}>
                <IonIcon slot="start" icon={newspaperOutline} color="Dark" />
                <IonLabel>Meus cursos</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {/* 4) Minhas hortas e feiras (novo item, desativado) */}
            <IonMenuToggle autoHide={false}>
              <IonItem lines="none" disabled button={false}>
                <IonIcon slot="start" icon={earthOutline} color="Dark" />
                <IonLabel>Minhas hortas e feiras</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {/* 5) Meu perfil (desativado) */}
            <IonMenuToggle autoHide={false}>
              <IonItem lines="none" disabled button={false}>
                <IonIcon slot="start" icon={personOutline} color="Dark" />
                <IonLabel>Meu perfil</IonLabel>
              </IonItem>
            </IonMenuToggle>

            {/* 6) Configurações (desativado) */}
            <IonMenuToggle autoHide={false}>
              <IonItem lines="none" disabled button={false} className="menu-list-item">
                <IonIcon slot="start" icon={settingsOutline} color="Dark" />
                <IonLabel>Configurações</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonMenuContent>
        <IonFooter>
          {/** Rodapé do menu: dois "botões" lado a lado */}
          <div className="menu-footer">
            {/** Botão de sair (volta para a página anterior) */}
            <IonButton
              fill="clear"
              className="menu-exit-button"
              onClick={() => history.goBack()}
            >
              <IonIcon slot="start" icon={exitOutline} />
              Sair
            </IonButton>

            {/** Logo do projeto (ao clicar, vai para /info) */}
            <img
              src={logoProjeto}
              alt="Logo Projeto"
              className="logo-projeto clickable"
              onClick={() => history.push('/info')}
            />
          </div>
        </IonFooter>
      </IonMenu>

      {/** PÁGINA PRINCIPAL */}
      <IonPage id="main-content">
        <IonContent fullscreen>
          {/** Ícone de usuário no topo, alinhado à esquerda, com margem para não sobrepor o conteúdo */}
          <IonFab vertical="top" horizontal="start" style={{ marginTop: '2rem' }}>
            <IonFabButton onClick={abrirMenu}>
              <IonIcon icon={personCircleOutline} size="large" />
            </IonFabButton>
          </IonFab>

          {/** SEÇÃO 1: "Bem vindo..." + Ícones (Mapa, Cursos) */}
          <IonGrid className="sectionContainer" style={{ marginTop: '6rem' }}>
            <IonRow>
              <IonCol>
                <IonText className="titleText">
                  <h2>Bem vindo ao Projeto Flor da Cidade</h2>
                </IonText>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <div className="horizontalScroll">
                  {/** Ícone 1 (Mapa) */}
                  <div className="fabIconContainer">
                    <IonFabButton onClick={() => history.push('/mapa')}>
                      <IonIcon icon={personCircleOutline} size="large" />
                    </IonFabButton>
                    <IonText className="bodyText">Mapa Feiras/Hortas</IonText>
                  </div>

                  {/** Ícone 2 (Cursos) */}
                  <div className="fabIconContainer">
                    <IonFabButton>
                      <IonIcon icon={personCircleOutline} size="large" />
                    </IonFabButton>
                    <IonText className="bodyText">Cursos</IonText>
                  </div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/** SEÇÃO 2: "Outros Serviços SEAU" + IonCards */}
          <IonGrid className="sectionContainer">
            <IonRow>
              <IonCol>
                <IonText className="titleText">
                  <h2>Outros Serviços SEAU</h2>
                </IonText>
              </IonCol>
            </IonRow>

            {/** Cards em scroll horizontal */}
            <IonRow>
              <IonCol>
                <div className="horizontalScroll">
                  {cardsData.map((card, index) => (
                    <IonCard key={index} button className="customCard">
                      <img
                        src={card.img}
                        alt={`Imagem Card ${index + 1}`}
                        className="cardImage"
                      />
                      <IonCardTitle className="titleTextCard">
                        {card.title}
                      </IonCardTitle>
                    </IonCard>
                  ))}
                </div>
              </IonCol>
            </IonRow>

            {/** 5º IonCard - Destaque (fora do scroll horizontal) */}
            <IonRow>
              <IonCol>
                <IonCard
                  button
                  className="customCardDestaque"
                  onClick={() => history.push('/espaco')}
                >
                  <img
                    src="https://picsum.photos/300/200?random=5"
                    alt="Imagem Card Destaque"
                    className="cardImage"
                  />
                  <IonCardTitle className="titleTextCard">
                    Nossos espaços produtivos
                  </IonCardTitle>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/** Espaçamento extra no final (opcional) */}
          <div className="footerSpacing"></div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Servicos;
