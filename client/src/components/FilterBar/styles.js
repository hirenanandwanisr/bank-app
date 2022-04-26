import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  filterWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap:'1rem'
  },
  btn: {
    textTransform: 'capitalize',
  },
  citySelect: {
    width: '200px',
  },
}));
