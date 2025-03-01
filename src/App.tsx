import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import AnimeInicial from './pages/animacao_telas/AnimeInicial';
import Home from './pages/home/Home';
import Serviços from './pages/servicos_SAU/Servicos';
import Mapa from './pages/mapa/Mapa'; 
import CadastroEquipamento from './pages/cadastros/CadastroEquipamento';
import ServiçoSEAU from './pages/servicos_SAU/ServicoSEAU';
import Espaço from './pages/servicos_SAU/Espaco';
import SAFUC from './pages/servicos_SAU/SAFUC';
import Info from './pages/informacao/Info';
import Missão from './pages/informacao/Missão';
import Agroeco from './pages/informacao/Agroeco';
import ListaResponsavel from './pages/ListaResponsavel';
import CadastroResponsavel from './pages/cadastros/CadastroResponsavel';
import Sitio from './pages/servicos_SAU/Sitio';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Nova rota para o splash screen */}
        <Route exact path="/animeinicial">
          <AnimeInicial />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/serviços">
          <Serviços />
        </Route>
        <Route exact path="/mapa">
          <Mapa />
        </Route>
        <Route exact path="/cadastroequipamento">
          <CadastroEquipamento />
        </Route>
        <Route exact path="/serviçoseau">
          <ServiçoSEAU />
        </Route>
        <Route exact path="/espaço">
          <Espaço />
        </Route>
        <Route exact path="/safuc">
          <SAFUC />
        </Route>
        <Route exact path="/sitio">
          <Sitio />
        </Route>
        <Route exact path="/info">
          <Info />
        </Route>
        <Route exact path="/missão">
          <Missão />
        </Route>
        <Route exact path="/agroeco">
          <Agroeco />
        </Route>
        <Route exact path="/listaresponsavel">
          <ListaResponsavel />
        </Route>
        <Route exact path="/cadastroresponsavel">
          <CadastroResponsavel />
        </Route>
        {/* Redireciona a rota raiz para o splash screen */}
        <Route exact path="/">
          <Redirect to="/animeinicial" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
