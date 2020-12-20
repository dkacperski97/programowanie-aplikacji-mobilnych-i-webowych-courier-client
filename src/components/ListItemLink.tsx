import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

type ListItemLinkProps = {
    to: string;
}
const ListItemLink: React.FC<ListItemLinkProps> = ({ children, to }) => {
    const renderLink = React.useMemo(
        () =>
          React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
            <RouterLink to={to} ref={ref} {...itemProps} />
          )),
        [to],
    );

	return (
        <ListItem button component={renderLink}>
            {children}
        </ListItem>
	);
};

export default ListItemLink;
