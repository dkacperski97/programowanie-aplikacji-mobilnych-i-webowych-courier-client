import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import { ListItemLink } from '../../components';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import LabelIcon from '@material-ui/icons/Label';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import { LinksContext, TokenContext } from '../../context';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ApiErrorAlert } from '../../components';

const useStyles = makeStyles((theme) => ({
	h1: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	}
}));

const HomePage: React.FC = () => {
	const linksContext = React.useContext(LinksContext);
	const tokenContext = React.useContext(TokenContext);
	const [error, setError] = useState<Error>();
	const classes = useStyles();
    
	useEffect(() => {
		const load = async () => {
			const url = process.env.REACT_APP_WEB_SERVICE_URL;
			if (!url) {
				setError(new Error("Nie zdefiniowano adresu usługi sieciowej"));
				return;
			}
			let res;
			const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
			try {
				res = await fetch(url, { method: 'GET', headers });
			} catch (e) {
				setError(e);
				return;
			}
			const value = await res.json();
			if (!value?._links) {
				setError(new Error('Niepoprawna odpowiedź od usługi sieciowej'));
				return;
			}
			linksContext?.setLinks(value._links);
		};
		if (!linksContext?.links) {
			load();
		}
	}, [tokenContext?.token, linksContext]);

    const getLinks = () => {
		const result = [];
		if (linksContext?.links?.labels) {
			result.push({ id: 'labels', to: '/labels', icon: <LabelIcon />, title: 'Etykiety' })
		}
		if (linksContext?.links?.parcels) {
			result.push({ id: 'parcels', to: '/parcels', icon: <AllInboxIcon />, title: 'Paczki' })
		}
		return result;
    }

	return (
			<Container disableGutters>
				<h1 className={classes.h1}>Strona główna</h1>
                {error ? (
					<ApiErrorAlert error={error} />
				) : !linksContext?.links ? (
					<CircularProgress />
				) :(
				<List>
                    {getLinks().map((link) => (
                        <ListItemLink key={link.id} to={link.to}>
                            <ListItemAvatar>
                                <Avatar>
                                    {link.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={link.title} />
                        </ListItemLink>
                    ))}
				</List>
				)}
			</Container>
	);
};

export default HomePage;
