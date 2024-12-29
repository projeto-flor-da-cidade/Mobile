import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast
} from '@ionic/react';
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Função de validação de CPF
  const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };

  // Função para enviar os dados para a API
  const handleSubmit = async () => {
    if (!validarCPF(cpfResponsavel)) {
      setToastMessage('CPF inválido!');
      setShowToast(true);
      return;
    }

    const data = {
      nome: nomeResponsavel,
      telefone: telefoneResponsavel,
      cpf: cpfResponsavel,
      email: emailResponsavel,
      bairro: bairroResponsavel,
      logradouro: enderecoResponsavel,
      numero: 'S/N'
    };

    try {
      const response = await fetch('http://localhost:8080/responsavel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setToastMessage('Responsável cadastrado com sucesso!');
        setShowToast(true);
        history.push('/cadastroequipamento');
      } else {
        setToastMessage('Erro ao cadastrar o responsável.');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro de conexão com o servidor.');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={() => history.goBack()}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>RESPONSÁVEL</p>
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding BackgroundPagina">
        <form className="form-container">
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
              maxlength={100}
              value={enderecoResponsavel}
              onIonChange={(e) => setEnderecoResponsavel(e.detail.value!)}
            />
          </IonItem>

          {/* Botão de Enviar */}
          <IonButton expand="block" onClick={handleSubmit}>
            Cadastrar
          </IonButton>
        </form>
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CadastroResponsavel;
