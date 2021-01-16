import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ParcelsPage, LabelsPage, HomePage } from './pages';
import { NavigationBar } from './components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LinksProvider, TokenProvider } from './context';
import { Auth0Provider } from '@auth0/auth0-react';

const App: React.FC = () => {
	return process.env.REACT_APP_AUTH0_DOMAIN && process.env.REACT_APP_AUTH0_CLIENT_ID ? (
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			redirectUri={window.location.origin}
		>
			<CssBaseline>
				<TokenProvider>
					<LinksProvider>
						<NavigationBar />
						<Router>
							<Switch>
								<Route path="/parcels">
									<ParcelsPage />
								</Route>
								<Route path="/labels">
									<LabelsPage />
								</Route>
								<Route path="/">
									<HomePage />
								</Route>
							</Switch>
						</Router>
					</LinksProvider>
				</TokenProvider>
			</CssBaseline>
		</Auth0Provider>
	) : (
		<div>"Domain" lub "Client_id" nie są zdefiniowane!</div>
	);
};

export default App;
