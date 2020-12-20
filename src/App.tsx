import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ParcelsPage, LabelsPage, HomePage } from './pages';
import CssBaseline from '@material-ui/core/CssBaseline';
import { LinksProvider, TokenProvider } from './context';

const App: React.FC = () => {
	return (
		<CssBaseline>
			<TokenProvider>
				<LinksProvider>
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
	);
};

export default App;
