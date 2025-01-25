import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './page.module.scss';
import { UserPlus } from 'lucide-react';
import { createEmpleado } from '../../../api/empleado';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
    nombre: Yup.string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
    edad: Yup.number()
        .required('La edad es requerida')
        .min(18, 'La edad mínima es 18 años')
        .max(100, 'La edad máxima es 100 años'),
    puesto: Yup.string()
        .required('El puesto es requerido')
        .min(3, 'El puesto debe tener al menos 3 caracteres')
});

export const ModalAdd = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: crearEmpleado, isPending, isError } = useMutation({
        mutationFn: (empleado: any) => createEmpleado(empleado),
        onSuccess: () => {
            setShowSuccess(true);
            queryClient.invalidateQueries({ queryKey: ['empleados'] });
        },
        onError: (error) => {
            console.error('Error:', error);
            alert('Error al agregar empleado');
        }
    });
    useEffect(() => {
        let timer: number;
        if (showSuccess) {
            timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        }
        return () => clearTimeout(timer);
    }, [showSuccess]);


    const handleSubmit = async (values: any, setSubmitting: any, resetForm: any) => {
        try {
            setSubmitting(true);
            crearEmpleado(values);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar empleado');
        } finally {
            setSubmitting(false);
            resetForm();
        }
    };
    return (
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <h2>
                    <UserPlus className="icon" />
                    Agregar Empleado
                </h2>
            </div>

            <Formik
                initialValues={{
                    nombre: '',
                    edad: 0,
                    puesto: ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values: any, { setSubmitting, resetForm }: any) => handleSubmit(values, setSubmitting, resetForm)}
            >
                {({  values,  handleChange }) => (
                    <Form>
                        <div className={styles.formGroup}>
                            <label htmlFor="nombre">Nombre</label>
                            <Field
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={styles.formInput}
                                value={values.nombre}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="nombre" component="div" className={styles.errorMessage} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="edad">Edad</label>
                            <Field
                                type="number"
                                id="edad"
                                name="edad"
                                className={styles.formInput}
                                value={values.edad}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="edad" component="div" className={styles.errorMessage} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="puesto">Puesto</label>
                            <Field
                                type="text"
                                id="puesto"
                                name="puesto"
                                className={styles.formInput}
                                value={values.puesto}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="puesto" component="div" className={styles.errorMessage} />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isPending}
                        >
                            {isPending ? 'Agregando...' : 'Agregar Empleado'}
                        </button>
                        {showSuccess && <p>Empleado creado exitosamente</p>}
                        {isError && <p>Error al agregar empleado</p>}
                    </Form>
                )}
            </Formik>
        </div>
    )
}
