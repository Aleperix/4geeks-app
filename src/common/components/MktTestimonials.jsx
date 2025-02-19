/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import {
  Box, Avatar,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GridContainer from './GridContainer';
import Heading from './Heading';
import Text from './Text';
import useStyle from '../hooks/useStyle';
import StarRating from './StarRating';
import { lengthOfString } from '../../utils';
import axios from '../../axios';
import modifyEnv from '../../../modifyEnv';

const MktTestimonials = ({
  id,
  title,
  endpoint,
  testimonials,
  ...rest
}) => {
  const [testimonialsData, setTestimonialsData] = useState();
  const BREATHECODE_HOST = modifyEnv({ queryString: 'host', env: process.env.BREATHECODE_HOST });
  const router = useRouter();
  const { fontColor2, featuredColor } = useStyle();
  const defaultEndpoint = `${BREATHECODE_HOST}/v1/feedback/review?lang=${router?.locale}`;

  useEffect(() => {
    if (typeof endpoint === 'string' && endpoint?.length > 6) {
      axios.get(endpoint || defaultEndpoint)
        .then((response) => {
          const data = response?.data;

          if (typeof data === 'string') {
            setTestimonialsData([]);
          } else {
            setTestimonialsData(data);
          }
        });
    }
  }, []);

  const testimonialsArray = (testimonialsData?.length > 0 && testimonialsData) || (testimonials?.length > 0 && testimonials);

  const TestimonialBox = ({ picture, name, rating, description }) => {
    const limit = 160;
    const descriptionLength = lengthOfString(description);
    const truncatedDescription = descriptionLength > limit ? `${description?.substring(0, limit)}...` : description;

    return (
      <Box
        width="250px"
        minWidth="250px"
        background={featuredColor}
        borderRadius="15px"
        padding="15px"
        textAlign="center"
      >
        <Avatar width="65px" height="65px" name={name} src={picture} />
        <Text marginTop="15px" lineHeight="16px" fontWeight="900" size="md">
          {name}
        </Text>
        <StarRating
          rating={rating}
          margin="6px 0 0 0"
          justifyContent="center"
        />
        <Text
          marginTop="10px"
          fontSize="var(--chakra-fontSizes-xs)"
          fontWeight="400"
          lineHeight="14px"
          color={fontColor2}
          title={description}
        >
          {`“${truncatedDescription}”`}
        </Text>
      </Box>
    );
  };

  return testimonialsArray && (
    <GridContainer
      gridTemplateColumns="repeat(10, 1fr)"
      px="10px"
      id={id}
      {...rest}
    >
      <Box
        display={{ base: 'block', md: 'grid' }}
        gridColumn="2 / span 8"
        flexDirection="column"
        px="10px"
        padding="20px 0"
        textAlign="center"
        width="100%"
        {...rest}
      >
        {title && (
          <Heading as="h2" size="sm" marginBottom="20px">
            {title}
          </Heading>
        )}
        <Box
          gridGap="20px"
          flexDirection="row"
          marginBottom="15px"
          display="flex"
          overflow="auto"
          justifyContent={{ base: 'inherit', md: 'center' }}
        >
          {testimonialsArray && testimonialsArray.map((testimonial) => (
            <TestimonialBox
              key={testimonial?.id}
              picture={testimonial?.author?.profile?.avatar_url}
              name={`${testimonial?.author?.first_name} ${testimonial?.author?.last_name}`}
              rating={testimonial?.total_rating}
              description={testimonial?.comments}
            />
          ))}
        </Box>
      </Box>
    </GridContainer>
  );
};

MktTestimonials.propTypes = {
  title: PropTypes.string,
  endpoint: PropTypes.string,
  testimonials: PropTypes.arrayOf(PropTypes.any),
};

MktTestimonials.defaultProps = {
  title: null,
  endpoint: '',
  testimonials: null,
};

export default MktTestimonials;
