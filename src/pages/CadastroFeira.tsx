import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
} from '@ionic/react';

const CadastroFeira: React.FC = () => {
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [nomeFeira, setNomeFeira] = useState('');
  const [quantidadeBanca, setQuantidadeBanca] = useState('');
  const [enderecoFeira, setEnderecoFeira] = useState('');
  const [nomeHorta, setNomeHorta] = useState('');
  const [tipoCultivo, setTipoCultivo] = useState('');
  const [enderecoHorta, setEnderecoHorta] = useState('');
  const [horarioAtendimento, setHorarioAtendimento] = useState('');
  const [faleMais, setFaleMais] = useState('');
  const [placeholder, setPlaceholder] = useState('Fale aqui sobre sua feira ou horta.');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de Feira ou Horta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Nome do Responsável */}
        <IonItem>
          <IonLabel position="floating">Nome do Responsável</IonLabel>
          <IonInput
            value={nomeResponsavel}
            onIonChange={(e) => setNomeResponsavel(e.detail.value!)}
          />
        </IonItem>

        {/* Logradouro */}
        <IonItem>
          <IonLabel position="floating">Logradouro</IonLabel>
          <IonSelect
            value={logradouro}
            onIonChange={(e) => setLogradouro(e.detail.value)}
          >
            <IonSelectOption value="feira">Feira</IonSelectOption>
            <IonSelectOption value="horta">Horta</IonSelectOption>
          </IonSelect>
        </IonItem>

        {/* Campos adicionais para Feira */}
        {logradouro === 'feira' && (
          <>
            <IonItem>
              <IonLabel position="floating">Nome da Feira</IonLabel>
              <IonInput
                value={nomeFeira}
                onIonChange={(e) => setNomeFeira(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Quantidade de Bancas</IonLabel>
              <IonInput
                type="number"
                value={quantidadeBanca}
                onIonChange={(e) => setQuantidadeBanca(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Endereço da Feira</IonLabel>
              <IonInput
                value={enderecoFeira}
                onIonChange={(e) => setEnderecoFeira(e.detail.value!)}
              />
            </IonItem>
          </>
        )}

        {/* Campos adicionais para Horta */}
        {logradouro === 'horta' && (
          <>
            <IonItem>
              <IonLabel position="floating">Nome da Horta</IonLabel>
              <IonInput
                value={nomeHorta}
                onIonChange={(e) => setNomeHorta(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Tipo de Cultivo</IonLabel>
              <IonInput
                value={tipoCultivo}
                onIonChange={(e) => setTipoCultivo(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Endereço da Horta</IonLabel>
              <IonInput
                value={enderecoHorta}
                onIonChange={(e) => setEnderecoHorta(e.detail.value!)}
              />
            </IonItem>
          </>
        )}

        {/* Horário de Atendimento */}
        <IonItem>
          <IonLabel position="floating">Horário de Atendimento</IonLabel>
          <IonInput
            value={horarioAtendimento}
            onIonChange={(e) => setHorarioAtendimento(e.detail.value!)}
          />
        </IonItem>

        {/* Fale Mais */}
        <IonItem>
          <IonLabel position="stacked">Fale Mais Sobre</IonLabel>
          <IonTextarea
            value={faleMais}
            placeholder={placeholder}
            onIonChange={(e) => setFaleMais(e.detail.value!)}
            onFocus={() => setPlaceholder('')}
            onBlur={() =>
              faleMais.trim() === '' && setPlaceholder('Fale aqui sobre sua feira ou horta.')
            }
          />
        </IonItem>

        {/* Botão de Enviar */}
        <IonButton expand="block">Enviar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CadastroFeira;


