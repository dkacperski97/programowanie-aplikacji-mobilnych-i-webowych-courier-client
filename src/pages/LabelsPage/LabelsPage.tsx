import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import { ApiErrorAlert } from '../../components';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/core/Alert';
import { LinksContext, TokenContext } from '../../context';
import LabelIcon from '@material-ui/icons/Label';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	h1: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	}
}));

const LabelsPage: React.FC = () => {
	const linksContext = React.useContext(LinksContext);
	const tokenContext = React.useContext(TokenContext);
	const [labels, setLabels] = useState<any[]>();
	const [error, setError] = useState<Error>();
	const classes = useStyles();

	useEffect(() => {
		const load = async () => {
			if (!process.env.REACT_APP_WEB_SERVICE_URL || !linksContext?.links?.labels?.href) {
				setError(new Error("Nie można pobrać listy etykiet"));
				return;
			}
			const url = process.env.REACT_APP_WEB_SERVICE_URL + linksContext?.links?.labels?.href;
			let res;
			const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
			try {
				res = await fetch(url, { method: 'GET', headers });
			} catch (e) {
				setError(new Error("Wystąpił błąd w trakcie próby komunikacji z usługą sieciową. Spróbuj ponownie później."));
				return;
			}
			const value = await res.json();
			if (!Array.isArray(value?._embedded?.labels)) {
				setError(new Error('Incorrect response'));
				return;
			}
			setLabels(value._embedded.labels);
		};
		if (linksContext?.links) {
			load();
		}
	}, [linksContext?.links, tokenContext?.token]);

	if (!linksContext?.links) {
		return <Redirect to="/" />
	}

	const onCreateParcelClick = async (parcelUrl: string, labelId: string ) => {
		if (!process.env.REACT_APP_WEB_SERVICE_URL || !parcelUrl) {
			setError(new Error("Nie można utworzyć paczki"));
			return;
		}
		const url = process.env.REACT_APP_WEB_SERVICE_URL + parcelUrl;
		let res;
		try {
			const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
			res = await fetch(url, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json'  }, body: JSON.stringify({ labelId }) });
		} catch (e) {
			setError(new Error("Wystąpił błąd w trakcie próby komunikacji z usługą sieciową. Spróbuj ponownie później."));
			return;
		}
		if (res.status !== 201) {
			setError(new Error("Wystąpił błąd w trakcie tworzenia paczki"));
			return;
		}

		if (!process.env.REACT_APP_WEB_SERVICE_URL || !linksContext?.links?.labels?.href) {
			setError(new Error("Nie można pobrać listy etykiet"));
			return;
		}
		const url2 = process.env.REACT_APP_WEB_SERVICE_URL + linksContext?.links?.labels?.href;
		let res2;
		const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
		try {
			res2 = await fetch(url2, { method: 'GET', headers });
		} catch (e) {
			setError(new Error("Wystąpił błąd w trakcie próby komunikacji z usługą sieciową. Spróbuj ponownie później."));
			return;
		}
		const value = await res2.json();
		if (!Array.isArray(value?._embedded?.labels)) {
			setError(new Error('Incorrect response'));
			return;
		}
		setLabels(value._embedded.labels);
	};

	return (
		<>
			<Container disableGutters>
				<h1 className={classes.h1}>Etykiety</h1>
				{error ? (
					<ApiErrorAlert error={error} />
				) : !labels ? (
					<CircularProgress />
				) : labels.length === 0 ? (
					<Alert severity="info">Pusta lista</Alert>
				) : (
					<List>
						{labels.map((label) => (
							<ListItem key={label.id}>
								<ListItemAvatar>
									<Avatar>
										<LabelIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={`${label.sender} -> ${label.recipient}`} secondary={label.assignedParcel && "Przypisana do paczki"}
								/>
								{label?._links?.assign?.href && (
								<ListItemSecondaryAction>
									<Tooltip title="Utwórz paczkę">
										<IconButton
											edge="end"
											aria-label="create"
											onClick={() =>
												onCreateParcelClick(label._links.assign.href, label.id)
											}
										>
											<MoveToInboxIcon />
										</IconButton>
									</Tooltip>
								</ListItemSecondaryAction>)}
							</ListItem>
						))}
					</List>
				)}
			</Container>
		</>
	);
};

export default LabelsPage;
