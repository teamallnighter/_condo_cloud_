import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import BaseButton from '../components/BaseButton';
import CardBox from '../components/CardBox';
import BaseIcon from '../components/BaseIcon';
import { mdiInformation, mdiEye, mdiEyeOff } from '@mdi/js';
import SectionFullScreen from '../components/SectionFullScreen';
import LayoutGuest from '../layouts/Guest';
import { Field, Form, Formik } from 'formik';
import FormField from '../components/FormField';
import FormCheckRadio from '../components/FormCheckRadio';
import BaseDivider from '../components/BaseDivider';
import BaseButtons from '../components/BaseButtons';
import { useRouter } from 'next/router';
import { getPageTitle } from '../config';
import { findMe, loginUser, resetAction } from '../stores/authSlice';
import { useAppDispatch, useAppSelector } from '../stores/hooks';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { getPexelsImage, getPexelsVideo } from '../helpers/pexels';

export default function Login() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const textColor = useAppSelector((state) => state.style.linkColor);
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const notify = (type, msg) => toast(msg, { type });
  const [illustrationImage, setIllustrationImage] = useState({
    src: undefined,
    photographer: undefined,
    photographer_url: undefined,
  });
  const [illustrationVideo, setIllustrationVideo] = useState({
    video_files: [],
  });
  const [contentType, setContentType] = useState('image');
  const [contentPosition, setContentPosition] = useState('background');
  const [showPassword, setShowPassword] = useState(false);
  const {
    currentUser,
    isFetching,
    errorMessage,
    token,
    notify: notifyState,
  } = useAppSelector((state) => state.auth);
  const [initialValues, setInitialValues] = React.useState({
    email: 'admin@flatlogic.com',
    password: '222a0b2a',
    remember: true,
  });

  const title = 'condocloud';

  // Fetch Pexels image/video
  useEffect(() => {
    async function fetchData() {
      const image = await getPexelsImage();
      const video = await getPexelsVideo();
      setIllustrationImage(image);
      setIllustrationVideo(video);
    }
    fetchData();
  }, []);
  // Fetch user data
  useEffect(() => {
    if (token) {
      dispatch(findMe());
    }
  }, [token, dispatch]);
  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (currentUser?.id) {
      router.push('/dashboard');
    }
  }, [currentUser?.id, router]);
  // Show error message if there is one
  useEffect(() => {
    if (errorMessage) {
      notify('error', errorMessage);
    }
  }, [errorMessage]);
  // Show notification if there is one
  useEffect(() => {
    if (notifyState?.showNotification) {
      notify('success', notifyState?.textNotification);
      dispatch(resetAction());
    }
  }, [notifyState?.showNotification]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (value) => {
    const { remember, ...rest } = value;
    await dispatch(loginUser(rest));
  };

  const setLogin = (target: HTMLElement) => {
    setInitialValues((prev) => ({
      ...prev,
      email: target.innerText.trim(),
      password: target.dataset.password ?? '',
    }));
  };

  const imageBlock = (image) => (
    <div
      className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'
      style={{
        backgroundImage: `${
          image
            ? `url(${image.src?.original})`
            : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
        }`,
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='flex justify-center w-full bg-blue-300/20'>
        <a
          className='text-[8px]'
          href={image?.photographer_url}
          target='_blank'
          rel='noreferrer'
        >
          Photo by {image?.photographer} on Pexels
        </a>
      </div>
    </div>
  );

  const videoBlock = (video) => {
    if (video?.video_files?.length > 0) {
      return (
        <div className='hidden md:flex flex-col justify-end relative flex-grow-0 flex-shrink-0 w-1/3'>
          <video
            className='absolute top-0 left-0 w-full h-full object-cover'
            autoPlay
            loop
            muted
          >
            <source src={video.video_files[0]?.link} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
          <div className='flex justify-center w-full bg-blue-300/20 z-10'>
            <a
              className='text-[8px]'
              href={video.user.url}
              target='_blank'
              rel='noreferrer'
            >
              Video by {video.user.name} on Pexels
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      style={
        contentPosition === 'background'
          ? {
              backgroundImage: `${
                illustrationImage
                  ? `url(${illustrationImage.src?.original})`
                  : 'linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))'
              }`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      <Head>
        <title>
          {getPageTitle(t('pages.login.pageTitle', { defaultValue: 'Login' }))}
        </title>
      </Head>

      <SectionFullScreen bg='violet'>
        <div
          className={`flex ${
            contentPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
          } min-h-screen w-full`}
        >
          {contentType === 'image' && contentPosition !== 'background'
            ? imageBlock(illustrationImage)
            : null}
          {contentType === 'video' && contentPosition !== 'background'
            ? videoBlock(illustrationVideo)
            : null}
          <div className='flex items-center justify-center flex-col space-y-4 w-full lg:w-full'>
            <CardBox id='loginRoles' className='w-full md:w-3/5 lg:w-2/3'>
              <h2 className='text-4xl font-semibold my-4'>{title}</h2>

              <div className='flex flex-row text-gray-500 justify-between'>
                <div>
                  <p className='mb-2'>
                    Use{' '}
                    <code
                      className={`cursor-pointer ${textColor} `}
                      data-password='222a0b2a'
                      onClick={(e) => setLogin(e.target)}
                    >
                      admin@flatlogic.com
                    </code>
                    {' / '}
                    <code className={`${textColor}`}>222a0b2a</code>
                    {' / '}
                    to login as Admin
                  </p>
                  <p>
                    Use{' '}
                    <code
                      className={`cursor-pointer ${textColor} `}
                      data-password='0d05cdd5d20a'
                      onClick={(e) => setLogin(e.target)}
                    >
                      client@hello.com
                    </code>
                    {' / '}
                    <code className={`${textColor}`}>0d05cdd5d20a</code>
                    {' / '}
                    to login as User
                  </p>
                </div>
                <div>
                  <BaseIcon
                    className={`${iconsColor}`}
                    w='w-16'
                    h='h-16'
                    size={48}
                    path={mdiInformation}
                  />
                </div>
              </div>
            </CardBox>

            <CardBox className='w-full md:w-3/5 lg:w-2/3'>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => handleSubmit(values)}
              >
                <Form>
                  <FormField
                    label={t('pages.login.form.loginLabel', {
                      defaultValue: 'Login',
                    })}
                    help={t('pages.login.form.loginHelp', {
                      defaultValue: 'Please enter your login',
                    })}
                  >
                    <Field name='email' />
                  </FormField>

                  <div className='relative'>
                    <FormField
                      label={t('pages.login.form.passwordLabel', {
                        defaultValue: 'Password',
                      })}
                      help={t('pages.login.form.passwordHelp', {
                        defaultValue: 'Please enter your password',
                      })}
                    >
                      <Field
                        name='password'
                        type={showPassword ? 'text' : 'password'}
                      />
                    </FormField>
                    <div
                      className='absolute bottom-8 right-0 pr-3 flex items-center cursor-pointer'
                      onClick={togglePasswordVisibility}
                    >
                      <BaseIcon
                        className='text-gray-500 hover:text-gray-700'
                        size={20}
                        path={showPassword ? mdiEyeOff : mdiEye}
                      />
                    </div>
                  </div>

                  <div className={'flex justify-between'}>
                    <FormCheckRadio
                      type='checkbox'
                      label={t('pages.login.form.remember', {
                        defaultValue: 'Remember',
                      })}
                    >
                      <Field type='checkbox' name='remember' />
                    </FormCheckRadio>

                    <Link
                      className={`${textColor} text-blue-600`}
                      href={'/forgot'}
                    >
                      {t('pages.login.form.forgotPassword', {
                        defaultValue: 'Forgot password?',
                      })}
                    </Link>
                  </div>

                  <BaseDivider />

                  <BaseButtons>
                    <BaseButton
                      className={'w-full'}
                      type='submit'
                      label={
                        isFetching
                          ? t('pages.login.form.loading', {
                              defaultValue: 'Loading...',
                            })
                          : t('pages.login.form.loginButton', {
                              defaultValue: 'Login',
                            })
                      }
                      color='info'
                      disabled={isFetching}
                    />
                  </BaseButtons>
                  <br />
                  <p className={'text-center'}>
                    {t('pages.login.form.noAccountYet', {
                      defaultValue: 'Don’t have an account yet?',
                    })}{' '}
                    <Link className={`${textColor}`} href={'/register'}>
                      {t('pages.login.form.newAccount', {
                        defaultValue: 'New Account',
                      })}
                    </Link>
                  </p>
                </Form>
              </Formik>
            </CardBox>
          </div>
        </div>
      </SectionFullScreen>
      <div className='bg-black text-white flex flex-col text-center justify-center md:flex-row'>
        <p className='py-6 text-sm'>
          © 2024 <span>{title}</span>.{' '}
          {t('pages.login.footer.copyright', {
            defaultValue: '© All rights reserved',
          })}
        </p>
        <Link className='py-6 ml-4 text-sm' href='/privacy-policy/'>
          {t('pages.login.footer.privacy', { defaultValue: 'Privacy Policy' })}
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
