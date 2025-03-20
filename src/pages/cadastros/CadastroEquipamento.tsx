import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonButton, IonToast, IonRadioGroup, IonRadio, IonSelect, IonSelectOption,
  IonButtons, IonIcon
} from '@ionic/react';
import { menuOutline, personCircleOutline } from 'ionicons/icons';
import ReCAPTCHA from 'react-google-recaptcha';
import './CadastroEquipamento.css';

const CadastroEquipamento: React.FC = () => {
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horarioAbertura, setHorarioAbertura] = useState('');
  const [horarioFechamento, setHorarioFechamento] = useState('');
  const [captchaValido, setCaptchaValido] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValido) {
      setToastMessage('Por favor, verifique o captcha.');
      setShowToast(true);
      return;
    }
    setToastMessage('Cadastro enviado com sucesso!');
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light" className="toolbar-custom">
          <IonButtons slot="start">
            <IonIcon icon={menuOutline} className="icon-menu" />
          </IonButtons>
          
          <IonTitle className="header-title">Cadastro de Equipamento</IonTitle>
          
          <IonButtons slot="end">
            <IonIcon icon={personCircleOutline} className="icon-user" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="background-custom" scroll-y="true">
        <form onSubmit={handleSubmit} className="form-container">
          
          <IonLabel className="section-title">Selecione o tipo de Equipamento:</IonLabel>
          <IonRadioGroup 
            value={tipoEquipamento} 
            onIonChange={e => setTipoEquipamento(e.detail.value)}
          >
            <IonItem lines="none">
              <IonRadio value="Horta" />
              <IonLabel>Horta</IonLabel>
              <IonRadio value="Feira" style={{ marginLeft: '20px' }} />
              <IonLabel>Feira</IonLabel>
            </IonItem>
          </IonRadioGroup>

          <IonItem className="input-container">
            <IonLabel position="stacked">Nome:</IonLabel>
            <IonInput
              placeholder="Digite o nome do equipamento..." 
              value={nomeEquipamento} 
              onIonChange={e => setNomeEquipamento(e.detail.value!)} 
              required 
            />
          </IonItem>

          <IonItem className="input-container">
            <IonLabel position="stacked">Logradouro:</IonLabel>
            <IonInput 
              placeholder="Digite o logradouro..." 
              value={logradouro} 
              onIonChange={e => setLogradouro(e.detail.value!)} 
              required 
            />
          </IonItem>
          {/* Frase de instrução em vermelho para o campo de logradouro */}
          <p className="input-warning">
            Siga as regras: insira apenas caracteres permitidos, sem abreviações 
            exageradas e mantenha a coerência com o endereço real.
          </p>

          <IonItem className="input-container">
            <IonLabel position="stacked">Número:</IonLabel>
            <IonInput 
              placeholder="Digite o número..." 
              value={numero} 
              onIonChange={e => setNumero(e.detail.value!)} 
              required 
            />
          </IonItem>

          <IonItem className="input-container">
            <IonLabel position="stacked">Complemento (Opcional):</IonLabel>
            <IonInput 
              placeholder="Digite o complemento..." 
              value={complemento} 
              onIonChange={e => setComplemento(e.detail.value!)} 
            />
          </IonItem>

          <IonItem className="input-container">
            <IonLabel position="stacked">Descrição:</IonLabel>
            <IonInput 
              placeholder="Digite a descrição do equipamento..." 
              value={descricao} 
              onIonChange={e => setDescricao(e.detail.value!)} 
              required 
            />
          </IonItem>

          <IonLabel className="section-title">Horário de Abertura/Fechamento:</IonLabel>
          <div className="horario-container">
            <IonItem>
              <IonInput 
                placeholder="HH:MM" 
                value={horarioAbertura} 
                onIonChange={e => setHorarioAbertura(e.detail.value!)} 
                required 
              />
              <IonSelect interface="popover">
                <IonSelectOption value="AM">AM</IonSelectOption>
                <IonSelectOption value="PM">PM</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonInput 
                placeholder="HH:MM" 
                value={horarioFechamento} 
                onIonChange={e => setHorarioFechamento(e.detail.value!)} 
                required 
              />
              <IonSelect interface="popover">
                <IonSelectOption value="AM">AM</IonSelectOption>
                <IonSelectOption value="PM">PM</IonSelectOption>
              </IonSelect>
            </IonItem>
          </div>

          <ReCAPTCHA
            sitekey="SUA_CHAVE_DO_RECAPTCHA"
            onChange={() => setCaptchaValido(true)}
            className="captcha"
          />

          <IonButton expand="block" type="submit" className="submit-button">
            Solicitar Cadastro
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CadastroEquipamento;


