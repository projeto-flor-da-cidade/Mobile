import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton,
  IonProgressBar,
  IonImg,
} from "@ionic/react";
import { menuOutline, personCircleOutline } from "ionicons/icons";
import "./Cursos.css";

const Cursos: React.FC = () => {
  return (
    <IonPage>
      {/* HEADER COM SLOTS */}
      <IonHeader>
        <IonToolbar color="light" className="toolbar-custom">
          <IonButtons slot="start">
            <IonIcon icon={menuOutline} className="icon-menu" />
          </IonButtons>

          <IonTitle className="header-title">Meus Cursos</IonTitle>

          <IonButtons slot="end">
            <IonIcon icon={personCircleOutline} className="icon-user" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="background-custom">
        {/* Seção: Cursos com seu interesse */}
        <div className="interesses-container">
          <h2 className="section-title">Cursos com seu interesse:</h2>
          <div className="carousel">
            {[1, 2].map((_, index) => (
              <IonCard className="curso-card" key={index}>
                <IonCardContent>
                  <h3 className="curso-titulo">Curso de xxxx</h3>
                  <IonImg
                    src="/assets/imagem-exemplo.jpg"
                    alt="Imagem do curso"
                    className="curso-img"
                    onError={(e: any) => (e.target.style.display = "none")}
                  />
                  <IonButton expand="full" className="ver-mais">
                    Ver mais
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        </div>

        {/* Seção: Processos de inscrição */}
        <div className="inscricao-container">
          <h2 className="section-title">Processos de inscrição:</h2>
          {[{ etapa: 2, total: 4, progresso: 0.5 }, { etapa: 1, total: 4, progresso: 0.25 }].map(
            (item, index) => (
              <IonCard className="inscricao-card" key={index}>
                <IonCardContent>
                  <h3 className="curso-titulo">Curso de xxxxxxxxxxxx</h3>
                  <IonImg
                    src="/assets/imagem-exemplo.jpg"
                    alt="Imagem do curso"
                    className="curso-img"
                    onError={(e: any) => (e.target.style.display = "none")}
                  />
                  <p className="inscricao-texto">
                    Etapa {item.etapa}/{item.total} para inscrição
                  </p>
                  <IonProgressBar value={item.progresso} className="progresso-bar"></IonProgressBar>
                </IonCardContent>
              </IonCard>
            )
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cursos;



