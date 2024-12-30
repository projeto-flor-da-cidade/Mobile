import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonIcon, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowBack } from 'ionicons/icons';

const CadastroEquipamento: React.FC = () => {
  const history = useHistory();
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacaoEquipamento, setObservacaoEquipamento] = useState('');
  const [responsaveis, setResponsaveis] = useState<{ id: number; nome: string }[]>([]);
  const [idResponsavelSelecionado, setIdResponsavelSelecionado] = useState<number | null>(null);

  useEffect(() => {
    const fetchResponsaveis = async () => {
      try {
        const response = await fetch('http://localhost:8080/responsavel/listar-nomes-ids');
        if (response.ok) {
          const data = await response.json();
          setResponsaveis(data);
        } else {
          console.error('Erro ao carregar responsáveis:', response.statusText);
          alert('Erro ao carregar responsáveis.');
        }
      } catch (error) {
        console.error('Erro ao buscar responsáveis:', error);
        alert('Erro ao buscar responsáveis.');
      }
    };

    fetchResponsaveis();
  }, []);

  const handleVoltar = () => {
    history.goBack();
  };

  const enviarEquipamento = async () => {
    if (!idResponsavelSelecionado) {
      alert('Por favor, selecione um responsável.');
      return;
    }

    const equipamentoData = {
      nome: nomeEquipamento,
      tipoEqui: tipoEquipamento === 'feira' ? 1 : 2,
      qtdBancas: parseInt(quantidade, 10),
      observ: observacaoEquipamento,
      Id_resp: idResponsavelSelecionado, // Incluindo o ID do responsável selecionado
    };

    try {
      const response = await fetch('http://localhost:8080/equipamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipamentoData),
      });

      if (response.ok) {
        alert('Equipamento cadastrado com sucesso!');
        history.push('/Mapa');
      } else {
        alert('Erro ao cadastrar equipamento.');
      }
    } catch (error) {
      alert('Erro ao conectar-se ao servidor.');
    }
  };

  return (
    <IonPage>
      <IonHeader className="header-custom">
        <div className="header-container">
          <IonButton className="circle-button" onClick={handleVoltar}>
            <IonIcon icon={arrowBack} />
          </IonButton>
          <div className="titulo">
            <p>Cadastro de Equipamento</p>
          </div>
        </div>
      </IonHeader>
      <IonContent className="ion-padding BackgroundPagina">
        <IonItem>
          <IonLabel position="floating">Nome do Equipamento</IonLabel>
          <IonInput
            value={nomeEquipamento}
            onIonChange={(e) => setNomeEquipamento(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Tipo do Equipamento</IonLabel>
          <IonSelect
            value={tipoEquipamento}
            onIonChange={(e) => setTipoEquipamento(e.detail.value)}
          >
            <IonSelectOption value="feira">Feira</IonSelectOption>
            <IonSelectOption value="horta">Horta</IonSelectOption>
          </IonSelect>
        </IonItem>

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

        {tipoEquipamento && (
          <IonItem>
            <IonLabel position="floating">Observação do Equipamento</IonLabel>
            <IonTextarea
              value={observacaoEquipamento}
              onIonChange={(e) => setObservacaoEquipamento(e.detail.value!)}
            />
          </IonItem>
        )}

        <IonItem>
          <IonLabel position="floating">Responsável</IonLabel>
          <IonSelect
            value={idResponsavelSelecionado}
            onIonChange={(e) => setIdResponsavelSelecionado(e.detail.value)}
          >
            {responsaveis.map((resp) => (
              <IonSelectOption key={resp.id} value={resp.id}>
                {resp.nome}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonButton expand="block" onClick={enviarEquipamento}>
          Enviar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CadastroEquipamento;
