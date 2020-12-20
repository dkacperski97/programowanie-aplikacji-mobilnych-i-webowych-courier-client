import React from 'react';
import Alert from '@material-ui/core/Alert';
import AlertTitle from '@material-ui/core/AlertTitle';

type ApiErrorAlertProps = {
	error: Error;
};
const ApiErrorAlert: React.FC<ApiErrorAlertProps> = ({ error }) => (
	<Alert severity="error">
		<AlertTitle>Błąd</AlertTitle>
		{error.message}
	</Alert>
);

export default ApiErrorAlert;
