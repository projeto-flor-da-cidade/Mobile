import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Sitio.css'; // Importação do CSS separado

const Sitio: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sítio Natan Vale</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding centralizar-botoes ion-content-custom">
                <div className="caixa-destaque">
                    <h1>Sítio Natan Vale</h1>
                </div>
                <div className="button-container">
                    <IonButton expand="block" className="botao-personalizado">Fotos do Sítio</IonButton>
                    <IonButton expand="block" className="botao-personalizado">Agende sua visita ao Sítio</IonButton>
                </div>
                <div className="voltar-button">
                    <IonButton expand="block" className="botao-personalizado" onClick={() => history.goBack()}>
                        Voltar
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Sitio;
