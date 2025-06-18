import React from 'react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useAppSelector } from '../stores/hooks';
import { useTranslation } from 'next-i18next';

const Search = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const focusRing = useAppSelector((state) => state.style.focusRingColor);
  const corners = useAppSelector((state) => state.style.corners);
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const validateSearch = (value) => {
    let error;
    if (!value) {
      error = t('components.search.required');
    } else if (value.length < 2) {
      error = t('components.search.minLength', { count: 2 });
    }
    return error;
  };
  return (
    <Formik
      initialValues={{
        search: '',
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        router.push(`/search?query=${values.search}`);
        resetForm();
        setSubmitting(false);
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ errors, touched, values }) => (
        <Form style={{ width: '300px' }}>
          <Field
            id='search'
            name='search'
            validate={validateSearch}
            placeholder={t('components.search.placeholder', {
              defaultValue: 'Search',
            })}
            className={` ${corners} dark:bg-dark-900 ${cardsStyle}   dark:border-dark-700 p-2 relative ml-2 w-full dark:placeholder-dark-600 ${focusRing} shadow-none`}
          />
          {errors.search && touched.search && values.search.length < 2 ? (
            <div className='text-red-500 text-sm ml-2 absolute'>
              {errors.search}
            </div>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};
export default Search;
