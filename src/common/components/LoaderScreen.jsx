import { Box, Img } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import useStyle from '../hooks/useStyle';

const LoaderScreen = ({ width, height, ...rest }) => {
  const { backgroundColor } = useStyle();

  return (
    <Box
      display="flex"
      alignItems="center"
      position="absolute"
      background={backgroundColor}
      justifyContent="center"
      width="100%"
      height="100%"
      style={{ zIndex: 50 }}
      top="0px"
      left="0px"
      {...rest}
    >
      <Img
        src="/static/images/loader.gif"
        width={width}
        height={height}
      />
      {/* <Img
        src="/4Geeks.ico"
        width="35px"
        height="35px"
        position="absolute"
        mt="6px"
        zIndex="40"
        boxShadow="0px 0px 16px 0px #0097cd"
        borderRadius="40px"
      />
      <Box className="loader" /> */}
    </Box>
  );
};

LoaderScreen.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  rest: PropTypes.objectOf(PropTypes.any),
};
LoaderScreen.defaultProps = {
  width: '200px',
  height: '200px',
  rest: {},
};

export default LoaderScreen;
