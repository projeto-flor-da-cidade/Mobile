import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Serviços from './pages/Serviços';
import Mapa from './pages/Mapa'; 
import CadastroFeira from './pages/CadastroFeira';
import ServiçoSEAU from './pages/ServiçoSEAU';
import Espaço from './pages/Espaço';
import SAFUC from './pages/SAFUC';
import Sítio from './pages/Sítio';
import Info from './pages/Info';
import Missão from './pages/Missão';
import Agroeco from './pages/Agroeco';
import ListaResponsavel from './pages/ListaResponsavel';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/serviços">
        <Serviços/>
        </Route>
        <Route exact path="/mapa">
          <Mapa/>
        </Route>
        <Route exact path="/cadastrofeira">
        <CadastroFeira/>
        </Route>
        <Route exact path="/serviçoseau">
        <ServiçoSEAU/>
        </Route>
        <Route exact path="/espaço">
        <Espaço/>
        </Route>
        <Route exact path="/safuc">
        <SAFUC/>
        </Route>
        <Route exact path="/sítio">
        <Sítio/>
        </Route>
        <Route exact path="/info">
        <Info/>
        </Route>
        <Route exact path="/missão">
        <Missão/>
        </Route>
        <Route exact path="/agroeco">
        <Agroeco/>
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/listaresponsavel">
          <ListaResponsavel/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
