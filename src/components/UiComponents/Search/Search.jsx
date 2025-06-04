import { InstantSearch, SearchBox, Hits, useSearchBox, Highlight, useInstantSearch } from 'react-instantsearch';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { useEffect, useState, useRef, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { NoResultsIcon, UserNoBorderIcon, ArrowToTop } from '~/components/UiComponents/Icon';
import SearchInput from './SearchInput';

const searchClient = algoliasearch(import.meta.env.VITE_APP_ID, import.meta.env.VITE_SEARCH_API_KEY);

function Hit({ hit }) {
    const { t } = useTranslation();

    return (
        <div className='flex group h-12'>
            <Link
                className='flex items-center justify-between basis-1/2 py-2 px-4 gap-2 group cursor-pointer hover:bg-primary'
                to={`/drivers/${hit.idDriver}`}
            >
                {/* RESULTS (DRIVER) */}
                <div className='flex items-center justify-center gap-2'>
                    <UserNoBorderIcon className='size-6 text-gray-400 group-hover:text-white' />
                    <span className='text-[15px] text-[#23272f] font-normal group-hover:text-white'>
                        <Highlight attribute='lastName' hit={hit} /> <Highlight attribute='firstName' hit={hit} />
                    </span>
                </div>
                <ArrowToTop className='hidden! size-4 group-hover:block! group-hover:text-white' />

                {/* OVERVIEW */}
                <div className='hidden absolute top-0 right-0 px-4 w-[50%] h-full text-start group-hover:block'>
                    <div className='flex flex-col'>
                        <div className='p-2 border border-border rounded-xl'>
                            <div className='flex items-center gap-2 col-span-2'>
                                <img
                                    className='justify-self-center w-13 h-13 min-w-13 rounded-full object-cover'
                                    src={`${import.meta.env.VITE_BASE_URL}/public/images/${hit.avatar}`}
                                    alt='Avatar'
                                />
                                <div className='flex flex-col gap-[2px]'>
                                    <span className='text-[15px] text-black font-bold dark:text-white-dark'>{`${hit.lastName} ${hit.firstName}`}</span>
                                    <span className='profile-title font-semibold'>{hit.idDriver}</span>
                                    <span className='profile-title'>{`${hit.city}, ${hit.country}`}</span>
                                </div>
                            </div>
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <h2 className='col-span-2 text-[15px] font-bold dark:text-white-dark'>
                                    {t('Personal Information')}
                                </h2>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='profile-title'>{t('First Name')}</h3>
                                    <span className='profile-data dark:text-white-dark'>{hit.firstName}</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='profile-title'>{t('Last Name')}</h3>
                                    <span className='profile-data dark:text-white-dark'>{hit.lastName}</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='profile-title'>{t('Phone Number')}</h3>
                                    <span className='profile-data dark:text-white-dark'>{hit.phone}</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='profile-title'>{t('Date of Birth')}</h3>
                                    <span className='profile-data dark:text-white-dark'>{hit.dateOfBirth}</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <h3 className='profile-title'>{t('Email Address')}</h3>
                                    <span className='profile-data dark:text-white-dark'>{hit.emailAddress}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

function NoResultsBoundary({ children, fallback }) {
    const { results } = useInstantSearch();

    if (!results.__isArtificial && results.nbHits === 0) {
        return (
            <>
                {fallback}
                <div hidden>{children}</div>
            </>
        );
    }

    return children;
}

function NoResults() {
    const { indexUiState } = useInstantSearch();
    const { t } = useTranslation();

    return (
        <div className='flex flex-col items-center justify-center mt-10 truncate break-all'>
            <NoResultsIcon className='text-gray-400 size-10' />
            <p className='p-4 text-wrap text-lg text-center text-gray-500 font-medium'>
                {t('No results for')} '<span className='font-bold'>{indexUiState.query}</span>'
            </p>
        </div>
    );
}

function EmptyQueryBoundary({ children, fallback }) {
    const { indexUiState } = useInstantSearch();
    const { t } = useTranslation();

    if (!indexUiState.query) {
        return (
            <>
                {fallback}
                <div hidden>{children}</div>
                <div className='text-sm text-center text-gray-500 py-4 mt-12'>{t('No recent searches')}</div>
            </>
        );
    }

    return children;
}

function Search({ onClick }) {
    const { t } = useTranslation();

    if (onClick) {
        return (
            <SearchInput onClick={onClick}>
                <span className='ms-auto sm:flex item-center me-1'>
                    <kbd className='inline-flex justify-center items-center ml-[10px] me-1 w-10 h-5 bg-white rounded-md dark:bg-dark-bg'>
                        Ctrl
                    </kbd>
                    <kbd className='inline-flex justify-center items-center ml-[5px] me-1 w-5 h-5 bg-white rounded-md dark:bg-dark-bg'>
                        K
                    </kbd>
                </span>
            </SearchInput>
        );
    }

    return (
        <InstantSearch searchClient={searchClient} indexName='Drivers'>
            <div className='flex items-center justify-center px-4 mb-3'>
                <SearchBox
                    className='px-4 h-[40px] w-full overflow-hidden text-[15px] text-[oklch(55.1%_.027_264.364)] font-normal bg-gray-500/10 content-center rounded-full dark:bg-gray-40/20 dark:border'
                    placeholder={t('Search driver...')}
                />
            </div>

            <div className='relative'>
                <NoResultsBoundary fallback={<NoResults />}>
                    <EmptyQueryBoundary fallback={null}>
                        <Hits hitComponent={Hit} />
                    </EmptyQueryBoundary>
                </NoResultsBoundary>
            </div>
            <div className='absolute bottom-4 right-4 flex items-center gap-1 text-xs text-gray-600'>
                {t('Press')}
                <kbd className='inline-flex justify-center items-center px-1 text-sm bg-gray-300 text-black border border-border rounded-md cursor-default dark:bg-dark-bg'>
                    esc
                </kbd>
                {t('to close')}
            </div>
        </InstantSearch>
    );
}

export default Search;
