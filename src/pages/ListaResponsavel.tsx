import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import axios from 'axios';

const ListarResponsaveis: React.FC = () => {
  const [responsaveis, setResponsaveis] = useState<any[]>([]);

  const fetchResponsaveis = async () => {
    try {
      const response = await axios.get('http://localhost:8080/responsavel'); // Substitua pela URL correta do backend
      setResponsaveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Listar Responsáveis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Botão para buscar responsáveis */}
        <IonButton expand="block" onClick={fetchResponsaveis}>
          Listar Responsáveis
        </IonButton>

        {/* Lista de responsáveis */}
        <IonList>
          {responsaveis.map((responsavel, index) => (
            <IonItem key={index}>
              <IonLabel>
                <h2>Nome: {responsavel.nome}</h2>
                <p>Email: {responsavel.email}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListarResponsaveis;