import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/units/unitsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const UnitsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { units } = useAppSelector((state) => state.units);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View units')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View units')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/units/units-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>UnitNumber</p>
            <p>{units?.unit_number}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Owner</p>

            <p>{units?.owner?.firstName ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Balance</p>
            <p>{units?.balance || 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Unit Factor</p>
            <p>{units?.unit_factor || 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Cond Fee</p>
            <p>{units?.cond_fee || 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Maintenance_requests Unit</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>

                      <th>Status</th>

                      <th>RequestDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.maintenance_requests_unit &&
                      Array.isArray(units.maintenance_requests_unit) &&
                      units.maintenance_requests_unit.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/maintenance_requests/maintenance_requests-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='description'>{item.description}</td>

                          <td data-label='status'>{item.status}</td>

                          <td data-label='request_date'>
                            {dataFormatter.dateTimeFormatter(item.request_date)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!units?.maintenance_requests_unit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/units/units-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

UnitsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_UNITS'}>{page}</LayoutAuthenticated>
  );
};

export default UnitsView;
