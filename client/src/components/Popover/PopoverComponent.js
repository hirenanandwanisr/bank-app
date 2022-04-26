import React from 'react';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import useStyles from './styles';

const PopoverComponent = (props) => {
  const { element, children } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box display={'inline-block'} onClick={(e) => setAnchorEl(e.target)}>
        {element}
      </Box>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box className={classes.popoverContentWrapper}>{children}</Box>
      </Popover>
    </>
  );
};

export default PopoverComponent;
