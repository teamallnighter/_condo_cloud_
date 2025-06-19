import React from 'react';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import dataFormatter from '../../helpers/dataFormatter';
import { saveFile } from '../../helpers/fileSaver';
import ListActionsPopover from '../ListActionsPopover';
import { useAppSelector } from '../../stores/hooks';
import { Pagination } from '../Pagination';
import LoadingSpinner from '../LoadingSpinner';
import Link from 'next/link';

import { hasPermission } from '../../helpers/userPermissions';

type Props = {
  units: any[];
  loading: boolean;
  onDelete: (id: string) => void;
  currentPage: number;
  numPages: number;
  onPageChange: (page: number) => void;
};

const ListUnits = ({
  units,
  loading,
  onDelete,
  currentPage,
  numPages,
  onPageChange,
}: Props) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const hasUpdatePermission = hasPermission(currentUser, 'UPDATE_UNITS');

  const corners = useAppSelector((state) => state.style.corners);
  const bgColor = useAppSelector((state) => state.style.cardsColor);

  return (
    <>
      <div className='relative overflow-x-auto p-4 space-y-4'>
        {loading && <LoadingSpinner />}
        {!loading &&
          units.map((item) => (
            <div key={item.id}>
              <CardBox hasTable isList className={'rounded shadow-none'}>
                <div
                  className={`flex rounded  dark:bg-dark-900  border  border-stone-300  items-center overflow-hidden`}
                >
                  <Link
                    href={`/units/units-view/?id=${item.id}`}
                    className={
                      'flex-1 px-4 py-6 h-24 flex divide-x-2  divide-stone-300   items-center overflow-hidden`}> dark:divide-dark-700 overflow-x-auto'
                    }
                  >
                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>UnitNumber</p>
                      <p className={'line-clamp-2'}>{item.unit_number}</p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>Owner</p>
                      <p className={'line-clamp-2'}>
                        {dataFormatter.usersOneListFormatter(item.owner)}
                      </p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>Balance</p>
                      <p className={'line-clamp-2'}>{item.balance}</p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>Unit Factor</p>
                      <p className={'line-clamp-2'}>{item.unit_factor}</p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>Cond Fee</p>
                      <p className={'line-clamp-2'}>{item.cond_fee}</p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>
                        Parking Stall
                      </p>
                      <p className={'line-clamp-2'}>{item.parking_stall}</p>
                    </div>

                    <div className={'flex-1 px-3'}>
                      <p className={'text-xs   text-gray-500 '}>Owners</p>
                      <p className={'line-clamp-2'}>
                        {dataFormatter
                          .ownersManyListFormatter(item.owners)
                          .join(', ')}
                      </p>
                    </div>
                  </Link>
                  <ListActionsPopover
                    onDelete={onDelete}
                    itemId={item.id}
                    pathEdit={`/units/units-edit/?id=${item.id}`}
                    pathView={`/units/units-view/?id=${item.id}`}
                    hasUpdatePermission={hasUpdatePermission}
                  />
                </div>
              </CardBox>
            </div>
          ))}
        {!loading && units.length === 0 && (
          <div className='col-span-full flex items-center justify-center h-40'>
            <p className=''>No data to display</p>
          </div>
        )}
      </div>
      <div className={'flex items-center justify-center my-6'}>
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          setCurrentPage={onPageChange}
        />
      </div>
    </>
  );
};

export default ListUnits;
