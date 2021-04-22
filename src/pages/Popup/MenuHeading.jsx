import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const MenuHeading = (props) => {
  return (
    <Container>
      <Typography color="primary">{props.heading}</Typography>
    </Container>
  );
};

export default MenuHeading;
