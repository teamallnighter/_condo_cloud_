import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/owners/ownersSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditOwnersPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    lives_on_site: false,

    emergency_contact: '',

    mailing_address: '',

    unit: [],
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { owners } = useAppSelector((state) => state.owners);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof owners === 'object') {
      setInitialValues(owners);
    }
  }, [owners]);

  useEffect(() => {
    if (typeof owners === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach((el) => (newInitialVal[el] = owners[el]));
      setInitialValues(newInitialVal);
    }
  }, [owners]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/owners/owners-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit owners')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit owners'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Lives On Site' labelFor='lives_on_site'>
                <Field
                  name='lives_on_site'
                  id='lives_on_site'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='Emergency Contact'>
                <Field
                  name='emergency_contact'
                  placeholder='Emergency Contact'
                />
              </FormField>

              <FormField label='Mailing Address' hasTextareaHeight>
                <Field
                  name='mailing_address'
                  id='mailing_address'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Unit' labelFor='unit'>
                <Field
                  name='unit'
                  id='unit'
                  component={SelectFieldMany}
                  options={initialValues.unit}
                  itemRef={'units'}
                  showField={'unit_number'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/owners/owners-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditOwnersPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_OWNERS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditOwnersPage;
