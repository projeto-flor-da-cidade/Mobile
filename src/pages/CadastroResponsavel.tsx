import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonLabel, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons'; // Ícones para o botão voltar


const CadastroResponsavel: React.FC = () => {
  const history = useHistory();
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
  const [cpfResponsavel, setCpfResponsavel] = useState('');
  const [emailResponsavel, setEmailResponsavel] = useState('');
  const [bairroResponsavel, setBairroResponsavel] = useState('');
  const [enderecoResponsavel, setEnderecoResponsavel] = useState('');

  return (
    <IonPage>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>Cadastro do Responsável</p>
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding BackgroundPagina">
        {/* Nome do Responsável */}
        <IonItem>
          <IonLabel position="floating">Nome do Responsável</IonLabel>
          <IonInput
            value={nomeResponsavel}
            onIonChange={(e) => setNomeResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Telefone do Responsável */}
        <IonItem>
          <IonLabel position="floating">Telefone do Responsável</IonLabel>
          <IonInput
            value={telefoneResponsavel}
            onIonChange={(e) => setTelefoneResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* CPF do Responsável */}
        <IonItem>
          <IonLabel position="floating">CPF do Responsável</IonLabel>
          <IonInput
            value={cpfResponsavel}
            onIonChange={(e) => setCpfResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Email do Responsável */}
        <IonItem>
          <IonLabel position="floating">Email do Responsável</IonLabel>
          <IonInput
            value={emailResponsavel}
            onIonChange={(e) => setEmailResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Bairro do Responsável */}
        <IonItem>
          <IonLabel position="floating">Bairro do Responsável</IonLabel>
          <IonInput
            value={bairroResponsavel}
            onIonChange={(e) => setBairroResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Endereço do Responsável */}
        <IonItem>
          <IonLabel position="floating">Endereço do Responsável</IonLabel>
          <IonInput
            value={enderecoResponsavel}
            onIonChange={(e) => setEnderecoResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Botão de Enviar */}
        <IonButton expand="block" onClick={() => history.push('/cadastroequipamento')}>Proximo</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CadastroResponsavel;