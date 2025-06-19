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

import { update, fetch } from '../../stores/units/unitsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditUnitsPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    unit_number: '',

    owner: null,

    balance: '',

    unit_factor: '',

    cond_fee: '',

    parking_stall: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { units } = useAppSelector((state) => state.units);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: id }));
  }, [id]);

  useEffect(() => {
    if (typeof units === 'object') {
      setInitialValues(units);
    }
  }, [units]);

  useEffect(() => {
    if (typeof units === 'object') {
      const newInitialVal = { ...initVals };
      Object.keys(initVals).forEach((el) => (newInitialVal[el] = units[el]));
      setInitialValues(newInitialVal);
    }
  }, [units]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }));
    await router.push('/units/units-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit units')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit units'}
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
              <FormField label='UnitNumber'>
                <Field name='unit_number' placeholder='UnitNumber' />
              </FormField>

              <FormField label='Owner' labelFor='owner'>
                <Field
                  name='owner'
                  id='owner'
                  component={SelectField}
                  options={initialValues.owner}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField label='Balance'>
                <Field type='number' name='balance' placeholder='Balance' />
              </FormField>

              <FormField label='Unit Factor'>
                <Field
                  type='number'
                  name='unit_factor'
                  placeholder='Unit Factor'
                />
              </FormField>

              <FormField label='Cond Fee'>
                <Field type='number' name='cond_fee' placeholder='Cond Fee' />
              </FormField>

              <FormField label='Parking Stall'>
                <Field
                  type='number'
                  name='parking_stall'
                  placeholder='Parking Stall'
                />
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
                  onClick={() => router.push('/units/units-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditUnitsPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_UNITS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditUnitsPage;
