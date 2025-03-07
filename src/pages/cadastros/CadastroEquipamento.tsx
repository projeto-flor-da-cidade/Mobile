// src/pages/CadastroEquipamento.tsx
import React, { useState, useEffect } from 'react';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonSelect, IonSelectOption, IonButton, IonToast, IonCheckbox, IonText 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './CadastroEquipamento.css';

const CadastroEquipamento: React.FC = () => {
  const history = useHistory();

  // Estados para tipos de equipamento e responsáveis
  const [tipoEquOptions, setTipoEquOptions] = useState<any[]>([]);
  const [selectedTipoEquId, setSelectedTipoEquId] = useState<number | null>(null);

  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState<number | null>(null);

  // Campos do formulário
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [compl, setCompl] = useState('');
  const [nome, setNome] = useState('');
  const [observ, setObserv] = useState('');
  const [qtdBancas, setQtdBancas] = useState<number | null>(null);
  const [horarioAbertura, setHorarioAbertura] = useState('');
  const [horarioFechamento, setHorarioFechamento] = useState('');

  // Checkbox dos termos de serviço
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estado para foto e pré-visualização
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Toast para feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Carrega os tipos de equipamento do backend
  useEffect(() => {
    const fetchTipoEqu = async () => {
      try {
        const response = await axios.get('http://localhost:8081/tipo_equ');
        setTipoEquOptions(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de equipamento:', error);
      }
    };
    fetchTipoEqu();
  }, []);

  // Carrega os responsáveis do backend
  useEffect(() => {
    const fetchResponsaveis = async () => {
      try {
        const response = await axios.get('http://localhost:8081/responsavel');
        setResponsaveis(response.data);
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
      }
    };
    fetchResponsaveis();
  }, []);

  // Manipulador para seleção da foto
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submissão do formulário usando FormData (JSON + arquivo)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida os campos obrigatórios
    if (!selectedTipoEquId) {
      setToastMessage('Selecione o tipo de equipamento.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    if (!selectedResponsavel) {
      setToastMessage('Selecione um responsável.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    if (!logradouro || !numero || !nome || !horarioAbertura || !horarioFechamento) {
      setToastMessage('Preencha todos os campos obrigatórios.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    // Atualização: envia os IDs diretamente em vez de objetos aninhados
    const payload = {
      logradouro,
      numero,
      compl,
      nome,
      observ,
      qtdBancas: (() => {
        const tipoSelecionado = tipoEquOptions.find(option => option.seqTipoEqu === selectedTipoEquId);
        return (tipoSelecionado && tipoSelecionado.descrTipoEqu.toUpperCase() === 'FEIRAS') ? qtdBancas : null;
      })(),
      horarioAbertura,
      horarioFechamento,
      seqTipoEqu: selectedTipoEquId,
      seqResp: selectedResponsavel
    };

    // Monta o FormData com duas partes: "equipamento" (JSON) e "file" (imagem, se houver)
    const formData = new FormData();
    formData.append('equipamento', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (photo) {
      formData.append('file', photo);
    }

    try {
      await axios.post('http://localhost:8081/equipamento', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setToastMessage('Cadastro realizado com sucesso!');
      setToastColor('success');
      setShowToast(true);
      setTimeout(() => {
        history.goBack();
      }, 1500);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setToastMessage('Erro no cadastro. Verifique os dados e tente novamente.');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cadastro de Equipamento</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding background-custom">
        <form onSubmit={handleSubmit}>
          {/* Seleção do Tipo de Equipamento */}
          <IonItem>
            <IonLabel position="stacked">Tipo de Equipamento</IonLabel>
            <IonSelect
              value={selectedTipoEquId || undefined}
              placeholder="Selecione o tipo"
              onIonChange={e => setSelectedTipoEquId(e.detail.value)}
            >
              {tipoEquOptions.map((option: any) => (
                <IonSelectOption key={option.seqTipoEqu} value={option.seqTipoEqu}>
                  {option.descrTipoEqu}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Seleção do Responsável */}
          <IonItem>
            <IonLabel position="stacked">Responsável</IonLabel>
            <IonSelect
              value={selectedResponsavel || undefined}
              placeholder="Selecione o responsável"
              onIonChange={e => setSelectedResponsavel(e.detail.value)}
            >
              {responsaveis.map((resp: any) => (
                <IonSelectOption key={resp.seqResp} value={resp.seqResp}>
                  {resp.nome}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Inserir foto do estabelecimento */}
          <IonItem>
            <IonLabel position="stacked">Insira a foto do estabelecimento</IonLabel>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              title="Insira a foto do estabelecimento" 
            />
          </IonItem>
          {photoPreview && (
            <div className="ion-padding">
              <img src={photoPreview} alt="Pré-visualização" className="photo-preview-img" />
            </div>
          )}

          {/* Campos do equipamento */}
          <IonItem>
            <IonLabel position="stacked">Logradouro</IonLabel>
            <IonInput
              value={logradouro}
              placeholder="Rua Abaeté, Pontezinha"
              onIonChange={e => setLogradouro(e.detail.value!)}
              required
            />
          </IonItem>
          <IonText color="danger" className="ion-padding-start">
            <small>
              O logradouro precisa respeitar as iniciais em maiúscula e ter após a rua, o bairro*
            </small>
          </IonText>
          <IonItem>
            <IonLabel position="stacked">Número</IonLabel>
            <IonInput
              value={numero}
              placeholder="Digite o número"
              onIonChange={e => setNumero(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Complemento</IonLabel>
            <IonInput
              value={compl}
              placeholder="Digite o complemento (opcional)"
              onIonChange={e => setCompl(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Nome</IonLabel>
            <IonInput
              value={nome}
              placeholder="Digite o nome do equipamento"
              onIonChange={e => setNome(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Observação</IonLabel>
            <IonInput
              value={observ}
              placeholder="O texto deve ser simples, informando sobre o que é o estabelecimento e o que tem nele"
              onIonChange={e => setObserv(e.detail.value!)}
            />
          </IonItem>
          {selectedTipoEquId && (() => {
            const tipoSelecionado = tipoEquOptions.find(option => option.seqTipoEqu === selectedTipoEquId);
            if (tipoSelecionado && tipoSelecionado.descrTipoEqu.toUpperCase() === 'FEIRAS') {
              return (
                <IonItem>
                  <IonLabel position="stacked">Quantidade de Bancas</IonLabel>
                  <IonInput
                    type="number"
                    value={qtdBancas !== null ? qtdBancas.toString() : ''}
                    placeholder="Digite a quantidade de bancas"
                    onIonChange={e => {
                      const value = e.detail.value;
                      setQtdBancas(value ? parseInt(value, 10) : null);
                    }}
                  />
                </IonItem>
              );
            }
            return null;
          })()}
          <IonItem>
            <IonLabel position="stacked">Horário de Abertura</IonLabel>
            <IonInput
              value={horarioAbertura}
              placeholder="08:00:00"
              onIonChange={e => setHorarioAbertura(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Horário de Fechamento</IonLabel>
            <IonInput
              value={horarioFechamento}
              placeholder="08:00:00"
              onIonChange={e => setHorarioFechamento(e.detail.value!)}
              required
            />
          </IonItem>
          <IonItem lines="none">
            <IonCheckbox
              checked={termsAccepted}
              onIonChange={e => setTermsAccepted(e.detail.checked)}
            />
            <IonLabel>Aceito os termos de serviço</IonLabel>
          </IonItem>
          <IonButton
            expand="block"
            type="submit"
            className="ion-margin-top"
            disabled={!termsAccepted}
          >
            Finalizar Cadastro
          </IonButton>
        </form>

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

export default CadastroEquipamento;
