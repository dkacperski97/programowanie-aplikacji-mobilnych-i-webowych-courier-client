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
import AllInboxIcon from '@material-ui/icons/AllInbox';
import EditIcon from '@material-ui/icons/Edit';
import { LinksContext, TokenContext } from '../../context';
import ChangeLabelStatus from './ChangeParcelStatus';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	h1: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	}
}));

const ParcelsPage: React.FC = () => {
	const linksContext = React.useContext(LinksContext);
	const tokenContext = React.useContext(TokenContext);
	const [parcels, setParcels] = useState<any[]>();
	const [error, setError] = useState<Error>();
	const [open, setOpen] = useState<boolean>(false);
	const [statusUrl, setStatusUrl] = useState<string>();
	const classes = useStyles();

	useEffect(() => {
		const load = async () => {
			if (open !== true) {
				if (!process.env.REACT_APP_WEB_SERVICE_URL || !linksContext?.links?.parcels?.href) {
					setError(new Error("Nie można pobrać listy paczek"));
					return;
				}
				const url = process.env.REACT_APP_WEB_SERVICE_URL + linksContext?.links?.parcels?.href;
				let res;
				const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
				try {
					res = await fetch(url, { method: 'GET', headers });
				} catch (e) {
					setError(e);
					return;
				}
				const value = await res.json();
				if (!Array.isArray(value?._embedded?.parcels)) {
					setError(new Error('Incorrect response'));
					return;
				}
				setParcels(value._embedded.parcels);
			}
		};
		if (linksContext?.links) {
			load();
		}
	}, [linksContext?.links, tokenContext?.token, open]);

	if (!linksContext?.links) {
		return <Redirect to="/" />
	}

	const onEditClick = async (parcelUrl: string) => {
		setStatusUrl(parcelUrl);
		setOpen(true);
	};

	const statusToString = (status: string) => {
		switch (status) {
			case "on_the_way": return "W drodze";
			case "delivered": return "Dostarczona";
			case "received": return "Odebrana";
			default: return undefined;
		}
	}

	return (
		<>
			<Container disableGutters>
				<h1 className={classes.h1}>Paczki</h1>
				{error ? (
					<ApiErrorAlert error={error} />
				) : !parcels ? (
					<CircularProgress />
				) : parcels.length === 0 ? (
					<Alert severity="info">Pusta lista</Alert>
				) : (
					<List>
						{parcels.map((parcel) => (
							<ListItem key={parcel.id}>
								<ListItemAvatar>
									<Avatar>
										<AllInboxIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary={parcel.id} secondary={statusToString(parcel.status)}
								/>
								{parcel?._links?.self?.href && (
								<ListItemSecondaryAction>
									<Tooltip title="Zmień status">
										<IconButton
											edge="end"
											aria-label="edit"
											onClick={() =>
												onEditClick(parcel._links.self.href)
											}
										>
											<EditIcon />
										</IconButton>
									</Tooltip>
								</ListItemSecondaryAction>)}
							</ListItem>
						))}
					</List>
				)}
			</Container>
			<ChangeLabelStatus open={open} setOpen={setOpen} setError={setError} statusUrl={statusUrl} />
		</>
	);
};

export default ParcelsPage;
