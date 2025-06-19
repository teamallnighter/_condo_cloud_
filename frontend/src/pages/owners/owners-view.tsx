import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/owners/ownersSlice';
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

const OwnersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { owners } = useAppSelector((state) => state.owners);

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
        <title>{getPageTitle('View owners')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View owners')}
          main
        >
          <BaseButton
            color='info'
            label='Edit'
            href={`/owners/owners-edit/?id=${id}`}
          />
        </SectionTitleLineWithButton>
        <CardBox>
          <FormField label='Lives On Site'>
            <SwitchField
              field={{ name: 'lives_on_site', value: owners?.lives_on_site }}
              form={{ setFieldValue: () => null }}
              disabled
            />
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Emergency Contact</p>
            <p>{owners?.emergency_contact}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Mailing Address</p>
            {owners.mailing_address ? (
              <p dangerouslySetInnerHTML={{ __html: owners.mailing_address }} />
            ) : (
              <p>No data</p>
            )}
          </div>

          <>
            <p className={'block font-bold mb-2'}>Unit</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>UnitNumber</th>

                      <th>Balance</th>

                      <th>Unit Factor</th>

                      <th>Cond Fee</th>

                      <th>Parking Stall</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.unit &&
                      Array.isArray(owners.unit) &&
                      owners.unit.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/units/units-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='unit_number'>{item.unit_number}</td>

                          <td data-label='balance'>{item.balance}</td>

                          <td data-label='unit_factor'>{item.unit_factor}</td>

                          <td data-label='cond_fee'>{item.cond_fee}</td>

                          <td data-label='parking_stall'>
                            {item.parking_stall}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!owners?.unit?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/owners/owners-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OwnersView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_OWNERS'}>{page}</LayoutAuthenticated>
  );
};

export default OwnersView;
