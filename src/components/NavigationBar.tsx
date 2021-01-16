import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
        toolbar: {
            padding: 0,
        },
		toolbarContainer: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
			display: 'flex',
			justifyContent: 'space-between',
        },
	})
);

const NavigationBar: React.FC = () => {
	const { user, logout } = useAuth0();
	const classes = useStyles();
	return (
		<AppBar position="static">
			<Toolbar className={classes.toolbar}>
				<Container className={classes.toolbarContainer}>
					{user?.picture ? <Avatar alt={user.name} src={user.picture}/> : <Avatar>{user.nickname ? user.nickname[0] : '?'}</Avatar>}
					<Button color="inherit" endIcon={<ExitToAppIcon />} onClick={() => logout()}>
						Wyloguj
					</Button>
				</Container>
			</Toolbar>
		</AppBar>
	);
};

export default NavigationBar;
