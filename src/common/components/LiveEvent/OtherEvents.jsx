import { useEffect, useState } from 'react';
import {
  Box, Tag, TagLabel,
} from '@chakra-ui/react';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import modifyEnv from '../../../../modifyEnv';
import { getStorageItem, lengthOfString, syncInterval } from '../../../utils';
import useStyle from '../../hooks/useStyle';
import CustomTheme from '../../../../styles/theme';
import Icon from '../Icon';
import Link from '../NextChakraLink';
import Text from '../Text';

const OtherEvents = ({ events, isLiveOrStarting, isLive, textTime, subLabel, stTranslation }) => {
  const { t, lang } = useTranslation('live-event');
  const { hexColor, disabledColor, fontColor } = useStyle();
  const accessToken = getStorageItem('accessToken');
  const BREATHECODE_HOST = modifyEnv({ queryString: 'host', env: process.env.BREATHECODE_HOST });
  const limit = 40;

  return events.map((event) => {
    const [time, setTime] = useState('');
    const titleLength = lengthOfString(event?.title);
    const startsAt = event?.starting_at && new Date(event.starting_at);
    const endsAt = event?.ending_at && new Date(event.ending_at);
    const truncatedText = titleLength > limit ? `${event?.title?.substring(0, limit)}...` : event?.title;
    const truncatedTime = lengthOfString(time) >= 16 ? `${time?.substring(0, 15)}...` : time;

    useEffect(() => {
      setTime(textTime(startsAt, endsAt));

      syncInterval(() => {
        setTime(textTime(startsAt, endsAt));
      });
      // const interval = setInterval(() => {
      //   setTime(textTime(startsAt, endsAt));
      // }, 60000);
      // return () => {
      //   clearInterval(interval);
      // };
    }, []);

    return (
      <Box
        key={event?.id}
        padding="10px"
        borderBottom="1px solid"
        width="90%"
        margin="auto"
        borderColor="#DADADA"
      >
        <Box display="flex">
          <Box width="37px" height="37px" style={{ minWidth: '37px' }} className={isLiveOrStarting(startsAt, endsAt) ? 'pulse-blue' : ''} borderRadius="full">
            {event?.event_type?.icon_url ? (
              <Image src={event?.event_type?.icon_url} name={event?.title} width={40} height={40} />
            ) : (
              <Icon fill={event.fill || hexColor.greenLight} color={event.color} style={{ flexShrink: 0 }} width="37px" height="37px" icon={event.icon || 'group'} />
            )}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="column"
            marginLeft="10px"
          >
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${BREATHECODE_HOST}/v1/events/me/event/${event?.id}/join?token=${accessToken}` || '#'}
              // href={`/${lang}/workshops/${event?.slug}` || '#'}
              color={fontColor}
              fontSize="15px"
              lineHeight="18px"
              fontWeight="700"
              letterSpacing="0.05em"
              marginBottom="5px"
              marginTop="0"
              locale="en"
              fontFamily="Lato, Sans-serif"
              title={event?.title}
            // onClick={(e) => {
            //   e?.preventDefault();

            //   bc.payment({ academy: event?.academy }).getEvent(event.id)
            //     .then(({ data }) => {
            //       if (data?.live_stream_url) {
            //         window.open(data?.live_stream_url);
            //       } else {
            //         toast({
            //           title: t('inactive-event'),
            //           status: 'info',
            //           duration: 5000,
            //           isClosable: true,
            //         });
            //       }
            //     })
            //     .catch(() => {
            //       toast({
            //         title: t('no-access'),
            //         status: 'error',
            //         duration: 5000,
            //         isClosable: true,
            //       });
            //     });
            // }}
            >
              {truncatedText}
            </Link>
          </Box>
        </Box>
        <Box marginTop="10px" display="flex" justifyContent="space-between">
          {(event?.type || subLabel) && (
            <Tag
              size="sm"
              borderRadius="full"
              variant="solid"
              colorScheme="green"
              width="fit-content"
              background={CustomTheme.colors.green.light}
              flexShrink="0"
              height="20px"
              marginRight="5px"
            >
              <TagLabel
                fontWeight="700"
                color={CustomTheme.colors.success}
              >
                {event?.type || subLabel}
              </TagLabel>
            </Tag>
          )}
          {isLive(startsAt, endsAt) ? (
            <Tag
              size="sm"
              borderRadius="full"
              variant="solid"
              colorScheme="green"
              width="fit-content"
              background={CustomTheme.colors.red.light}
            >
              <TagLabel
                fontWeight="700"
                color={CustomTheme.colors.danger}
              >
                {stTranslation ? `• ${stTranslation[lang]['live-event']['live-now']}` : `• ${t('live-now')}`}
              </TagLabel>
            </Tag>
          ) : (
            <Text
              fontSize="13px"
              lineHeight="18px"
              fontWeight={500}
              color={disabledColor}
              marginBottom="0"
              marginTop="0"
            >
              {truncatedTime}
            </Text>
          )}
        </Box>
      </Box>
    );
  });
};

export default OtherEvents;
