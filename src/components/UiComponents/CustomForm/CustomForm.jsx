import { useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import * as Yup from 'yup';

import variants from '~/components/UiComponents/Button/variants';
import Button from '~/components/UiComponents/Button';

const CustomForm = ({ initialValues, fields, validationSchema, buttonForm, onSubmit, className = '' }) => {
    const [fileName, setFileName] = useState('');
    const driver = useSelector((state) => state.authentication.login?.currentDriver);
    const isAdmin = driver?.admin;
    const { t } = useTranslation();

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ setFieldValue }) => (
                <Form className={`form-container gap-6 rounded-lg sm:grid sm:grid-cols-4 ${className}`}>
                    {fields.map((field, index) => (
                        <div key={index} className='input-container'>
                            {/* LABEL */}
                            <label htmlFor={field.name} className='input-label'>
                                {t(field.label)}
                            </label>

                            {/* INPUT */}
                            {field.type === 'file' ? (
                                <div>
                                    <label
                                        htmlFor={`${field.name}-upload`}
                                        className='inline-block px-2 py-2 text-base text-white rounded bg-primary cursor-pointer hover:bg-secondary'
                                    >
                                        {fileName ? fileName : 'Select avatar'}
                                    </label>

                                    <input
                                        id={`${field.name}-upload`}
                                        type='file'
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            setFileName(file ? file.name : '');
                                            setFieldValue(field.name, file);
                                        }}
                                        className='hidden'
                                    />
                                </div>
                            ) : field.type === 'select' ? (
                                <Field as='select' name={field.name} className='focus:outline-none'>
                                    <option value=''>{t('Role')}</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {t(option.label)}
                                        </option>
                                    ))}
                                </Field>
                            ) : (
                                <>
                                    <Field
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={t(field.placeholder)}
                                        className='input-field dark:text-white'
                                    />
                                    <span className='input-highlight'></span>
                                </>
                            )}

                            {/* ERROR MESSAGE */}
                            <ErrorMessage
                                name={field.name}
                                component='div'
                                className='absolute -bottom-7 mt-1 whitespace-nowrap text-red-500 text-sm'
                            />
                        </div>
                    ))}

                    {/* BUTTON */}
                    <div className='col-span-4 flex justify-end space-x-4 mt-4'>
                        <Button className={variants.primaryBtn} type='submit'>
                            {t(buttonForm)}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CustomForm;
