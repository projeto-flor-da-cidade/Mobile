import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem , IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Agroeco: React.FC = () => {
    const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Plano de Agroecologia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding  centralizar-botoes"
       style={{ '--background': '#316cae'}}>
        <div style={{ backgroundColor: 'lightgray', padding: '20px', margin: '20px', borderRadius: '10px' }}>
        <h1 style={{color:'blue'}}>PLANO DE AGROECOLOGIA URBANA

• Implantação e apoio a 180 estruturas de produção, como hortas, pomares, roçados e hortas fitoterápicas e escolares;

• Desenvolvimento de parcerias com, no mínimo, 10 organizações sociais, acadêmicas e comunitárias por ano para projetos agroecológicos;

• Implantação da coleta de orgânicos e compostagem em 20 escolas municipais;

• Construção da política de agroecologia urbana do Recife.
</h1>
      </div>
      <div className="voltar-button">
          <IonButton expand="block"  className="botao-personalizado" onClick={() => history.push('/info')}>
            Voltar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Agroeco;