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
  const [enderecoEquipamento, setEnderecoEquipamento] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [idResponsavel, setIdResponsavel] = useState<number | null>(null); // ID do responsável criado

  // Obter o ID do responsável ao carregar a página
  useEffect(() => {
    const storedId = localStorage.getItem('idResponsavel');
    if (storedId) {
      setIdResponsavel(Number(storedId));
    }
  }, []);

  const handleTipoEquipamentoChange = (e: CustomEvent) => {
    const value = e.detail.value;
    setTipoEquipamento(value);
    setPlaceholder(`Fale aqui sobre ${value === 'feira' ? 'a feira' : 'a horta'}.`);
  };

  const handleVoltar = async () => {
    if (idResponsavel) {
      try {
        // Apaga o responsável recém-criado
        await fetch(`http://localhost:8080/responsavel/${idResponsavel}`, { method: 'DELETE' });
        localStorage.removeItem('idResponsavel');
      } catch (error) {
        console.error('Erro ao apagar o responsável:', error);
      }
    }
    history.goBack();
  };

  const enviarEquipamento = async () => {
    if (!idResponsavel) {
      alert('Erro: Responsável não encontrado.');
      return;
    }

    const equipamentoData = {
      nome: nomeEquipamento,
      tipoEqui: tipoEquipamento === 'feira' ? 1 : 2, // Exemplo de mapeamento
      qtdBancas: parseInt(quantidade, 10),
      observ: observacaoEquipamento,
      idResp: idResponsavel,
    };

    try {
      const response = await fetch('http://localhost:8080/equipamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(equipamentoData),
      });

      if (response.ok) {
        alert('Equipamento cadastrado com sucesso!');
        history.push('/'); // Redireciona para a página inicial ou outra página desejada
      } else {
        alert('Erro ao cadastrar equipamento.');
      }
    } catch (error) {
      console.error('Erro ao enviar equipamento:', error);
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
          <IonSelect value={tipoEquipamento} onIonChange={handleTipoEquipamentoChange}>
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
              placeholder={placeholder}
              onIonChange={(e) => setObservacaoEquipamento(e.detail.value!)}
              onFocus={() => setPlaceholder('')}
              onBlur={() =>
                observacaoEquipamento.trim() === '' &&
                setPlaceholder(`Fale aqui sobre ${tipoEquipamento === 'feira' ? 'a feira' : 'a horta'}.`)
              }
            />
          </IonItem>
        )}

        <IonItem>
          <IonLabel position="floating">Endereço do Equipamento</IonLabel>
          <IonInput
            value={enderecoEquipamento}
            onIonChange={(e) => setEnderecoEquipamento(e.detail.value!)}
          />
        </IonItem>

        <IonButton expand="block" onClick={enviarEquipamento}>
          Enviar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CadastroEquipamento;
