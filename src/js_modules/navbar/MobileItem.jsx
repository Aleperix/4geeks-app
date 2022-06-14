import {
  Box,
  Flex,
  Text,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import NextChakraLink from '../../common/components/NextChakraLink';
import Icon from '../../common/components/Icon';
import { isAbsoluteUrl } from '../../utils/url';

const MobileItem = ({
  label, subMenu, href, asPath, description, icon,
}) => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const linkColor = useColorModeValue('gray.600', 'gray.200');

  const getColorLink = (link) => {
    if (router?.pathname === link || router.asPath === link || router?.pathname.includes(link)) {
      return 'blue.default';
    }
    return linkColor;
  };

  return (
    <Stack spacing={4}>
      {/* Box is important for popover content trigger */}
      {!subMenu && (
        <Box>
          <NextChakraLink
            py={2}
            href={href}
            target={isAbsoluteUrl(href) ? '_blank' : undefined}
            rel={isAbsoluteUrl(href) ? 'noopener noreferrer' : undefined}
            display="flex"
            justifyContent="space-between"
            align="center"
            _hover={{
              textDecoration: 'none',
              color: 'blue.default',
            }}
          >
            <Text fontWeight={400} color={getColorLink(href || asPath)}>
              {label}
            </Text>
          </NextChakraLink>
        </Box>
      )}
      {subMenu && (
        <Flex
          py={2}
          justifyContent="left"
          gridGap="10px"
          align="center"
          cursor="pointer"
          onClick={subMenu && onToggle}
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Text fontWeight={400} color={getColorLink(href || asPath)}>
            {label}
          </Text>
          <Box
            display="flex"
            onClick={(e) => e.preventDefault()}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
          >
            <Icon icon="arrowRight" color="gray" width="12px" height="12px" />
          </Box>
        </Flex>
      )}

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          pl={4}
          borderLeft="2px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align="start"
        >
          <Flex
            flexDirection="row"
            padding="20px 0"
            gridGap="15px"
            borderBottom={1}
            borderStyle="solid"
            borderColor={useColorModeValue('gray.200', 'gray.900')}
            alignItems="center"
            color={linkColor}
          >
            <Box width="auto">
              <Icon icon={icon} width="50px" height="50px" />
            </Box>
            <Box display="flex" flexDirection="column">
              <Text size="xl" fontWeight={900}>
                {label}
              </Text>
              <Text color={linkColor} fontWeight={500}>
                {description}
              </Text>
            </Box>
          </Flex>

          {subMenu
            && subMenu.map((child) => (
              <NextChakraLink
                key={child.label}
                color={getColorLink(child.href)}
                style={{ textDecoration: 'none' }}
                py={2}
                href={child.href}
              >
                {child.label}
              </NextChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

MobileItem.propTypes = {
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.string,
  href: PropTypes.string,
  asPath: PropTypes.string,
  subMenu: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      subLabel: PropTypes.string,
      href: PropTypes.string,
    }),
  ),
};

MobileItem.defaultProps = {
  asPath: '',
  href: '/',
  description: '',
  icon: 'book',
  subMenu: undefined,
};

export default MobileItem;
