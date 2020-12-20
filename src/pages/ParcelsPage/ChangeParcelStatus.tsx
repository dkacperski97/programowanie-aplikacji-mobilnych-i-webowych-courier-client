import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { TokenContext } from '../../context';

const useStyles = makeStyles((theme) => ({
	list: {
		'& > div:not(:last-child)': {
			marginBottom: theme.spacing(1),
		},
	},
}));

type ChangeParcelStatusProps = {
	open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<Error|undefined>>;
	statusUrl: string|undefined;
};
const ChangeParcelStatus: React.FC<ChangeParcelStatusProps> = ({
	open,
    setOpen,
    setError,
	statusUrl,
}) => {
	const tokenContext = React.useContext(TokenContext);
	const [status, setStatus] = useState<string>('');
	const classes = useStyles();

	const onStatusChange = (event: React.ChangeEvent<{ value: string }>) =>
		setStatus(event.target.value);

	const onClose = () => {
		setStatus('');
		setOpen(false);
	};
	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		if (form.checkValidity()) {
            if (!process.env.REACT_APP_WEB_SERVICE_URL || !statusUrl) {
                setError(new Error("Nie można zmienić statusu"));
				onClose();
                return;
            }
            const url = process.env.REACT_APP_WEB_SERVICE_URL + statusUrl;
            let res;
            const headers = tokenContext?.token ? { 'Authorization': `Bearer ${tokenContext.token}`} : undefined
            try {
                res = await fetch(url, { 
					method: 'PUT', 
					headers: { ...headers, 'Content-Type': 'application/json' }, 
					body: JSON.stringify({ status })
				});
            } catch (e) {
                setError(e);
				onClose();
                return;
            }
            if (res.status !== 204) {
				setError(new Error("Nie udało się zmienić statusu"));
				onClose();
                return;
            }
			onClose();
		}
	};
    const statuses = [
        "on_the_way",
        "delivered",
        "received"
    ]
	const statusToString = (status: string) => {
		switch (status) {
			case "on_the_way": return "W drodze";
			case "delivered": return "Dostarczona";
			case "received": return "Odebrana";
			default: return undefined;
		}
	}
	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<form onSubmit={onSubmit} noValidate>
				<DialogTitle id="form-dialog-title">Zmień status</DialogTitle>
				<DialogContent className={classes.list}>
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status paczki</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            value={status}
                            onChange={onStatusChange}
                            required
                        >
                            {statuses.map((s) => <MenuItem key={s} value={s}>{statusToString(s)}</MenuItem>)}
                        </Select>
                    </FormControl>
				</DialogContent>
				<DialogActions>
					<Button type="button" onClick={onClose}>
						Anuluj
					</Button>
					<Button type="submit">
						Potwierdź
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default ChangeParcelStatus;
