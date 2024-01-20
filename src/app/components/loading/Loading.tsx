import { Box, CircularProgress } from '@mui/material';
import React from 'react';

type Props = {
  // eslint-disable-next-line react/no-unused-prop-types
  loading?: boolean;
  sx?: any;
};

const LoadingComponent = (props: Props) => {
  const { loading,sx } = props;
  const renderLoading = () => {
    if (loading) {
      return <CircularProgress sx={{ ml: 3, mt: 2,...sx }} color="success" />;
    }
    return '';
  };
  return  loading ? (
  <Box sx={{
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}>{renderLoading()}</Box>):<></>
};

export default LoadingComponent;
