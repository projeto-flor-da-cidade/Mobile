import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonIcon, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons'; 


const CadastroEquipamento: React.FC = () => {
  const history = useHistory();
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacaoEquipamento, setObservacaoEquipamento] = useState('');
  const [enderecoEquipamento, setEnderecoEquipamento] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const handleTipoEquipamentoChange = (e: CustomEvent) => {
    const value = e.detail.value;
    setTipoEquipamento(value);
    setPlaceholder(`Fale aqui sobre ${value === 'feira' ? 'a feira' : 'a horta'}.`);
  };

  return (
    <IonPage>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>Cadastro de Equipamento</p>
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding BackgroundPagina">
        {/* Nome do Equipamento */}
        <IonItem>
          <IonLabel position="floating">Nome do Equipamento</IonLabel>
          <IonInput
            value={nomeEquipamento}
            onIonChange={(e) => setNomeEquipamento(e.detail.value!)}
          />
        </IonItem>

        {/* Tipo do Equipamento */}
        <IonItem>
          <IonLabel position="floating">Tipo do Equipamento</IonLabel>
          <IonSelect
            value={tipoEquipamento}
            onIonChange={handleTipoEquipamentoChange}
          >
            <IonSelectOption value="feira">Feira</IonSelectOption>
            <IonSelectOption value="horta">Horta</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Quantidade */}
        {tipoEquipamento && (
          <IonItem>
            <IonLabel position="floating">{`Quantidade de ${tipoEquipamento === 'feira' ? 'Bancas' : 'Hortas'}`}</IonLabel>
            <IonInput
              type="number"
              value={quantidade}
              onIonChange={(e) => setQuantidade(e.detail.value!)}
            />
          </IonItem>
        )}

        {/* Observação do Equipamento */}
        {tipoEquipamento && (
          <IonItem>
            <IonLabel position="floating">Observação do Equipamento</IonLabel>
            <IonTextarea
              value={observacaoEquipamento}
              placeholder={placeholder}
              onIonChange={(e) => setObservacaoEquipamento(e.detail.value!)}
              onFocus={() => setPlaceholder('')}
              onBlur={() =>
                observacaoEquipamento.trim() === '' && setPlaceholder(`Fale aqui sobre ${tipoEquipamento === 'feira' ? 'a feira' : 'a horta'}.`)
              }
            />
          </IonItem>
        )}

        {/* Endereço do Equipamento */}
        <IonItem>
          <IonLabel position="floating">Endereço do Equipamento</IonLabel>
          <IonInput
            value={enderecoEquipamento}
            onIonChange={(e) => setEnderecoEquipamento(e.detail.value!)}
          />
        </IonItem>

        {/* Botão de Enviar */}
        <IonButton expand="block">Enviar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CadastroEquipamento;
