/* eslint-disable camelcase */
import {
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import getT from 'next-translate/getT';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { getDataContentProps } from '../utils/file';
import bc from '../common/services/breathecode';
import useAuth from '../common/hooks/useAuth';
import ContactInformation from '../js_modules/checkout/ContactInformation';
import ChooseYourClass from '../js_modules/checkout/ChooseYourClass';
import { isWindow, getTimeProps, removeURLParameter, getQueryString, getStorageItem } from '../utils';
import Summary from '../js_modules/checkout/Summary';
import PaymentInfo from '../js_modules/checkout/PaymentInfo';
import useSignup from '../common/store/actions/signupAction';
import axiosInstance from '../axios';
import LoaderScreen from '../common/components/LoaderScreen';
import ModalInfo from '../js_modules/moduleMap/modalInfo';
import useStyle from '../common/hooks/useStyle';
import Stepper from '../js_modules/checkout/Stepper';

export const getStaticProps = async ({ locale, locales }) => {
  const t = await getT(locale, 'signup');
  const keywords = t('seo.keywords', {}, { returnObjects: true });
  const finance = getDataContentProps(`public/locales/${locale}`, 'finance');
  const image = t('seo.image', {
    domain: process.env.WEBSITE_URL || 'https://4geeks.com',
  });
  const ogUrl = {
    en: '/checkout',
    us: '/checkout',
  };

  return {
    props: {
      seo: {
        title: t('seo.title'),
        description: t('seo.description'),
        locales,
        locale,
        image,
        url: ogUrl.en || `/${locale}/checkout`,
        pathConnector: '/checkout',
        keywords,
      },
      fallback: false,
      finance,
      hideDivider: true,
    },
  };
};

const Checkout = () => {
  const { t } = useTranslation('signup');
  const router = useRouter();
  const [cohorts, setCohorts] = useState(null);
  const [isPreloading, setIsPreloading] = useState(false);
  const {
    state, toggleIfEnrolled, nextStep, prevStep, handleStep, handleChecking, setCohortPlans,
    isFirstStep, isSecondStep, isThirdStep, isFourthStep,
  } = useSignup();
  const { stepIndex, dateProps, checkoutData, alreadyEnrolled } = state;
  const { backgroundColor3 } = useStyle();

  axiosInstance.defaults.headers.common['Accept-Language'] = router.locale;
  const { user, isLoading } = useAuth();
  const toast = useToast();
  const plan = getQueryString('plan');
  const planFormated = plan && encodeURIComponent(plan);
  const accessToken = getStorageItem('accessToken');
  const tokenExists = accessToken !== null && accessToken !== undefined && accessToken.length > 5;

  const {
    course, cohort,
  } = router.query;
  const courseChoosed = course;

  const [formProps, setFormProps] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    confirm_email: '',
  });

  const queryPlanExists = planFormated && planFormated?.length > 0;
  const filteredCohorts = Array.isArray(cohorts) && cohorts.filter((item) => item?.never_ends === false);

  useEffect(() => {
    if (queryPlanExists && tokenExists) {
      setIsPreloading(true);
      if (cohorts && cohorts?.length <= 0) {
        toast({
          title: t('alert-message:no-course-configuration'),
          status: 'warning',
          duration: 4000,
          isClosable: true,
        });
      }
      if (cohorts && cohorts?.length > 0) {
        bc.payment().getPlan(planFormated)
          .then((resp) => {
            const data = resp?.data;
            const existsAmountPerHalf = data?.price_per_half > 0;
            const existsAmountPerMonth = data?.price_per_month > 0;
            const existsAmountPerQuarter = data?.price_per_quarter > 0;
            const existsAmountPerYear = data?.price_per_year > 0;
            const fiancioptionsExists = data?.financing_options?.length > 0 && data?.financing_options?.[0]?.monthly_price > 0;

            const isNotTrial = existsAmountPerHalf || existsAmountPerMonth || existsAmountPerQuarter || existsAmountPerYear || fiancioptionsExists;

            if ((resp && resp?.status >= 400) || resp?.data.length === 0) {
              toast({
                title: t('alert-message:no-plan-configuration'),
                status: 'info',
                duration: 4000,
                isClosable: true,
              });
            }

            if ((data?.is_renewable === false && !isNotTrial) || data?.is_renewable === true || cohorts?.length === 1) {
              if (resp.status < 400) {
                const { kickoffDate, weekDays, availableTime } = cohorts?.[0] ? getTimeProps(cohorts[0]) : {};
                const defaultQueryPropsAux = {
                  ...cohorts[0],
                  kickoffDate,
                  weekDays,
                  availableTime,
                };

                setCohortPlans([data]);
                handleChecking({ ...defaultQueryPropsAux, plan: data })
                  .then(() => {
                    handleStep(2);
                  })
                  .finally(() => {
                    setTimeout(() => {
                      setIsPreloading(false);
                    }, 650);
                  });
              }
            }

            if (data?.is_renewable === false || data?.is_renewable === undefined) {
              setIsPreloading(false);
              handleStep(1);
            }
          })
          .catch(() => {
            toast({
              title: t('alert-message:no-plan-configuration'),
              status: 'info',
              duration: 4000,
              isClosable: true,
            });
            setIsPreloading(false);
          });
      }
      setTimeout(() => {
        setIsPreloading(false);
      }, 1000);
    }
  }, [cohorts?.length, accessToken]);

  useEffect(() => {
    if (user?.id && !isLoading) {
      // if queryString token exists clean it from the url
      if (router.query.token) {
        const cleanTokenQuery = isWindow && removeURLParameter(window.location.href, 'token');
        router.push(cleanTokenQuery);
      }

      handleStep(1);
      setFormProps({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: '',
      });
    }
  }, [user?.id, cohort]);

  const handleGoBack = () => {
    const handler = () => {
      if (stepIndex > 0) {
        prevStep();
      }
    };
    return {
      isNotAvailable: (queryPlanExists && !isFourthStep && !dateProps?.id) || isSecondStep || (isThirdStep && filteredCohorts?.length === 1),
      func: handler,
    };
  };

  return (
    <Box p={{ base: '2.5rem 0', md: '2.5rem 2rem' }} background={backgroundColor3} position="relative" minHeight={isPreloading ? '727px' : null}>
      {isPreloading && (
        <LoaderScreen />
      )}
      <ModalInfo
        isOpen={alreadyEnrolled}
        forceHandler
        disableCloseButton
        title={t('already-adquired-plan-title')}
        isReadonly
        description={t('already-adquired-plan-description')}
        closeButtonVariant="outline"
        disableInput
        handlerText={t('subscriptions')}
        actionHandler={() => {
          if (window !== undefined) {
            toggleIfEnrolled(false);
            router.push('/profile/subscriptions');
          }
        }}
      />
      {/* Stepper */}
      <Stepper
        stepIndex={stepIndex}
        checkoutData={checkoutData}
        isFirstStep={isFirstStep}
        isSecondStep={isSecondStep}
        isThirdStep={isThirdStep}
        isFourthStep={isFourthStep}
        handleGoBack={handleGoBack}
      />

      <Box
        display="flex"
        flexDirection="column"
        gridGap={{ base: '20px', md: '20px' }}
        minHeight="320px"
        maxWidth={{ base: '100%', md: '900px' }}
        margin={{ base: '1.5rem auto 0 auto', md: '3.5rem auto 0 auto' }}
        padding={{ base: '0px 20px', md: '0' }}
        // borderRadius={{ base: '22px', md: '0' }}
      >
        {isFirstStep && (
          <ContactInformation
            courseChoosed={courseChoosed}
            formProps={formProps}
            setFormProps={setFormProps}
          />
        )}

        {/* Second step */}
        <ChooseYourClass setCohorts={setCohorts} />

        {isThirdStep && (
          <Summary />
        )}
        {/* Fourth step */}
        {isFourthStep && (
          <PaymentInfo />
        )}
        {((stepIndex !== 0 && !isSecondStep) || (stepIndex !== 0 && !isSecondStep && !isThirdStep && !isFourthStep)) && (
          <>
            <Box as="hr" width="100%" margin="10px 0" />
            <Box display="flex" justifyContent="space-between" mt="auto">
              {handleGoBack().isNotAvailable === false && (
                <Button
                  variant="outline"
                  borderColor="currentColor"
                  color="blue.default"
                  disabled={handleGoBack().isNotAvailable}
                  onClick={() => handleGoBack().func()}
                >
                  {t('go-back')}
                </Button>
              )}
              {stepIndex !== 0 && !isSecondStep && !isThirdStep && !isFourthStep && (
                <Button
                  variant="default"
                  disabled={dateProps === null}
                  onClick={() => {
                    nextStep();
                  }}
                >
                  {t('next-step')}
                </Button>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Checkout;
