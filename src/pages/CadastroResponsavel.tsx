import React, { useState } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonSelect, IonSelectOption, IonButton, IonToast, IonText 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const CadastroResponsavel: React.FC = () => {
  const history = useHistory();

  // Estados para os campos do formulário
  const [nome, setNome] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [documento, setDocumento] = useState('');
  const [cpf, setCpf] = useState('');
  const [genero, setGenero] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  
  // Estados para o Toast de feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Função para remover formatação (apenas dígitos)
  const removerFormatacao = (valor: string) => valor.replace(/\D/g, '');

  // Função de submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação manual do campo gênero
    if (!genero) {
      setToastMessage('Por favor, selecione um gênero.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    // Remove formatação do CPF e Telefone antes de enviar
    const cpfClean = removerFormatacao(cpf);
    const telefoneClean = removerFormatacao(telefone);

    const payload = {
      nome,
      logradouro,
      numero,
      bairro,
      documento,
      cpf: cpfClean,
      genero,
      telefone: telefoneClean,
      email
    };

    try {
      // Substitua a URL abaixo pela URL do seu backend
      await axios.post('http://localhost:8081/responsavel', payload);
      setToastMessage('Cadastro realizado com sucesso!');
      setToastColor('success');
      setShowToast(true);
      // Após breve atraso, retorna para a página anterior
      setTimeout(() => {
        history.goBack();
      }, 1500);
    } catch (error) {
      setToastMessage('Erro no cadastro. Verifique os dados e tente novamente.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de Responsável</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <IonItem>
            <IonLabel position="stacked">Nome</IonLabel>
            <IonInput 
              value={nome} 
              placeholder="Digite seu nome" 
              onIonChange={e => setNome(e.detail.value!)} 
              required 
            />
          </IonItem>

          {/* Logradouro */}
          <IonItem>
            <IonLabel position="stacked">Logradouro</IonLabel>
            <IonInput 
              value={logradouro} 
              placeholder="Rua Abaeté" 
              onIonChange={e => setLogradouro(e.detail.value!)} 
              required 
            />
          </IonItem>
          <IonText color="danger" className="ion-padding-start">
            <small>O logradouro precisa respeitar as iniciais em maiúscula*</small>
          </IonText>

          {/* Número */}
          <IonItem>
            <IonLabel position="stacked">Número</IonLabel>
            <IonInput 
              value={numero} 
              placeholder="Digite o número" 
              onIonChange={e => setNumero(e.detail.value!)} 
              required 
            />
          </IonItem>

          {/* Bairro */}
          <IonItem>
            <IonLabel position="stacked">Bairro</IonLabel>
            <IonInput 
              value={bairro} 
              placeholder="Ex: Centro" 
              onIonChange={e => setBairro(e.detail.value!)} 
              required 
            />
          </IonItem>
          <IonText color="danger" className="ion-padding-start">
            <small>O bairro precisa respeitar as iniciais em maiúscula*</small>
          </IonText>

          {/* Documento (RG) */}
          <IonItem>
            <IonLabel position="stacked">Documento (RG)</IonLabel>
            <IonInput 
              value={documento} 
              placeholder="Digite o RG" 
              onIonChange={e => setDocumento(e.detail.value!)} 
              required 
            />
          </IonItem>

          {/* CPF */}
          <IonItem>
            <IonLabel position="stacked">CPF</IonLabel>
            <IonInput 
              value={cpf} 
              placeholder="611.178.333.45" 
              onIonChange={e => setCpf(e.detail.value!)} 
              required 
            />
          </IonItem>

          {/* Gênero */}
          <IonItem>
            <IonLabel position="stacked">Gênero</IonLabel>
            <IonSelect 
              value={genero} 
              placeholder="Selecione o gênero" 
              onIonChange={e => setGenero(e.detail.value)}
            >
              <IonSelectOption value="MASCULINO">MASCULINO</IonSelectOption>
              <IonSelectOption value="FEMININO">FEMININO</IonSelectOption>
              <IonSelectOption value="OUTRO">OUTRO</IonSelectOption>
            </IonSelect>
          </IonItem>

          {/* Telefone */}
          <IonItem>
            <IonLabel position="stacked">Telefone</IonLabel>
            <IonInput 
              value={telefone} 
              placeholder="(81)9 8722-7991" 
              onIonChange={e => setTelefone(e.detail.value!)} 
              required 
            />
          </IonItem>

          {/* Email */}
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput 
              value={email} 
              placeholder="exemplo@dominio.com" 
              onIonChange={e => setEmail(e.detail.value!)} 
              type="email"
            />
          </IonItem>

          {/* Botão de Finalizar Cadastro */}
          <IonButton expand="block" type="submit" className="ion-margin-top">
            Finalizar Cadastro
          </IonButton>
        </form>

        {/* Toast para feedback */}
        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={1500}
          color={toastColor}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default CadastroResponsavel;
