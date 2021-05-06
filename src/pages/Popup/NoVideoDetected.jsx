import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    marginBottom: theme.spacing(4),
  },
}));

export default function NoVideoDetected() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert severity="error">
        <AlertTitle>No Video Detected</AlertTitle>
        Is there a video on this page? If so, please let us know so we can add
        this site to the extension.
      </Alert>
    </div>
  );
}
