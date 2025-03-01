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

  // Estado para os tipos de equipamento (tip_equ) do backend
  const [tipoEquOptions, setTipoEquOptions] = useState<any[]>([]);
  // Estado para o id do tipo de equipamento selecionado
  const [selectedTipoEquId, setSelectedTipoEquId] = useState<number | null>(null);

  // Estado para os responsáveis (vinculação)
  const [responsaveis, setResponsaveis] = useState<any[]>([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState<number | null>(null);

  // Campos do formulário
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [compl, setCompl] = useState('');
  const [nome, setNome] = useState('');
  const [observ, setObserv] = useState('');
  // Quantidade de bancas: somente para FEIRAS – estado como número ou null
  const [qtdBancas, setQtdBancas] = useState<number | null>(null);
  const [horarioAbertura, setHorarioAbertura] = useState('');
  const [horarioFechamento, setHorarioFechamento] = useState('');

  // Checkbox dos termos de serviço
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Toast para feedback
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  // Carregar as opções de tipo de equipamento do backend (tip_equ)
  useEffect(() => {
    const fetchTipoEqu = async () => {
      try {
        const response = await axios.get('http://localhost:8081/tipo_equ');
        console.log('Tipos retornados:', response.data); // Verifique o que está vindo
        setTipoEquOptions(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de equipamento:', error);
      }
    };
    fetchTipoEqu();
  }, []);

  // Carregar os responsáveis do backend
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

  // Função de submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações iniciais
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

    const payload = {
      logradouro,
      numero,
      compl,
      nome,
      observ,
      // Envia qtdBancas somente se o tipo selecionado for FEIRAS
      qtdBancas: (() => {
        const tipoSelecionado = tipoEquOptions.find(option => option.seqTipoEqu === selectedTipoEquId);
        if (tipoSelecionado && tipoSelecionado.descrTipoEqu.toUpperCase() === 'FEIRAS') {
          return qtdBancas;
        }
        return null;
      })(),
      horarioAbertura,
      horarioFechamento,
      tipoEqu: {
        seqTipoEqu: selectedTipoEquId
      },
      responsavel: {
        seqResp: selectedResponsavel
      }
    };

    try {
      await axios.post('http://localhost:8081/equipamento', payload);
      setToastMessage('Cadastro realizado com sucesso!');
      setToastColor('success');
      setShowToast(true);
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

          {/* Campos habilitados somente após a seleção do tipo */}
          <div className={selectedTipoEquId ? "fields-enabled" : "fields-disabled"}>
            {/* Seleção do Responsável */}
            <IonItem>
              <IonLabel position="stacked">
                Selecione o responsável para vincular o equipamento
              </IonLabel>
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

            {/* Logradouro */}
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

            {/* Complemento */}
            <IonItem>
              <IonLabel position="stacked">Complemento</IonLabel>
              <IonInput
                value={compl}
                placeholder="Digite o complemento (opcional)"
                onIonChange={e => setCompl(e.detail.value!)}
              />
            </IonItem>

            {/* Nome */}
            <IonItem>
              <IonLabel position="stacked">Nome</IonLabel>
              <IonInput
                value={nome}
                placeholder="Digite o nome do equipamento"
                onIonChange={e => setNome(e.detail.value!)}
                required
              />
            </IonItem>

            {/* Observação */}
            <IonItem>
              <IonLabel position="stacked">Observação</IonLabel>
              <IonInput
                value={observ}
                placeholder="O texto deve ser simples, informando sobre o que é o estabelecimento e o que tem nele"
                onIonChange={e => setObserv(e.detail.value!)}
              />
            </IonItem>

            {/* Quantidade de Bancas (apenas para FEIRAS) */}
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

            {/* Horário de Abertura */}
            <IonItem>
              <IonLabel position="stacked">Horário de Abertura</IonLabel>
              <IonInput
                value={horarioAbertura}
                placeholder="08:00:00"
                onIonChange={e => setHorarioAbertura(e.detail.value!)}
                required
              />
            </IonItem>

            {/* Horário de Fechamento */}
            <IonItem>
              <IonLabel position="stacked">Horário de Fechamento</IonLabel>
              <IonInput
                value={horarioFechamento}
                placeholder="08:00:00"
                onIonChange={e => setHorarioFechamento(e.detail.value!)}
                required
              />
            </IonItem>

            {/* Checkbox dos termos de serviço */}
            <IonItem lines="none">
              <IonCheckbox
                checked={termsAccepted}
                onIonChange={e => setTermsAccepted(e.detail.checked)}
              />
              <IonLabel>Aceito os termos de serviço</IonLabel>
            </IonItem>

            {/* Botão de Finalizar Cadastro */}
            <IonButton
              expand="block"
              type="submit"
              className="ion-margin-top"
              disabled={!termsAccepted}
            >
              Finalizar Cadastro
            </IonButton>
          </div>
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
